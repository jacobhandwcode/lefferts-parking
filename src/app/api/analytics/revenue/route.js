import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Get revenue analytics
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lotId = searchParams.get('lot');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const groupBy = searchParams.get('groupBy') || 'day'; // day, week, month

    // Date range defaults to last 30 days
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : (() => {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return d;
    })();

    // Base query conditions
    const where = {
      createdAt: { gte: start, lte: end },
      status: 'completed',
      ...(lotId && { lotId })
    };

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'asc' }
    });

    // Group revenue by period
    const revenueByPeriod = {};
    const revenueByCategoryy = {
      parking: 0,
      permit: 0,
      violation: 0,
      refund: 0
    };

    transactions.forEach(transaction => {
      const date = new Date(transaction.createdAt);
      let periodKey;

      switch (groupBy) {
        case 'month':
          periodKey = date.toISOString().slice(0, 7);
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          periodKey = weekStart.toISOString().slice(0, 10);
          break;
        default: // day
          periodKey = date.toISOString().slice(0, 10);
      }

      if (!revenueByPeriod[periodKey]) {
        revenueByPeriod[periodKey] = {
          revenue: 0,
          transactions: 0
        };
      }

      const amount = Number(transaction.amount);
      revenueByPeriod[periodKey].revenue += amount;
      revenueByPeriod[periodKey].transactions += 1;

      // Category breakdown
      if (revenueByCategoryy[transaction.type] !== undefined) {
        revenueByCategoryy[transaction.type] += amount;
      }
    });

    // Get revenue by lot if not filtered
    let revenueByLot = {};
    if (!lotId) {
      const lotRevenue = await prisma.transaction.groupBy({
        by: ['lotId'],
        where: {
          createdAt: { gte: start, lte: end },
          status: 'completed',
          lotId: { not: null }
        },
        _sum: { amount: true },
        _count: true
      });

      // Get lot names
      const lots = await prisma.parkingLot.findMany({
        select: { id: true, name: true }
      });

      lotRevenue.forEach(lr => {
        const lot = lots.find(l => l.id === lr.lotId);
        revenueByLot[lr.lotId] = {
          lotName: lot?.name || 'Unknown',
          revenue: Number(lr._sum.amount) || 0,
          transactions: lr._count
        };
      });
    }

    // Calculate totals and statistics
    const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalTransactions = transactions.length;
    const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    // Calculate growth rate
    const midPoint = new Date((start.getTime() + end.getTime()) / 2);
    const firstHalf = transactions.filter(t => new Date(t.createdAt) < midPoint);
    const secondHalf = transactions.filter(t => new Date(t.createdAt) >= midPoint);
    
    const firstHalfRevenue = firstHalf.reduce((sum, t) => sum + Number(t.amount), 0);
    const secondHalfRevenue = secondHalf.reduce((sum, t) => sum + Number(t.amount), 0);
    
    const growthRate = firstHalfRevenue > 0 
      ? ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100
      : 0;

    return NextResponse.json({
      summary: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalTransactions,
        averageTransaction: Math.round(averageTransaction * 100) / 100,
        growthRate: Math.round(growthRate * 10) / 10,
        period: { start, end }
      },
      byPeriod: revenueByPeriod,
      byCategory: revenueByCategoryy,
      byLot: revenueByLot
    });

  } catch (error) {
    console.error('[Revenue GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
}

/**
 * Get revenue comparison and benchmarks
 */
export async function HEAD(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lotId = searchParams.get('lot');
    const comparePeriod = searchParams.get('compare') || 'previous'; // previous, year

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    let previousStart, previousEnd;
    
    if (comparePeriod === 'year') {
      previousStart = new Date(now.getFullYear() - 1, now.getMonth(), 1);
      previousEnd = new Date(now.getFullYear() - 1, now.getMonth() + 1, 0);
    } else {
      previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      previousEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    }

    // Get current period revenue
    const currentRevenue = await prisma.transaction.aggregate({
      where: {
        createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
        status: 'completed',
        ...(lotId && { lotId })
      },
      _sum: { amount: true },
      _count: true
    });

    // Get previous period revenue
    const previousRevenue = await prisma.transaction.aggregate({
      where: {
        createdAt: { gte: previousStart, lte: previousEnd },
        status: 'completed',
        ...(lotId && { lotId })
      },
      _sum: { amount: true },
      _count: true
    });

    // Get today's revenue
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayRevenue = await prisma.transaction.aggregate({
      where: {
        createdAt: { gte: todayStart },
        status: 'completed',
        ...(lotId && { lotId })
      },
      _sum: { amount: true },
      _count: true
    });

    // Calculate targets (mock - would normally come from settings)
    const dailyTarget = 5000;
    const monthlyTarget = 150000;

    const current = Number(currentRevenue._sum.amount) || 0;
    const previous = Number(previousRevenue._sum.amount) || 0;
    const today = Number(todayRevenue._sum.amount) || 0;

    const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;

    return NextResponse.json({
      current: {
        revenue: Math.round(current * 100) / 100,
        transactions: currentRevenue._count,
        period: { start: currentMonthStart, end: currentMonthEnd }
      },
      previous: {
        revenue: Math.round(previous * 100) / 100,
        transactions: previousRevenue._count,
        period: { start: previousStart, end: previousEnd }
      },
      today: {
        revenue: Math.round(today * 100) / 100,
        transactions: todayRevenue._count,
        progress: Math.round((today / dailyTarget) * 100)
      },
      comparison: {
        change: Math.round(change * 10) / 10,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
      },
      targets: {
        daily: dailyTarget,
        monthly: monthlyTarget,
        monthlyProgress: Math.round((current / monthlyTarget) * 100)
      }
    });

  } catch (error) {
    console.error('[Revenue HEAD] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get revenue comparison' },
      { status: 500 }
    );
  }
}
