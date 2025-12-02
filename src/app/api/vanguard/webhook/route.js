import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Vanguard LPR Webhook Endpoint
 * Receives license plate recognition events from Vanguard system
 */
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Expected payload from Vanguard:
    // {
    //   eventType: "entry" | "exit" | "alert",
    //   licensePlate: "ABC 123",
    //   timestamp: "2024-01-01T12:00:00Z",
    //   vanguardLotId: "vanguard_lot_123",
    //   confidence: 95.5,
    //   imageUrl: "https://...",
    //   metadata: {}
    // }

    console.log('[Vanguard Webhook] Received event:', data);

    // Store the raw event
    const vanguardEvent = await prisma.vanguardEvent.create({
      data: {
        eventType: data.eventType,
        licensePlate: data.licensePlate.replace(/\s+/g, '').toUpperCase(),
        vanguardLotId: data.vanguardLotId,
        lotId: '', // Will be mapped from vanguardLotId
        timestamp: new Date(data.timestamp),
        confidence: data.confidence || null,
        imageUrl: data.imageUrl || null,
        rawData: data,
        processed: false
      }
    });

    // Map Vanguard lot ID to our lot ID
    const lot = await prisma.parkingLot.findFirst({
      where: { vanguardId: data.vanguardLotId }
    });

    if (!lot) {
      console.error('[Vanguard Webhook] Unknown lot ID:', data.vanguardLotId);
      return NextResponse.json(
        { error: 'Unknown lot ID', received: true },
        { status: 400 }
      );
    }

    // Update event with our lot ID
    await prisma.vanguardEvent.update({
      where: { id: vanguardEvent.id },
      data: { lotId: lot.id }
    });

    const cleanPlate = data.licensePlate.replace(/\s+/g, '').toUpperCase();

    // Process based on event type
    if (data.eventType === 'entry') {
      // Check if vehicle has valid permit
      const permit = await prisma.permit.findFirst({
        where: {
          licensePlate: cleanPlate,
          status: 'active',
          OR: [
            { globalAccess: true },
            { lotId: lot.id },
            { lotId: null } // Global permits
          ]
        }
      });

      // Check for existing active session
      const existingSession = await prisma.parkingSession.findFirst({
        where: {
          licensePlate: cleanPlate,
          lotId: lot.id,
          status: 'active'
        }
      });

      if (existingSession) {
        console.log('[Vanguard Webhook] Vehicle already has active session');
      } else {
        // Create new parking session
        const session = await prisma.parkingSession.create({
          data: {
            licensePlate: cleanPlate,
            lotId: lot.id,
            entryTime: new Date(data.timestamp),
            status: 'active',
            paymentStatus: permit ? 'paid' : 'unpaid',
            vanguardEventId: vanguardEvent.id
          }
        });

        // Update lot occupancy
        await prisma.parkingLot.update({
          where: { id: lot.id },
          data: { currentOccupancy: { increment: 1 } }
        });

        // Create notification if lot is getting full
        const occupancyPercentage = ((lot.currentOccupancy + 1) / lot.capacity) * 100;
        if (occupancyPercentage >= 90) {
          await prisma.notification.create({
            data: {
              type: 'occupancy',
              title: 'High Occupancy Alert',
              message: `${lot.name} is at ${Math.round(occupancyPercentage)}% capacity`,
              urgency: 'high',
              lotId: lot.id,
              status: 'pending'
            }
          });
        }

        console.log('[Vanguard Webhook] Created parking session:', session.id);
      }
    } else if (data.eventType === 'exit') {
      // Find active session
      const session = await prisma.parkingSession.findFirst({
        where: {
          licensePlate: cleanPlate,
          lotId: lot.id,
          status: 'active'
        }
      });

      if (session) {
        // Calculate parking duration and amount
        const exitTime = new Date(data.timestamp);
        const duration = Math.ceil((exitTime - session.entryTime) / (1000 * 60 * 60)); // hours

        // Get pricing for this time/day
        const dayOfWeek = exitTime.getDay();
        const currentTime = exitTime.toTimeString().slice(0, 5);
        
        const pricingRule = await prisma.pricingRule.findFirst({
          where: {
            lotId: lot.id,
            active: true,
            dayOfWeek: { has: dayOfWeek }
          },
          orderBy: { priority: 'desc' }
        });

        const hourlyRate = pricingRule?.rate || 5; // Default $5/hour
        const amount = duration * Number(hourlyRate);

        // Update session
        const updatedSession = await prisma.parkingSession.update({
          where: { id: session.id },
          data: {
            exitTime,
            status: session.paymentStatus === 'paid' ? 'completed' : 'violation',
            amount
          }
        });

        // Update lot occupancy
        await prisma.parkingLot.update({
          where: { id: lot.id },
          data: { currentOccupancy: { decrement: 1 } }
        });

        // Create violation if unpaid
        if (session.paymentStatus !== 'paid') {
          await prisma.violation.create({
            data: {
              licensePlate: cleanPlate,
              lotId: lot.id,
              reason: 'Unpaid parking',
              amount,
              vanguardEventId: vanguardEvent.id
            }
          });

          // Create notification
          await prisma.notification.create({
            data: {
              type: 'violation',
              title: 'Unpaid Exit Detected',
              message: `Vehicle ${cleanPlate} exited ${lot.name} without payment`,
              urgency: 'medium',
              lotId: lot.id,
              status: 'pending'
            }
          });
        }

        console.log('[Vanguard Webhook] Updated parking session:', updatedSession.id);
      } else {
        console.log('[Vanguard Webhook] No active session found for exit');
      }
    }

    // Mark event as processed
    await prisma.vanguardEvent.update({
      where: { id: vanguardEvent.id },
      data: { processed: true }
    });

    return NextResponse.json({ 
      received: true, 
      eventId: vanguardEvent.id,
      processed: true 
    });

  } catch (error) {
    console.error('[Vanguard Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook', details: error.message },
      { status: 500 }
    );
  }
}
