import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Get payment transactions
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const lotId = searchParams.get('lot');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = {};
    if (type) where.type = type;
    if (lotId) where.lotId = lotId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [transactions, total, revenue] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.transaction.count({ where }),
      prisma.transaction.aggregate({
        where: { ...where, status: 'completed' },
        _sum: { amount: true }
      })
    ]);

    return NextResponse.json({
      transactions,
      stats: {
        total,
        totalRevenue: revenue._sum.amount || 0
      },
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('[Payments GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

/**
 * Process payment confirmation
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const {
      licensePlate,
      amount,
      timestamp,
      provider,
      referenceId,
      lotId,
      type = 'parking'
    } = data;

    if (!licensePlate || !amount) {
      return NextResponse.json(
        { error: 'License plate and amount required' },
        { status: 400 }
      );
    }

    const cleanPlate = licensePlate.replace(/\s+/g, '').toUpperCase();

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Find active parking session
      let session = null;
      if (type === 'parking') {
        session = await tx.parkingSession.findFirst({
          where: {
            licensePlate: cleanPlate,
            status: 'active',
            ...(lotId && { lotId })
          },
          orderBy: { entryTime: 'desc' }
        });

        if (session) {
          // Update session payment status
          await tx.parkingSession.update({
            where: { id: session.id },
            data: {
              paymentStatus: 'paid',
              paymentRef: referenceId,
              amount: parseFloat(amount)
            }
          });
        }
      }

      // Check for violations
      if (type === 'violation') {
        const violations = await tx.violation.findMany({
          where: {
            licensePlate: cleanPlate,
            status: { in: ['issued', 'overdue'] },
            ...(lotId && { lotId })
          }
        });

        // Mark violations as paid
        for (const violation of violations) {
          await tx.violation.update({
            where: { id: violation.id },
            data: {
              status: 'paid',
              paidAt: new Date(),
              paymentRef: referenceId
            }
          });
        }
      }

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          type,
          amount: parseFloat(amount),
          licensePlate: cleanPlate,
          lotId: lotId || session?.lotId,
          paymentMethod: provider || 'app',
          referenceId,
          status: 'completed',
          notes: `Payment confirmed at ${timestamp || new Date().toISOString()}`
        }
      });

      // Create notification
      await tx.notification.create({
        data: {
          type: 'revenue',
          title: 'Payment Received',
          message: `Payment of $${amount} received from ${cleanPlate}`,
          urgency: 'low',
          lotId: lotId || session?.lotId,
          status: 'pending',
          metadata: {
            transactionId: transaction.id,
            amount,
            licensePlate: cleanPlate
          }
        }
      });

      return {
        transaction,
        sessionUpdated: !!session,
        sessionId: session?.id
      };
    });

    // Send confirmation to Vanguard (when integrated)
    // await notifyVanguard({ licensePlate: cleanPlate, paid: true });

    return NextResponse.json({
      success: true,
      ...result,
      message: 'Payment confirmed successfully'
    });

  } catch (error) {
    console.error('[Payments POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

/**
 * Refund a payment
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('id');
    const reason = searchParams.get('reason');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID required' },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    if (transaction.status === 'refunded') {
      return NextResponse.json(
        { error: 'Transaction already refunded' },
        { status: 400 }
      );
    }

    // Process refund
    const refundTransaction = await prisma.transaction.create({
      data: {
        type: 'refund',
        amount: -Math.abs(Number(transaction.amount)),
        licensePlate: transaction.licensePlate,
        lotId: transaction.lotId,
        paymentMethod: transaction.paymentMethod,
        referenceId: `REFUND-${transactionId}`,
        status: 'completed',
        notes: reason || 'Refund processed'
      }
    });

    // Update original transaction
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'refunded',
        notes: `${transaction.notes || ''}\nRefunded on ${new Date().toISOString()}: ${reason || 'No reason provided'}`
      }
    });

    return NextResponse.json({
      success: true,
      refundTransaction,
      originalTransaction: transactionId
    });

  } catch (error) {
    console.error('[Payments DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    );
  }
}
