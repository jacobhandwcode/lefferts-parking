import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Get transaction analytics
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lotId = searchParams.get('lot');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const licensePlate = searchParams.get('plate');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = {};
    if (lotId) where.lotId = lotId;
    if (type) where.type = type;
    if (status) where.status = status;
    if (licensePlate) where.licensePlate = licensePlate.replace(/\s+/g, '').toUpperCase();

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Get transactions with lot information
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.transaction.count({ where })
    ]);

    // Get lot information
    const lotIds = [...new Set(transactions.map(t => t.lotId).filter(Boolean))];
    const lots = await prisma.parkingLot.findMany({
      where: { id: { in: lotIds } },
      select: { id: true, name: true }
    });

    // Enhance transactions with lot names
    const enhancedTransactions = transactions.map(transaction => ({
      ...transaction,
      lotName: lots.find(l => l.id === transaction.lotId)?.name || 'Unknown'
    }));

    // Calculate summary statistics
    const stats = {
      total,
      totalAmount: transactions.reduce((sum, t) => sum + Number(t.amount), 0),
      byType: {},
      byStatus: {},
      byPaymentMethod: {}
    };

    // Group by type
    const typeGroups = await prisma.transaction.groupBy({
      by: ['type'],
      where,
      _sum: { amount: true },
      _count: true
    });

    typeGroups.forEach(group => {
      stats.byType[group.type] = {
        count: group._count,
        amount: Number(group._sum.amount) || 0
      };
    });

    // Group by status
    const statusGroups = await prisma.transaction.groupBy({
      by: ['status'],
      where,
      _count: true
    });

    statusGroups.forEach(group => {
      stats.byStatus[group.status] = group._count;
    });

    // Group by payment method
    const paymentGroups = await prisma.transaction.groupBy({
      by: ['paymentMethod'],
      where: { ...where, paymentMethod: { not: null } },
      _count: true
    });

    paymentGroups.forEach(group => {
      stats.byPaymentMethod[group.paymentMethod] = group._count;
    });

    return NextResponse.json({
      transactions: enhancedTransactions,
      stats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('[Transactions GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

/**
 * Export transactions as CSV
 */
export async function HEAD(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const lotId = searchParams.get('lot');
    const format = searchParams.get('format') || 'summary';

    const where = {};
    if (lotId) where.lotId = lotId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    if (format === 'detailed') {
      // Get all transactions for export
      const transactions = await prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      // Get lot names
      const lotIds = [...new Set(transactions.map(t => t.lotId).filter(Boolean))];
      const lots = await prisma.parkingLot.findMany({
        where: { id: { in: lotIds } },
        select: { id: true, name: true }
      });

      // Format for CSV
      const csvData = transactions.map(t => ({
        Date: new Date(t.createdAt).toISOString().split('T')[0],
        Time: new Date(t.createdAt).toTimeString().split(' ')[0],
        Type: t.type,
        Amount: t.amount,
        LicensePlate: t.licensePlate || '',
        Lot: lots.find(l => l.id === t.lotId)?.name || '',
        PaymentMethod: t.paymentMethod || '',
        Status: t.status,
        Reference: t.referenceId || '',
        Notes: t.notes || ''
      }));

      return NextResponse.json({
        format: 'detailed',
        count: csvData.length,
        data: csvData
      });
    } else {
      // Summary format
      const summary = await prisma.transaction.groupBy({
        by: ['type', 'status'],
        where,
        _sum: { amount: true },
        _count: true,
        _avg: { amount: true },
        _max: { amount: true },
        _min: { amount: true }
      });

      const summaryData = summary.map(s => ({
        Type: s.type,
        Status: s.status,
        Count: s._count,
        Total: Number(s._sum.amount) || 0,
        Average: Number(s._avg.amount) || 0,
        Min: Number(s._min.amount) || 0,
        Max: Number(s._max.amount) || 0
      }));

      return NextResponse.json({
        format: 'summary',
        count: summaryData.length,
        data: summaryData
      });
    }

  } catch (error) {
    console.error('[Transactions HEAD] Error:', error);
    return NextResponse.json(
      { error: 'Failed to export transactions' },
      { status: 500 }
    );
  }
}
