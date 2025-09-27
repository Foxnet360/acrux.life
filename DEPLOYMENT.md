# Acrux Deployment Guide

## Overview
Acrux is a Next.js application that can be deployed to various platforms. This guide covers deployment to Vercel (recommended) and other platforms.

## Prerequisites

### Environment Variables
Create the following environment variables in your deployment platform:

```bash
# Database
DATABASE_URL="your-postgresql-connection-string"

# NextAuth.js
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secure-random-secret"

# Optional: For production database
SHADOW_DATABASE_URL="your-shadow-database-url"
```

### Database Setup
1. Set up a PostgreSQL database (e.g., Vercel Postgres, Supabase, or AWS RDS)
2. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Vercel Deployment (Recommended)

### Automatic Deployment
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and configure the build settings
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
```

## Alternative Deployment Options

### Netlify
```bash
# Build command
npm run build

# Publish directory
.next

# Add environment variables in Netlify dashboard
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Railway
1. Connect GitHub repository
2. Add PostgreSQL database
3. Set environment variables
4. Deploy

## Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] SSL certificate active
- [ ] Domain configured
- [ ] Monitoring set up
- [ ] Backup strategy in place

## Performance Optimization

### Vercel Optimizations
- Automatic Image Optimization enabled
- Edge Functions for API routes
- Automatic scaling

### Database Optimization
- Connection pooling configured
- Indexes on frequently queried columns
- Query optimization with Prisma

## Monitoring

### Vercel Analytics
- Real user monitoring
- Performance metrics
- Error tracking

### Database Monitoring
- Query performance monitoring
- Connection pool monitoring
- Backup verification

## Security

- [ ] HTTPS enabled
- [ ] Environment variables not exposed
- [ ] Database connections secured
- [ ] CORS properly configured
- [ ] Rate limiting implemented (future enhancement)

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify database is accessible
   - Check firewall settings

2. **Build Failures**
   - Ensure all dependencies are installed
   - Check Node.js version compatibility
   - Verify environment variables are set

3. **Authentication Issues**
   - Verify NEXTAUTH_URL matches domain
   - Check NEXTAUTH_SECRET is set
   - Ensure database has user sessions table

### Logs
- Check Vercel function logs for API errors
- Monitor database query performance
- Review application error logs