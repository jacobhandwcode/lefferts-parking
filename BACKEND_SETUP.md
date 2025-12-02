# LF Parking Management System - Backend Setup

## Overview
The backend is built using Next.js API Routes with Prisma ORM for database management. It's designed to integrate with Vanguard LPR systems and various payment providers.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy the example environment file and configure:
```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:
- **DATABASE_URL**: Your PostgreSQL connection string
- **VANGUARD_API_KEY**: Vanguard LPR system credentials
- **Payment provider keys**: Stripe, Square, or your provider

### 3. Setup Database
```bash
# Push schema to database
npm run db:push

# Or use migrations
npm run db:migrate

# Seed with sample data
npm run db:seed

# Open Prisma Studio to view data
npm run db:studio
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:4028`

## API Endpoints

### Vanguard Integration
- **POST** `/api/vanguard/webhook` - Receives LPR events
- **POST** `/api/vanguard/validate` - Validates vehicle authorization
- **GET/POST/PATCH** `/api/vanguard/violations` - Manage violations

### Parking Operations
- **GET/POST/PATCH** `/api/parking/sessions` - Parking sessions
- **POST** `/api/parking/payments` - Payment confirmations
- **GET/POST/PATCH/DELETE** `/api/parking/permits` - Permit management
- **GET/POST/PATCH/DELETE** `/api/parking/pricing` - Pricing rules

### Analytics
- **GET/POST** `/api/analytics/occupancy` - Real-time occupancy
- **GET** `/api/analytics/revenue` - Revenue analytics
- **GET** `/api/analytics/transactions` - Transaction reports

### Notifications
- **GET/POST/PATCH/PUT/DELETE** `/api/notifications` - System notifications

## Database Schema

### Core Tables
- **ParkingLot** - Parking facility configuration
- **ParkingSession** - Active and historical parking sessions
- **Permit** - Monthly, Employee, and VIP permits
- **Violation** - Parking violations
- **PricingRule** - Dynamic pricing configuration
- **Transaction** - Financial transactions
- **Notification** - System alerts and notifications
- **VanguardEvent** - LPR event log

## Integration Points

### Vanguard LPR System
The system expects webhook events from Vanguard in this format:
```json
{
  "eventType": "entry|exit|alert",
  "licensePlate": "ABC 123",
  "timestamp": "2024-01-01T12:00:00Z",
  "vanguardLotId": "vanguard_lot_123",
  "confidence": 95.5,
  "imageUrl": "https://..."
}
```

### Payment Processing Flow
1. Payment provider confirms payment
2. POST to `/api/parking/payments` with:
```json
{
  "licensePlate": "ABC123",
  "amount": 25.00,
  "provider": "stripe",
  "referenceId": "pi_xxxxx",
  "lotId": "pacs"
}
```
3. System updates parking session and clears violations

### Violation Flow
1. Unpaid exit detected via Vanguard webhook
2. Violation created automatically
3. Integration with PayParkingNotice portal
4. Payment confirmation updates violation status

## Development Tools

### Prisma Studio
Visual database editor:
```bash
npm run db:studio
```

### Database Reset
Reset and reseed database:
```bash
npm run db:reset
```

### Mock Mode
Set `MOCK_MODE=true` in `.env.local` to bypass external API calls during development.

## Production Deployment

### Database Migration
```bash
npx prisma migrate deploy
```

### Environment Variables
Ensure all production environment variables are set:
- Database credentials
- API keys for Vanguard, payment providers
- Email/SMS service credentials
- File storage configuration

### Health Check
The system includes health check endpoints:
- `/api/health` - Basic health check
- `/api/health/db` - Database connectivity

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format
- Check network connectivity
- Ensure database server is running

### Vanguard Integration
- Verify webhook URL is accessible
- Check VANGUARD_API_KEY
- Monitor webhook logs in VanguardEvent table

### Payment Issues
- Verify payment provider credentials
- Check webhook configuration
- Review transaction logs

## Support
For issues or questions, refer to the main documentation or contact the development team.
