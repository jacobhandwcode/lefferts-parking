import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Get permits
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const lotId = searchParams.get('lot');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (lotId) {
      where.OR = [
        { lotId },
        { globalAccess: true }
      ];
    }

    // Search by name, license plate, or email
    if (search) {
      where.OR = [
        { licensePlate: { contains: search.toUpperCase(), mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [permits, total] = await Promise.all([
      prisma.permit.findMany({
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
      prisma.permit.count({ where })
    ]);

    // Get statistics by type
    const stats = await prisma.permit.groupBy({
      by: ['type', 'status'],
      _count: true
    });

    const typeStats = {
      monthly: { active: 0, inactive: 0 },
      employee: { active: 0, inactive: 0 },
      vip: { active: 0, inactive: 0 }
    };

    stats.forEach(stat => {
      if (typeStats[stat.type]) {
        typeStats[stat.type][stat.status] = stat._count;
      }
    });

    return NextResponse.json({
      permits,
      stats: {
        total,
        byType: typeStats
      },
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('[Permits GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch permits' },
      { status: 500 }
    );
  }
}

/**
 * Create a new permit
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const {
      type,
      licensePlate,
      firstName,
      lastName,
      email,
      mobile,
      company,
      department,
      expiryDate,
      globalAccess = false,
      lotId,
      createdBy = 'admin',
      notes
    } = data;

    // Validate required fields
    if (!type || !licensePlate || !firstName || !lastName || !email || !mobile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const cleanPlate = licensePlate.replace(/\s+/g, '').toUpperCase();

    // Check for existing permit
    const existingPermit = await prisma.permit.findFirst({
      where: {
        licensePlate: cleanPlate,
        type,
        status: 'active'
      }
    });

    if (existingPermit) {
      return NextResponse.json(
        { error: 'Active permit already exists for this vehicle and type' },
        { status: 409 }
      );
    }

    // For monthly permits, set expiry date if not provided
    let permitExpiryDate = null;
    if (type === 'monthly') {
      if (expiryDate) {
        permitExpiryDate = new Date(expiryDate);
      } else {
        // Default to end of next month
        const now = new Date();
        permitExpiryDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      }
    }

    // Create permit
    const permit = await prisma.permit.create({
      data: {
        type,
        licensePlate: cleanPlate,
        firstName,
        lastName,
        email,
        mobile,
        company,
        department,
        expiryDate: permitExpiryDate,
        status: 'active',
        globalAccess,
        lotId: globalAccess ? null : lotId,
        createdBy,
        notes
      },
      include: {
        lot: {
          select: { name: true }
        }
      }
    });

    // Create transaction record for monthly permits
    if (type === 'monthly') {
      const monthlyRate = 400; // Default monthly rate
      await prisma.transaction.create({
        data: {
          type: 'permit',
          amount: monthlyRate,
          licensePlate: cleanPlate,
          lotId,
          paymentMethod: 'credit_card',
          referenceId: permit.id,
          status: 'completed',
          notes: `Monthly permit created for ${firstName} ${lastName}`
        }
      });
    }

    // Create notification
    await prisma.notification.create({
      data: {
        type: 'system',
        title: 'New Permit Created',
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} permit created for ${cleanPlate}`,
        urgency: 'low',
        lotId: globalAccess ? null : lotId,
        status: 'pending',
        metadata: {
          permitId: permit.id,
          type,
          licensePlate: cleanPlate
        }
      }
    });

    return NextResponse.json({
      success: true,
      permit
    });

  } catch (error) {
    console.error('[Permits POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create permit' },
      { status: 500 }
    );
  }
}

/**
 * Update a permit
 */
export async function PATCH(request) {
  try {
    const data = await request.json();
    const {
      id,
      status,
      expiryDate,
      notes,
      globalAccess,
      lotId,
      ...updateFields
    } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Permit ID required' },
        { status: 400 }
      );
    }

    const permit = await prisma.permit.findUnique({
      where: { id }
    });

    if (!permit) {
      return NextResponse.json(
        { error: 'Permit not found' },
        { status: 404 }
      );
    }

    const updateData = { ...updateFields };
    
    if (status) updateData.status = status;
    if (expiryDate) updateData.expiryDate = new Date(expiryDate);
    if (notes !== undefined) updateData.notes = notes;
    if (globalAccess !== undefined) {
      updateData.globalAccess = globalAccess;
      updateData.lotId = globalAccess ? null : (lotId || permit.lotId);
    }

    const updatedPermit = await prisma.permit.update({
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
      permit: updatedPermit
    });

  } catch (error) {
    console.error('[Permits PATCH] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update permit' },
      { status: 500 }
    );
  }
}

/**
 * Delete/Deactivate a permit
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';

    if (!id) {
      return NextResponse.json(
        { error: 'Permit ID required' },
        { status: 400 }
      );
    }

    if (permanent) {
      // Permanently delete
      await prisma.permit.delete({
        where: { id }
      });

      return NextResponse.json({
        success: true,
        message: 'Permit permanently deleted'
      });
    } else {
      // Soft delete (deactivate)
      const permit = await prisma.permit.update({
        where: { id },
        data: { status: 'inactive' }
      });

      return NextResponse.json({
        success: true,
        message: 'Permit deactivated',
        permit
      });
    }

  } catch (error) {
    console.error('[Permits DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete permit' },
      { status: 500 }
    );
  }
}
