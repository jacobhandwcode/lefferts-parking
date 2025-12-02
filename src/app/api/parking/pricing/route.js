import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Get pricing rules
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lotId = searchParams.get('lot');
    const active = searchParams.get('active');
    const dayOfWeek = searchParams.get('day');

    const where = {};
    if (lotId) where.lotId = lotId;
    if (active !== null) where.active = active === 'true';
    if (dayOfWeek !== null) {
      where.dayOfWeek = { has: parseInt(dayOfWeek) };
    }

    const pricingRules = await prisma.pricingRule.findMany({
      where,
      include: {
        lot: {
          select: { name: true, id: true }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { lotId: 'asc' }
      ]
    });

    // Get current pricing for each lot
    const currentPricing = {};
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5);

    for (const rule of pricingRules) {
      if (!rule.active) continue;
      if (!rule.dayOfWeek.includes(currentDay)) continue;
      
      // Check if current time is within rule's time window
      if (currentTime >= rule.startTime && currentTime <= rule.endTime) {
        if (!currentPricing[rule.lotId] || rule.priority > currentPricing[rule.lotId].priority) {
          currentPricing[rule.lotId] = rule;
        }
      }
    }

    return NextResponse.json({
      rules: pricingRules,
      currentPricing,
      timestamp: now.toISOString()
    });

  } catch (error) {
    console.error('[Pricing GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing rules' },
      { status: 500 }
    );
  }
}

/**
 * Create or update pricing rule
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const {
      lotId,
      name,
      dayOfWeek,
      startTime,
      endTime,
      rate,
      type = 'fixed',
      surgeActive = false,
      surgeRate,
      surgeThreshold,
      maxRate,
      priority = 0,
      active = true,
      eventName
    } = data;

    // Validate required fields
    if (!lotId || !name || !dayOfWeek || !startTime || !endTime || !rate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

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

    // Create pricing rule
    const pricingRule = await prisma.pricingRule.create({
      data: {
        lotId,
        name,
        dayOfWeek: Array.isArray(dayOfWeek) ? dayOfWeek : [dayOfWeek],
        startTime,
        endTime,
        rate: parseFloat(rate),
        type,
        surgeActive,
        surgeRate: surgeRate ? parseFloat(surgeRate) : null,
        surgeThreshold: surgeThreshold ? parseInt(surgeThreshold) : null,
        maxRate: maxRate ? parseFloat(maxRate) : null,
        priority,
        active,
        eventName
      },
      include: {
        lot: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      pricingRule
    });

  } catch (error) {
    console.error('[Pricing POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create pricing rule' },
      { status: 500 }
    );
  }
}

/**
 * Update pricing rule
 */
export async function PATCH(request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Pricing rule ID required' },
        { status: 400 }
      );
    }

    // Convert numeric fields
    if (updateData.rate) updateData.rate = parseFloat(updateData.rate);
    if (updateData.surgeRate) updateData.surgeRate = parseFloat(updateData.surgeRate);
    if (updateData.maxRate) updateData.maxRate = parseFloat(updateData.maxRate);
    if (updateData.surgeThreshold) updateData.surgeThreshold = parseInt(updateData.surgeThreshold);
    if (updateData.dayOfWeek && !Array.isArray(updateData.dayOfWeek)) {
      updateData.dayOfWeek = [updateData.dayOfWeek];
    }

    const pricingRule = await prisma.pricingRule.update({
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
      pricingRule
    });

  } catch (error) {
    console.error('[Pricing PATCH] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update pricing rule' },
      { status: 500 }
    );
  }
}

/**
 * Delete pricing rule
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Pricing rule ID required' },
        { status: 400 }
      );
    }

    await prisma.pricingRule.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Pricing rule deleted'
    });

  } catch (error) {
    console.error('[Pricing DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete pricing rule' },
      { status: 500 }
    );
  }
}

/**
 * Calculate current price for a lot
 */
export async function HEAD(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lotId = searchParams.get('lot');
    const duration = parseInt(searchParams.get('duration') || '1'); // hours

    if (!lotId) {
      return NextResponse.json(
        { error: 'Lot ID required' },
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

    // Get current pricing rule
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5);

    const pricingRule = await prisma.pricingRule.findFirst({
      where: {
        lotId,
        active: true,
        dayOfWeek: { has: currentDay }
      },
      orderBy: { priority: 'desc' }
    });

    let baseRate = pricingRule?.rate || 5;
    let finalRate = baseRate;
    let surgeApplied = false;

    // Check for surge pricing
    if (pricingRule?.surgeActive && pricingRule.surgeThreshold) {
      const occupancyPercentage = (lot.currentOccupancy / lot.capacity) * 100;
      
      if (occupancyPercentage >= pricingRule.surgeThreshold) {
        if (pricingRule.surgeRate) {
          // Percentage surge
          finalRate = baseRate * (1 + pricingRule.surgeRate / 100);
        }
        surgeApplied = true;
      }
    }

    // Apply max rate cap
    if (pricingRule?.maxRate && finalRate > Number(pricingRule.maxRate)) {
      finalRate = Number(pricingRule.maxRate);
    }

    const totalAmount = finalRate * duration;

    return NextResponse.json({
      lotId,
      lotName: lot.name,
      duration,
      baseRate,
      finalRate: Math.round(finalRate * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      surgeApplied,
      occupancy: {
        current: lot.currentOccupancy,
        capacity: lot.capacity,
        percentage: Math.round((lot.currentOccupancy / lot.capacity) * 100)
      },
      pricingRule: pricingRule ? {
        name: pricingRule.name,
        type: pricingRule.type,
        eventName: pricingRule.eventName
      } : null
    });

  } catch (error) {
    console.error('[Pricing HEAD] Error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate price' },
      { status: 500 }
    );
  }
}
