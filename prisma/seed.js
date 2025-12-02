import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Parking Lots
  const lots = await Promise.all([
    prisma.parkingLot.upsert({
      where: { name: 'Pacs' },
      update: {},
      create: {
        id: 'pacs',
        name: 'Pacs',
        vanguardId: 'vanguard_pacs_001',
        capacity: 150,
        currentOccupancy: 85,
        address: 'Pacs Parking Lot'
      }
    }),
    prisma.parkingLot.upsert({
      where: { name: '11 ST' },
      update: {},
      create: {
        id: '11st',
        name: '11 ST',
        vanguardId: 'vanguard_11st_002',
        capacity: 120,
        currentOccupancy: 72,
        address: '11 ST Parking Lot'
      }
    }),
    prisma.parkingLot.upsert({
      where: { name: '54 Flagler' },
      update: {},
      create: {
        id: '54flagler',
        name: '54 Flagler',
        vanguardId: 'vanguard_54flagler_003',
        capacity: 200,
        currentOccupancy: 156,
        address: '54 Flagler Parking Lot'
      }
    }),
    prisma.parkingLot.upsert({
      where: { name: '18 Lincoln' },
      update: {},
      create: {
        id: '18lincoln',
        name: '18 Lincoln',
        vanguardId: 'vanguard_18lincoln_004',
        capacity: 100,
        currentOccupancy: 78,
        address: '18 Lincoln Parking Lot'
      }
    }),
    prisma.parkingLot.upsert({
      where: { name: '72 Park' },
      update: {},
      create: {
        id: '72park',
        name: '72 Park',
        vanguardId: 'vanguard_72park_005',
        capacity: 180,
        currentOccupancy: 145,
        address: '72 Park Parking Lot'
      }
    })
  ]);

  console.log('✅ Created parking lots:', lots.map(l => l.name).join(', '));

  // Create Pricing Rules for each lot
  for (const lot of lots) {
    // Weekday regular pricing
    await prisma.pricingRule.create({
      data: {
        lotId: lot.id,
        name: 'Weekday Regular',
        dayOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
        startTime: '06:00',
        endTime: '18:00',
        rate: 5.00,
        type: 'fixed',
        priority: 1,
        active: true
      }
    });

    // Weekday evening pricing
    await prisma.pricingRule.create({
      data: {
        lotId: lot.id,
        name: 'Weekday Evening',
        dayOfWeek: [1, 2, 3, 4, 5],
        startTime: '18:00',
        endTime: '23:59',
        rate: 3.00,
        type: 'fixed',
        priority: 1,
        active: true
      }
    });

    // Weekend pricing
    await prisma.pricingRule.create({
      data: {
        lotId: lot.id,
        name: 'Weekend',
        dayOfWeek: [0, 6], // Sunday and Saturday
        startTime: '00:00',
        endTime: '23:59',
        rate: 4.00,
        type: 'fixed',
        priority: 1,
        active: true
      }
    });

    // Surge pricing rule
    await prisma.pricingRule.create({
      data: {
        lotId: lot.id,
        name: 'Surge Pricing',
        dayOfWeek: [0, 1, 2, 3, 4, 5, 6], // All days
        startTime: '00:00',
        endTime: '23:59',
        rate: 5.00,
        type: 'fixed',
        surgeActive: true,
        surgeRate: 20, // 20% increase
        surgeThreshold: 90, // When occupancy > 90%
        maxRate: 10.00,
        priority: 10, // Higher priority than regular pricing
        active: true
      }
    });
  }

  console.log('✅ Created pricing rules');

  // Create sample permits
  const permits = [
    {
      type: 'monthly',
      licensePlate: 'ABC123',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      mobile: '555-1234',
      company: 'Tech Corp',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'active',
      globalAccess: false,
      lotId: 'pacs',
      createdBy: 'admin'
    },
    {
      type: 'employee',
      licensePlate: 'EMP456',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@company.com',
      mobile: '555-2345',
      company: 'LF Parking',
      department: 'Operations',
      status: 'active',
      globalAccess: true,
      createdBy: 'admin'
    },
    {
      type: 'vip',
      licensePlate: 'VIP789',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'mchen@vip.com',
      mobile: '555-3456',
      company: 'Executive Partners',
      status: 'active',
      globalAccess: true,
      createdBy: 'admin'
    }
  ];

  for (const permit of permits) {
    await prisma.permit.create({ data: permit });
  }

  console.log('✅ Created sample permits');

  // Create sample active parking sessions
  const sessions = [
    {
      licensePlate: 'PKG111',
      lotId: 'pacs',
      entryTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'active',
      paymentStatus: 'paid',
      amount: 10.00
    },
    {
      licensePlate: 'PKG222',
      lotId: '11st',
      entryTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      status: 'active',
      paymentStatus: 'unpaid'
    },
    {
      licensePlate: 'PKG333',
      lotId: '54flagler',
      entryTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: 'active',
      paymentStatus: 'pending'
    }
  ];

  for (const session of sessions) {
    await prisma.parkingSession.create({ data: session });
  }

  console.log('✅ Created sample parking sessions');

  // Create sample violations
  const violations = [
    {
      licensePlate: 'VIO001',
      lotId: 'pacs',
      reason: 'Expired meter',
      amount: 25.00,
      status: 'issued'
    },
    {
      licensePlate: 'VIO002',
      lotId: '72park',
      reason: 'No permit displayed',
      amount: 50.00,
      status: 'issued'
    }
  ];

  for (const violation of violations) {
    await prisma.violation.create({ data: violation });
  }

  console.log('✅ Created sample violations');

  // Create sample notifications
  const notifications = [
    {
      type: 'occupancy',
      title: 'High Occupancy Alert',
      message: '54 Flagler is at 95% capacity',
      urgency: 'high',
      lotId: '54flagler',
      status: 'pending'
    },
    {
      type: 'revenue',
      title: 'Daily Revenue Target Achieved',
      message: 'Daily revenue target of $5,000 has been reached',
      urgency: 'low',
      status: 'pending'
    },
    {
      type: 'maintenance',
      title: 'Scheduled Maintenance',
      message: 'Camera maintenance scheduled for Pacs lot tomorrow at 10 AM',
      urgency: 'medium',
      lotId: 'pacs',
      status: 'pending'
    }
  ];

  for (const notification of notifications) {
    await prisma.notification.create({ data: notification });
  }

  console.log('✅ Created sample notifications');

  // Create sample transactions
  const now = new Date();
  const transactions = [];
  
  // Generate transactions for the last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random number of transactions per day
    const numTransactions = Math.floor(Math.random() * 20) + 10;
    
    for (let j = 0; j < numTransactions; j++) {
      const lotIndex = Math.floor(Math.random() * lots.length);
      const types = ['parking', 'permit', 'violation'];
      const typeIndex = Math.floor(Math.random() * types.length);
      
      transactions.push({
        type: types[typeIndex],
        amount: Math.random() * 50 + 5,
        licensePlate: `TXN${String(i).padStart(2, '0')}${String(j).padStart(3, '0')}`,
        lotId: lots[lotIndex].id,
        paymentMethod: ['credit_card', 'app', 'cash'][Math.floor(Math.random() * 3)],
        status: 'completed',
        createdAt: date
      });
    }
  }

  await prisma.transaction.createMany({ data: transactions });

  console.log(`✅ Created ${transactions.length} sample transactions`);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
