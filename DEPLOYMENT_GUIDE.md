# Deployment Guide - Pakar Padi

## Production Checklist

- [ ] Environment variables dikonfigurasi
- [ ] Database backup strategy
- [ ] SSL/HTTPS setup
- [ ] Monitoring dan logging
- [ ] Backup dan disaster recovery
- [ ] Security audit
- [ ] Performance optimization

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)

1. Push code ke GitHub
2. Connect repository ke Vercel
3. Set environment variables
4. Deploy

### Option 2: Heroku

\`\`\`bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create pakar-padi

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=postgresql://...

# Deploy
git push heroku main
\`\`\`

### Option 3: DigitalOcean / AWS / Google Cloud

1. Create VM instance
2. Install Node.js dan PostgreSQL
3. Clone repository
4. Setup PM2 untuk process management
5. Setup Nginx sebagai reverse proxy
6. Setup SSL dengan Let's Encrypt

### Option 4: Docker

\`\`\`bash
# Build image
docker build -t pakar-padi:latest .

# Run container
docker run -d \
  -p 5000:5000 \
  --env-file .env \
  --name pakar-padi \
  pakar-padi:latest
\`\`\`

## Performance Optimization

### Database
- Add indexes untuk frequently queried columns
- Use connection pooling
- Regular vacuum dan analyze

### Caching
- Enable Redis caching
- Cache API responses
- Cache static assets

### Frontend
- Enable gzip compression
- Minify CSS/JS
- Optimize images
- Use CDN

## Monitoring

### Application Monitoring
- Setup PM2 monitoring
- Use New Relic atau DataDog
- Monitor error rates

### Database Monitoring
- Monitor query performance
- Check connection pool
- Monitor disk space

### Infrastructure
- Monitor CPU usage
- Monitor memory usage
- Monitor disk I/O

## Backup Strategy

### Database Backup
\`\`\`bash
# Daily backup
pg_dump pakar_padi > backup_$(date +%Y%m%d).sql

# Automated backup with cron
0 2 * * * pg_dump pakar_padi > /backups/backup_$(date +\%Y\%m\%d).sql
\`\`\`

### File Backup
- Backup uploads folder
- Backup AI models
- Store in S3 atau cloud storage

## Security

### SSL/HTTPS
\`\`\`bash
# Using Let's Encrypt
sudo certbot certonly --standalone -d your-domain.com
\`\`\`

### Environment Variables
- Never commit .env file
- Use secrets management
- Rotate API keys regularly

### Database Security
- Use strong passwords
- Restrict database access
- Enable SSL for database connections

### API Security
- Implement rate limiting
- Validate all inputs
- Use CORS properly
- Implement CSRF protection

## Scaling

### Horizontal Scaling
- Use load balancer
- Multiple application instances
- Database replication

### Vertical Scaling
- Increase server resources
- Optimize code
- Use caching

## Troubleshooting

### High Memory Usage
- Check for memory leaks
- Optimize queries
- Increase server resources

### Slow Response Time
- Check database queries
- Enable caching
- Optimize frontend
- Check network latency

### Database Connection Issues
- Check connection pool
- Monitor active connections
- Increase max connections if needed
