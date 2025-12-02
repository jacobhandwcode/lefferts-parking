import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Get notifications
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const urgency = searchParams.get('urgency');
    const lotId = searchParams.get('lot');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (urgency) where.urgency = urgency;
    if (lotId) where.lotId = lotId;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        include: {
          lot: {
            select: { name: true, id: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.notification.count({ where })
    ]);

    // Count by status
    const statusCounts = await prisma.notification.groupBy({
      by: ['status'],
      _count: true
    });

    const stats = {
      total,
      pending: 0,
      accepted: 0,
      closed: 0,
      notified: 0
    };

    statusCounts.forEach(sc => {
      if (stats[sc.status] !== undefined) {
        stats[sc.status] = sc._count;
      }
    });

    // Count critical notifications
    const criticalCount = await prisma.notification.count({
      where: { urgency: 'critical', status: 'pending' }
    });

    stats.critical = criticalCount;

    return NextResponse.json({
      notifications,
      stats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('[Notifications GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

/**
 * Create a new notification
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const {
      type,
      title,
      message,
      urgency = 'low',
      lotId,
      metadata
    } = data;

    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'Type, title, and message are required' },
        { status: 400 }
      );
    }

    // Validate lot if provided
    if (lotId) {
      const lot = await prisma.parkingLot.findUnique({
        where: { id: lotId }
      });
      if (!lot) {
        return NextResponse.json(
          { error: 'Invalid lot ID' },
          { status: 404 }
        );
      }
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        urgency,
        lotId,
        metadata,
        status: 'pending'
      },
      include: {
        lot: {
          select: { name: true }
        }
      }
    });

    // TODO: Send real-time notification via WebSocket or SSE
    // broadcastNotification(notification);

    // TODO: Send email/SMS for critical notifications
    if (urgency === 'critical') {
      // await sendCriticalAlert(notification);
    }

    return NextResponse.json({
      success: true,
      notification
    });

  } catch (error) {
    console.error('[Notifications POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

/**
 * Update notification status
 */
export async function PATCH(request) {
  try {
    const data = await request.json();
    const { id, status, notes } = data;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Notification ID and status required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'accepted', 'closed', 'notified'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update notification
    const updateData = { status };
    if (notes) {
      const notification = await prisma.notification.findUnique({
        where: { id }
      });
      
      if (notification?.metadata) {
        updateData.metadata = {
          ...notification.metadata,
          notes: notes,
          statusUpdatedAt: new Date().toISOString()
        };
      } else {
        updateData.metadata = {
          notes,
          statusUpdatedAt: new Date().toISOString()
        };
      }
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: updateData,
      include: {
        lot: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      notification: updatedNotification
    });

  } catch (error) {
    console.error('[Notifications PATCH] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

/**
 * Mark multiple notifications as read/acknowledged
 */
export async function PUT(request) {
  try {
    const data = await request.json();
    const { ids, status = 'accepted' } = data;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Notification IDs required' },
        { status: 400 }
      );
    }

    // Update all notifications
    const result = await prisma.notification.updateMany({
      where: { id: { in: ids } },
      data: { status }
    });

    return NextResponse.json({
      success: true,
      updated: result.count
    });

  } catch (error) {
    console.error('[Notifications PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}

/**
 * Delete old notifications
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const daysOld = parseInt(searchParams.get('daysOld') || '30');
    const status = searchParams.get('status');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const where = {
      createdAt: { lt: cutoffDate }
    };

    if (status) where.status = status;

    const result = await prisma.notification.deleteMany({ where });

    return NextResponse.json({
      success: true,
      deleted: result.count,
      criteria: {
        olderThan: cutoffDate,
        status: status || 'any'
      }
    });

  } catch (error) {
    console.error('[Notifications DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete notifications' },
      { status: 500 }
    );
  }
}
