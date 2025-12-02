import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Get violations (with filters)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const licensePlate = searchParams.get('plate');
    const lotId = searchParams.get('lot');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = {};
    if (licensePlate) where.licensePlate = licensePlate.replace(/\s+/g, '').toUpperCase();
    if (lotId) where.lotId = lotId;
    if (status) where.status = status;

    const [violations, total] = await Promise.all([
      prisma.violation.findMany({
        where,
        include: {
          lot: {
            select: { name: true, id: true }
          }
        },
        orderBy: { violationTime: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.violation.count({ where })
    ]);

    return NextResponse.json({
      violations,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('[Violations GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch violations' },
      { status: 500 }
    );
  }
}

/**
 * Create a new violation
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const {
      licensePlate,
      lotId,
      reason,
      amount,
      officerId,
      notes,
      imageUrl
    } = data;

    // Validate required fields
    if (!licensePlate || !lotId || !reason || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Clean license plate
    const cleanPlate = licensePlate.replace(/\s+/g, '').toUpperCase();

    // Verify lot exists
    const lot = await prisma.parkingLot.findUnique({
      where: { id: lotId }
    });

    if (!lot) {
      return NextResponse.json(
        { error: 'Invalid lot ID' },
        { status: 404 }
      );
    }

    // Create violation
    const violation = await prisma.violation.create({
      data: {
        licensePlate: cleanPlate,
        lotId,
        reason,
        amount: parseFloat(amount),
        officerId,
        notes,
        imageUrl,
        status: 'issued'
      },
      include: {
        lot: {
          select: { name: true }
        }
      }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        type: 'violation',
        title: 'New Violation Issued',
        message: `Violation issued to ${cleanPlate} at ${lot.name}: ${reason}`,
        urgency: 'medium',
        lotId,
        status: 'pending',
        metadata: {
          violationId: violation.id,
          amount: amount
        }
      }
    });

    // Check if vehicle has an active session and update it
    await prisma.parkingSession.updateMany({
      where: {
        licensePlate: cleanPlate,
        lotId,
        status: 'active'
      },
      data: {
        status: 'violation'
      }
    });

    return NextResponse.json({
      success: true,
      violation
    });

  } catch (error) {
    console.error('[Violations POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create violation' },
      { status: 500 }
    );
  }
}

/**
 * Update violation (payment, dismissal, appeal)
 */
export async function PATCH(request) {
  try {
    const data = await request.json();
    const { id, status, paymentRef, notes } = data;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Violation ID and status required' },
        { status: 400 }
      );
    }

    // Get current violation
    const violation = await prisma.violation.findUnique({
      where: { id }
    });

    if (!violation) {
      return NextResponse.json(
        { error: 'Violation not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {
      status,
      updatedAt: new Date()
    };

    if (status === 'paid') {
      updateData.paidAt = new Date();
      updateData.paymentRef = paymentRef;
    }

    if (notes) {
      updateData.notes = violation.notes 
        ? `${violation.notes}\n${new Date().toISOString()}: ${notes}`
        : notes;
    }

    // Update violation
    const updatedViolation = await prisma.violation.update({
      where: { id },
      data: updateData,
      include: {
        lot: {
          select: { name: true }
        }
      }
    });

    // If paid, create transaction record
    if (status === 'paid') {
      await prisma.transaction.create({
        data: {
          type: 'violation',
          amount: violation.amount,
          licensePlate: violation.licensePlate,
          lotId: violation.lotId,
          paymentMethod: 'app',
          referenceId: violation.id,
          status: 'completed'
        }
      });

      // Update any active sessions for this vehicle
      await prisma.parkingSession.updateMany({
        where: {
          licensePlate: violation.licensePlate,
          lotId: violation.lotId,
          status: 'violation'
        },
        data: {
          status: 'completed',
          paymentStatus: 'paid',
          paymentRef
        }
      });
    }

    return NextResponse.json({
      success: true,
      violation: updatedViolation
    });

  } catch (error) {
    console.error('[Violations PATCH] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update violation' },
      { status: 500 }
    );
  }
}
