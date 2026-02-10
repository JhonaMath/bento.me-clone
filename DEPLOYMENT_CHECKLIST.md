# Deployment Checklist

## Pre-Deployment

### 1. Environment Setup
- [ ] Create PostgreSQL database
- [ ] Set `DATABASE_URL` environment variable
- [ ] Generate and set `NEXTAUTH_SECRET` (32+ characters)
- [ ] Set `NEXTAUTH_URL` to your production domain

### 2. Database Migration
```bash
# Apply all migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# (Optional) Seed demo data
npm run db:seed
```

### 3. Build Verification
```bash
# Install dependencies
npm install

# Run build
npm run build

# Verify no TypeScript errors
npm run lint
```

## Deployment

### Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (auto-populated)
   - `NEXTAUTH_SECRET`
4. Deploy

### Render
1. Create new Web Service
2. Connect GitHub repository
3. Configure:
   - Build Command: `npm run build`
   - Start Command: `npm start`
4. Add environment variables
5. Deploy

### Fly.io
```bash
fly launch
fly secrets set \
  DATABASE_URL="postgresql://..." \
  NEXTAUTH_SECRET="..." \
  NEXTAUTH_URL="https://your-app.fly.dev"
fly deploy
```

### Docker
```bash
# Build image
docker build -t bento-clone .

# Run with environment
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e NEXTAUTH_URL="..." \
  -e NEXTAUTH_SECRET="..." \
  bento-clone
```

## Post-Deployment

### 1. Verify Health
- [ ] Visit homepage loads
- [ ] Signup creates account
- [ ] Login works
- [ ] Create workspace
- [ ] Create profile
- [ ] Public profile accessible

### 2. Test Multi-Tenancy
- [ ] Create second workspace
- [ ] Verify workspace isolation
- [ ] Test role permissions
- [ ] Check analytics tracking

### 3. Security Checklist
- [ ] HTTPS enabled
- [ ] Environment variables secure
- [ ] Database connection encrypted
- [ ] CORS configured if needed
- [ ] Rate limiting (optional)

### 4. Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure logging
- [ ] Monitor database performance
- [ ] Track API response times

## Migration from Old Schema

If upgrading from the previous version without multi-tenancy:

### 1. Backup Database
```bash
pg_dump -U user -d bentoclone > backup.sql
```

### 2. Create Migration
```bash
npx prisma migrate dev --name add_multi_tenancy
```

### 3. Data Migration Script
Create a script to:
1. Create Membership records for existing Tenant owners
2. Add default values for new Profile fields (tagline1, tagline2, themeJson)
3. Update Click records with tenantId

### 4. Verify Migration
- Check all users have memberships
- Verify profiles display correctly
- Test analytics still work

## Rollback Plan

If issues occur:

1. Restore database from backup:
```bash
psql -U user -d bentoclone < backup.sql
```

2. Revert to previous deployment

3. Investigate and fix issues

## Performance Optimization

### Database
- [ ] Add indexes on frequently queried columns
- [ ] Enable connection pooling
- [ ] Set up read replicas if needed

### Application
- [ ] Enable Next.js static generation where possible
- [ ] Configure CDN for static assets
- [ ] Implement caching strategy

### Monitoring Queries
```sql
-- Check slow queries
SELECT * FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- Check index usage
SELECT * FROM pg_stat_user_indexes;
```

## Scaling Considerations

### Horizontal Scaling
- Use session store (Redis) for multi-instance deployments
- Implement job queue for async tasks
- Consider microservices for heavy workloads

### Database Scaling
- Connection pooling (PgBouncer)
- Read replicas for analytics
- Partitioning for Click table

## Support

For issues:
- GitHub Issues: https://github.com/JhonaMath/bento.me-clone/issues
- Documentation: README.md
- Database Schema: prisma/schema.prisma
