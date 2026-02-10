# Deployment Guide

This guide will help you deploy the Profile Builder application.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- PostgreSQL database (or use Docker Compose)

## Quick Start with Docker

The easiest way to run the application is with Docker Compose:

1. Clone the repository:
```bash
git clone https://github.com/JhonaMath/bento.me-clone.git
cd bento.me-clone
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your production values:
```env
DATABASE_URL="postgresql://user:password@postgres:5432/bentoclone?schema=public"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-a-random-secret-key-here"
```

To generate a secure secret for NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

4. Start the application:
```bash
docker-compose up -d
```

5. The application will be available at http://localhost:3000

## Manual Deployment

### 1. Database Setup

Create a PostgreSQL database and update your `.env` file with the connection string.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Database Migrations

```bash
npx prisma migrate deploy
```

### 4. Build the Application

```bash
npm run build
```

### 5. Start the Production Server

```bash
npm start
```

## Environment Variables

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Full URL of your application (e.g., https://yourdomain.com)
- `NEXTAUTH_SECRET`: Random secret key for NextAuth.js

## Production Considerations

### Security

1. **NEXTAUTH_SECRET**: Always use a strong, randomly generated secret in production
2. **Database**: Use SSL connections for database in production
3. **HTTPS**: Always use HTTPS in production (configure reverse proxy like Nginx)
4. **Rate Limiting**: Consider adding rate limiting to API endpoints
5. **CORS**: Configure CORS settings if needed

### Performance

1. **Database Indexes**: The schema includes necessary indexes for common queries
2. **Caching**: Consider adding Redis for session caching
3. **CDN**: Use a CDN for static assets
4. **Database Connection Pooling**: Configure Prisma connection pooling

### Monitoring

1. Set up logging for errors and important events
2. Monitor database performance
3. Track API response times
4. Set up alerts for critical failures

## Scaling

### Horizontal Scaling

The application is stateless and can be horizontally scaled:

1. Run multiple instances behind a load balancer
2. Use a shared PostgreSQL database
3. Use a shared session store (Redis recommended)

### Database Scaling

1. Enable connection pooling in Prisma
2. Use read replicas for read-heavy workloads
3. Consider database partitioning for large datasets

## Backup and Recovery

### Database Backups

Set up regular PostgreSQL backups:

```bash
# Backup
pg_dump -h localhost -U user bentoclone > backup.sql

# Restore
psql -h localhost -U user bentoclone < backup.sql
```

### File Backups

If you add file uploads in the future, ensure regular backups of:
- User uploaded files
- Profile avatars
- Any other media

## Troubleshooting

### Connection Issues

If you can't connect to the database:
1. Check DATABASE_URL is correct
2. Verify PostgreSQL is running
3. Check firewall rules
4. Verify network connectivity

### Build Issues

If the build fails:
1. Clear `.next` folder: `rm -rf .next`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Check Node.js version: `node --version` (should be 18+)

### Migration Issues

If migrations fail:
1. Check database connection
2. Verify database user has necessary permissions
3. Check for conflicting migrations
4. Reset database if in development: `npx prisma migrate reset`

## Updating

To update the application:

1. Pull the latest code
2. Install dependencies: `npm install`
3. Run migrations: `npx prisma migrate deploy`
4. Build: `npm run build`
5. Restart the application

## Support

For issues and questions, please open an issue on GitHub.
