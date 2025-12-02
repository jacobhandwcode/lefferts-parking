import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Get parking sessions
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lotId = searchParams.get('lot');
    const status = searchParams.get('status');
    const licensePlate = searchParams.get('plate');
    const date = searchParams.get('date');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = {};
    if (lotId) where.lotId = lotId;
    if (status) where.status = status;
    if (licensePlate) where.licensePlate = licensePlate.replace(/\s+/g, '').toUpperCase();
    
    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      where.entryTime = {
        gte: startDate,
        lte: endDate
      };
    }

    const [sessions, total] = await Promise.all([
      prisma.parkingSession.findMany({
        where,
        include: {
          lot: {
            select: { name: true, id: true }
          }
        },
        orderBy: { entryTime: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.parkingSession.count({ where })
    ]);

    // Calculate statistics
    const stats = {
      total,
      active: await prisma.parkingSession.count({ 
        where: { ...where, status: 'active' } 
      }),
      completed: await prisma.parkingSession.count({ 
        where: { ...where, status: 'completed' } 
      }),
      violations: await prisma.parkingSession.count({ 
        where: { ...where, status: 'violation' } 
      })
    };

    return NextResponse.json({
      sessions,
      stats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('[Sessions GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

/**
 * Create a new parking session (manual entry)
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const { licensePlate, lotId, entryTime } = data;

    if (!licensePlate || !lotId) {
      return NextResponse.json(
        { error: 'License plate and lot ID required' },
        { status: 400 }
      );
    }

    const cleanPlate = licensePlate.replace(/\s+/g, '').toUpperCase();

    // Check for existing active session
    const existingSession = await prisma.parkingSession.findFirst({
      where: {
        licensePlate: cleanPlate,
        lotId,
        status: 'active'
      }
    });

    if (existingSession) {
      return NextResponse.json(
        { error: 'Vehicle already has an active session in this lot' },
        { status: 409 }
      );
    }

    // Check for permit
    const permit = await prisma.permit.findFirst({
      where: {
        licensePlate: cleanPlate,
        status: 'active',
        OR: [
          { globalAccess: true },
          { lotId },
          { lotId: null }
        ]
      }
    });

    // Create session
    const session = await prisma.parkingSession.create({
      data: {
        licensePlate: cleanPlate,
        lotId,
        entryTime: entryTime ? new Date(entryTime) : new Date(),
        status: 'active',
        paymentStatus: permit ? 'paid' : 'unpaid'
      },
      include: {
        lot: {
          select: { name: true }
        }
      }
    });

    // Update lot occupancy
    await prisma.parkingLot.update({
      where: { id: lotId },
      data: { currentOccupancy: { increment: 1 } }
    });

    return NextResponse.json({
      success: true,
      session,
      hasPermit: !!permit,
      permitType: permit?.type
    });

  } catch (error) {
    console.error('[Sessions POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

/**
 * Update a parking session (exit, payment update)
 */
export async function PATCH(request) {
  try {
    const data = await request.json();
    const { id, exitTime, paymentStatus, paymentRef, amount } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const session = await prisma.parkingSession.findUnique({
      where: { id }
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const updateData = {};
    
    if (exitTime) {
      updateData.exitTime = new Date(exitTime);
      updateData.status = 'completed';
      
      // Calculate amount if not provided
      if (!amount && !session.amount) {
        const duration = Math.ceil(
          (updateData.exitTime - session.entryTime) / (1000 * 60 * 60)
        );
        
        // Get pricing
        const pricingRule = await prisma.pricingRule.findFirst({
          where: {
            lotId: session.lotId,
            active: true
          },
          orderBy: { priority: 'desc' }
        });
        
        updateData.amount = duration * (Number(pricingRule?.rate) || 5);
      }
      
      // Update lot occupancy
      await prisma.parkingLot.update({
        where: { id: session.lotId },
        data: { currentOccupancy: { decrement: 1 } }
      });
    }

    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (paymentRef) updateData.paymentRef = paymentRef;
    if (amount) updateData.amount = parseFloat(amount);

    const updatedSession = await prisma.parkingSession.update({
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
      session: updatedSession
    });

  } catch (error) {
    console.error('[Sessions PATCH] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

/**
 * Get active sessions summary by lot
 */
export async function HEAD(request) {
  try {
    const activeSessions = await prisma.parkingSession.groupBy({
      by: ['lotId'],
      where: { status: 'active' },
      _count: true
    });

    const lots = await prisma.parkingLot.findMany({
      select: { id: true, name: true, capacity: true, currentOccupancy: true }
    });

    const summary = lots.map(lot => {
      const sessionCount = activeSessions.find(s => s.lotId === lot.id)?._count || 0;
      return {
        lotId: lot.id,
        lotName: lot.name,
        activeSessions: sessionCount,
        currentOccupancy: lot.currentOccupancy,
        capacity: lot.capacity,
        occupancyPercentage: Math.round((lot.currentOccupancy / lot.capacity) * 100)
      };
    });

    return NextResponse.json({ summary });
    
  } catch (error) {
    console.error('[Sessions HEAD] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get summary' },
      { status: 500 }
    );
  }
}
