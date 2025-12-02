import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Vehicle Authorization Validation Endpoint
 * Checks if a vehicle is authorized to park
 */
export async function POST(request) {
  try {
    const { licensePlate, lotId, vanguardLotId } = await request.json();

    if (!licensePlate || (!lotId && !vanguardLotId)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Clean up license plate
    const cleanPlate = licensePlate.replace(/\s+/g, '').toUpperCase();

    // Get lot information
    let lot;
    if (vanguardLotId) {
      lot = await prisma.parkingLot.findFirst({
        where: { vanguardId: vanguardLotId }
      });
    } else {
      lot = await prisma.parkingLot.findUnique({
        where: { id: lotId }
      });
    }

    if (!lot) {
      return NextResponse.json(
        { error: 'Invalid lot identifier' },
        { status: 404 }
      );
    }

    // Check for valid permit
    const permit = await prisma.permit.findFirst({
      where: {
        licensePlate: cleanPlate,
        status: 'active',
        OR: [
          { globalAccess: true },
          { lotId: lot.id },
          { lotId: null }
        ]
      }
    });

    // Check for monthly permit expiry
    if (permit && permit.type === 'monthly' && permit.expiryDate) {
      if (new Date(permit.expiryDate) < new Date()) {
        // Permit expired, update status
        await prisma.permit.update({
          where: { id: permit.id },
          data: { status: 'inactive' }
        });
        
        return NextResponse.json({
          authorized: false,
          reason: 'Permit expired',
          permitType: permit.type,
          expiryDate: permit.expiryDate
        });
      }
    }

    // Check for active parking session with payment
    const activeSession = await prisma.parkingSession.findFirst({
      where: {
        licensePlate: cleanPlate,
        lotId: lot.id,
        status: 'active',
        paymentStatus: 'paid'
      }
    });

    // Check for unpaid violations
    const unpaidViolations = await prisma.violation.findMany({
      where: {
        licensePlate: cleanPlate,
        status: { in: ['issued', 'overdue'] }
      }
    });

    // Determine authorization
    let authorized = false;
    let reason = 'No valid permit or payment';
    let requiresPayment = true;

    if (permit) {
      authorized = true;
      reason = 'Valid permit';
      requiresPayment = false;
    } else if (activeSession) {
      authorized = true;
      reason = 'Paid session active';
      requiresPayment = false;
    } else if (unpaidViolations.length > 0) {
      authorized = false;
      reason = `Unpaid violations: ${unpaidViolations.length}`;
      requiresPayment = true;
    }

    const response = {
      authorized,
      reason,
      requiresPayment,
      licensePlate: cleanPlate,
      lot: {
        id: lot.id,
        name: lot.name,
        currentOccupancy: lot.currentOccupancy,
        capacity: lot.capacity,
        availableSpaces: lot.capacity - lot.currentOccupancy
      }
    };

    if (permit) {
      response.permit = {
        type: permit.type,
        expiryDate: permit.expiryDate,
        globalAccess: permit.globalAccess
      };
    }

    if (unpaidViolations.length > 0) {
      response.violations = unpaidViolations.map(v => ({
        id: v.id,
        amount: v.amount,
        reason: v.reason,
        date: v.violationTime
      }));
      response.totalOwed = unpaidViolations.reduce((sum, v) => sum + Number(v.amount), 0);
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('[Vanguard Validate] Error:', error);
    return NextResponse.json(
      { error: 'Validation failed', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for quick validation check
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const licensePlate = searchParams.get('plate');
    const lotId = searchParams.get('lot');

    if (!licensePlate) {
      return NextResponse.json(
        { error: 'License plate required' },
        { status: 400 }
      );
    }

    const cleanPlate = licensePlate.replace(/\s+/g, '').toUpperCase();

    // Quick check for any active permit
    const permit = await prisma.permit.findFirst({
      where: {
        licensePlate: cleanPlate,
        status: 'active'
      }
    });

    return NextResponse.json({
      hasPermit: !!permit,
      permitType: permit?.type || null,
      licensePlate: cleanPlate
    });

  } catch (error) {
    console.error('[Vanguard Validate GET] Error:', error);
    return NextResponse.json(
      { error: 'Validation failed' },
      { status: 500 }
    );
  }
}
