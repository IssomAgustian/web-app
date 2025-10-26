# Maintenance Guide

## Regular Maintenance Tasks

### Daily
- Monitor application logs
- Check system health
- Monitor database performance
- Check disk space

### Weekly
- Review error logs
- Analyze user feedback
- Check API performance
- Backup database

### Monthly
- Database maintenance (VACUUM, ANALYZE)
- Update dependencies
- Security audit
- Performance review

### Quarterly
- Major version updates
- Security patches
- Feature releases
- Documentation updates

## Database Maintenance

### Backup Database

\`\`\`bash
# Manual backup
pg_dump pakar_padi > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated backup (cron job)
0 2 * * * pg_dump pakar_padi > /backups/backup_$(date +\%Y\%m\%d).sql

# Restore from backup
psql pakar_padi < backup_20240315_020000.sql
\`\`\`

### Optimize Database

\`\`\`sql
-- Vacuum and analyze
VACUUM ANALYZE;

-- Reindex tables
REINDEX DATABASE pakar_padi;

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables 
WHERE schemaname != 'pg_catalog' 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan 
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;
\`\`\`

### Monitor Connections

\`\`\`sql
-- Check active connections
SELECT * FROM pg_stat_activity;

-- Kill idle connections
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle' AND query_start < now() - interval '1 hour';

-- Check connection limits
SHOW max_connections;
\`\`\`

## Application Maintenance

### Update Dependencies

\`\`\`bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update specific package
npm install package-name@latest

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
\`\`\`

### Clear Cache

\`\`\`bash
# Clear npm cache
npm cache clean --force

# Clear Redis cache (if using)
redis-cli FLUSHALL

# Clear application cache
rm -rf .next
rm -rf node_modules/.cache
\`\`\`

### Restart Services

\`\`\`bash
# Restart backend
pm2 restart pakar-padi

# Restart all services
pm2 restart all

# Check status
pm2 status

# View logs
pm2 logs pakar-padi
\`\`\`

## Monitoring

### Application Monitoring

\`\`\`bash
# Monitor with PM2
pm2 monit

# Monitor with top
top -p $(pgrep -f "node server.js")

# Monitor with htop
htop -p $(pgrep -f "node server.js")
\`\`\`

### Database Monitoring

\`\`\`bash
# Monitor connections
watch -n 1 'psql -U postgres -d pakar_padi -c "SELECT count(*) FROM pg_stat_activity;"'

# Monitor query performance
psql -U postgres -d pakar_padi -c "SELECT query, calls, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"
\`\`\`

### Log Monitoring

\`\`\`bash
# Watch logs in real-time
tail -f logs/combined.log

# Search for errors
grep ERROR logs/combined.log

# Count errors
grep ERROR logs/combined.log | wc -l

# Analyze logs
cat logs/combined.log | grep "diagnosis" | wc -l
\`\`\`

## Performance Tuning

### Database Tuning

\`\`\`sql
-- Increase work_mem for complex queries
ALTER SYSTEM SET work_mem = '256MB';

-- Increase shared_buffers
ALTER SYSTEM SET shared_buffers = '2GB';

-- Increase effective_cache_size
ALTER SYSTEM SET effective_cache_size = '6GB';

-- Apply changes
SELECT pg_reload_conf();
\`\`\`

### Application Tuning

\`\`\`javascript
// Enable compression
app.use(compression());

// Enable caching
app.use(cache('5 minutes'));

// Connection pooling
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
\`\`\`

### Frontend Optimization

\`\`\`bash
# Build optimization
npm run build

# Analyze bundle
npm run analyze

# Enable gzip compression
gzip -9 .next/static/**/*.js
\`\`\`

## Troubleshooting

### High CPU Usage

\`\`\`bash
# Find process using CPU
top -b -n 1 | grep node

# Profile application
node --prof server.js
node --prof-process isolate-*.log > profile.txt

# Check for infinite loops
grep -n "while" src/**/*.js
\`\`\`

### High Memory Usage

\`\`\`bash
# Check memory leaks
node --inspect server.js

# Use Chrome DevTools
# Open chrome://inspect

# Analyze heap dump
node --heap-prof server.js
\`\`\`

### Slow Queries

\`\`\`sql
-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = 1000;

-- View slow queries
SELECT query, calls, mean_time FROM pg_stat_statements 
WHERE mean_time > 1000 
ORDER BY mean_time DESC;

-- Analyze query plan
EXPLAIN ANALYZE SELECT * FROM diagnosis_history WHERE user_id = 1;
\`\`\`

## Disaster Recovery

### Database Recovery

\`\`\`bash
# Restore from backup
psql pakar_padi < backup_20240315_020000.sql

# Point-in-time recovery
pg_basebackup -D /backup/pgsql -Fp -Xs -P -v

# Check recovery status
SELECT pg_is_in_recovery();
\`\`\`

### Application Recovery

\`\`\`bash
# Restart application
pm2 restart pakar-padi

# Restart all services
pm2 restart all

# Check status
pm2 status

# View logs
pm2 logs pakar-padi
\`\`\`

## Documentation

- Keep README.md updated
- Document configuration changes
- Document custom modifications
- Keep changelog updated
- Document known issues

## Support

For maintenance issues:
- Check logs
- Review documentation
- Contact support
- Open GitHub issue
