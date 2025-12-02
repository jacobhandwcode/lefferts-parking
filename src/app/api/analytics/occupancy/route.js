import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Get real-time occupancy data
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lotId = searchParams.get('lot');
    const historical = searchParams.get('historical') === 'true';

    // Get current occupancy for all lots or specific lot
    const where = lotId ? { id: lotId } : {};
    const lots = await prisma.parkingLot.findMany({
      where,
      include: {
        _count: {
          select: {
            sessions: {
              where: { status: 'active' }
            }
          }
        }
      }
    });

    const occupancyData = lots.map(lot => ({
      lotId: lot.id,
      lotName: lot.name,
      capacity: lot.capacity,
      currentOccupancy: lot.currentOccupancy,
      activeSessions: lot._count.sessions,
      availableSpaces: lot.capacity - lot.currentOccupancy,
      occupancyPercentage: Math.round((lot.currentOccupancy / lot.capacity) * 100),
      status: lot.currentOccupancy >= lot.capacity ? 'full' : 
              lot.currentOccupancy / lot.capacity >= 0.9 ? 'nearly-full' :
              lot.currentOccupancy / lot.capacity >= 0.7 ? 'busy' : 'available'
    }));

    // Get historical data if requested
    let historicalData = null;
    if (historical) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setHours(startDate.getHours() - 24);

      const sessions = await prisma.parkingSession.findMany({
        where: {
          ...(lotId && { lotId }),
          OR: [
            {
              entryTime: { gte: startDate, lte: endDate }
            },
            {
              exitTime: { gte: startDate, lte: endDate }
            },
            {
              status: 'active'
            }
          ]
        },
        orderBy: { entryTime: 'asc' }
      });

      // Group by hour
      historicalData = {};
      for (let i = 0; i < 24; i++) {
        const hour = new Date(startDate);
        hour.setHours(hour.getHours() + i);
        const hourStr = hour.toISOString().slice(0, 13);
        
        historicalData[hourStr] = {
          hour: hourStr,
          occupancy: sessions.filter(s => {
            const entry = new Date(s.entryTime);
            const exit = s.exitTime ? new Date(s.exitTime) : new Date();
            return entry <= hour && exit >= hour;
          }).length
        };
      }
    }

    return NextResponse.json({
      current: occupancyData,
      historical: historicalData,
      timestamp: new Date().toISOString(),
      summary: {
        totalCapacity: lots.reduce((sum, lot) => sum + lot.capacity, 0),
        totalOccupancy: lots.reduce((sum, lot) => sum + lot.currentOccupancy, 0),
        totalAvailable: lots.reduce((sum, lot) => sum + (lot.capacity - lot.currentOccupancy), 0)
      }
    });

  } catch (error) {
    console.error('[Occupancy GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch occupancy data' },
      { status: 500 }
    );
  }
}

/**
 * Update occupancy (manual adjustment)
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const { lotId, adjustment, reason } = data;

    if (!lotId || adjustment === undefined) {
      return NextResponse.json(
        { error: 'Lot ID and adjustment required' },
        { status: 400 }
      );
    }

    const lot = await prisma.parkingLot.findUnique({
      where: { id: lotId }
    });

    if (!lot) {
      return NextResponse.json(
        { error: 'Lot not found' },
        { status: 404 }
      );
    }

    const newOccupancy = lot.currentOccupancy + adjustment;
    if (newOccupancy < 0) {
      return NextResponse.json(
        { error: 'Occupancy cannot be negative' },
        { status: 400 }
      );
    }

    if (newOccupancy > lot.capacity) {
      return NextResponse.json(
        { error: 'Occupancy cannot exceed capacity' },
        { status: 400 }
      );
    }

    // Update occupancy
    const updatedLot = await prisma.parkingLot.update({
      where: { id: lotId },
      data: { currentOccupancy: newOccupancy }
    });

    // Create audit log (as notification)
    await prisma.notification.create({
      data: {
        type: 'system',
        title: 'Manual Occupancy Adjustment',
        message: `${lot.name} occupancy adjusted by ${adjustment > 0 ? '+' : ''}${adjustment}. Reason: ${reason || 'No reason provided'}`,
        urgency: 'low',
        lotId,
        status: 'pending',
        metadata: {
          previousOccupancy: lot.currentOccupancy,
          newOccupancy,
          adjustment,
          reason
        }
      }
    });

    return NextResponse.json({
      success: true,
      lot: {
        id: updatedLot.id,
        name: updatedLot.name,
        previousOccupancy: lot.currentOccupancy,
        currentOccupancy: updatedLot.currentOccupancy,
        capacity: updatedLot.capacity
      }
    });

  } catch (error) {
    console.error('[Occupancy POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update occupancy' },
      { status: 500 }
    );
  }
}

/**
 * Get occupancy trends and predictions
 */
export async function HEAD(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lotId = searchParams.get('lot');
    const days = parseInt(searchParams.get('days') || '7');

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get sessions for analysis
    const sessions = await prisma.parkingSession.findMany({
      where: {
        ...(lotId && { lotId }),
        entryTime: { gte: startDate, lte: endDate }
      },
      select: {
        entryTime: true,
        exitTime: true,
        lotId: true
      }
    });

    // Analyze patterns by day of week and hour
    const patterns = {
      byDayOfWeek: {},
      byHour: {},
      peakTimes: []
    };

    // Initialize structures
    for (let i = 0; i < 7; i++) {
      patterns.byDayOfWeek[i] = { total: 0, count: 0 };
    }
    for (let i = 0; i < 24; i++) {
      patterns.byHour[i] = { total: 0, count: 0 };
    }

    // Analyze sessions
    sessions.forEach(session => {
      const entry = new Date(session.entryTime);
      const dayOfWeek = entry.getDay();
      const hour = entry.getHours();

      patterns.byDayOfWeek[dayOfWeek].total++;
      patterns.byDayOfWeek[dayOfWeek].count++;
      patterns.byHour[hour].total++;
      patterns.byHour[hour].count++;
    });

    // Find peak times
    const hourlyAverages = Object.entries(patterns.byHour)
      .map(([hour, data]) => ({
        hour: parseInt(hour),
        average: data.count > 0 ? data.total / days : 0
      }))
      .sort((a, b) => b.average - a.average);

    patterns.peakTimes = hourlyAverages.slice(0, 3).map(h => ({
      hour: h.hour,
      averageOccupancy: Math.round(h.average)
    }));

    // Calculate average duration
    const completedSessions = sessions.filter(s => s.exitTime);
    const averageDuration = completedSessions.length > 0
      ? completedSessions.reduce((sum, s) => {
          const duration = new Date(s.exitTime) - new Date(s.entryTime);
          return sum + duration;
        }, 0) / completedSessions.length / (1000 * 60 * 60) // Convert to hours
      : 0;

    return NextResponse.json({
      patterns,
      statistics: {
        totalSessions: sessions.length,
        averageSessionsPerDay: sessions.length / days,
        averageDurationHours: Math.round(averageDuration * 10) / 10,
        analysisperiod: { startDate, endDate, days }
      }
    });

  } catch (error) {
    console.error('[Occupancy HEAD] Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze occupancy trends' },
      { status: 500 }
    );
  }
}
