# Installation & Troubleshooting Guide

## Common Installation Issues

### Issue 1: Node.js Not Found

**Error:**
\`\`\`
'node' is not recognized as an internal or external command
\`\`\`

**Solution:**
1. Download Node.js dari https://nodejs.org/
2. Install dengan default settings
3. Restart terminal/command prompt
4. Verify: `node --version`

### Issue 2: PostgreSQL Connection Failed

**Error:**
\`\`\`
Error: connect ECONNREFUSED 127.0.0.1:5432
\`\`\`

**Solution:**
\`\`\`bash
# Windows - Start PostgreSQL service
net start postgresql-x64-15

# macOS - Start PostgreSQL
brew services start postgresql

# Linux - Start PostgreSQL
sudo systemctl start postgresql

# Verify connection
psql -U postgres -d postgres
\`\`\`

### Issue 3: Database Already Exists

**Error:**
\`\`\`
ERROR: database "pakar_padi" already exists
\`\`\`

**Solution:**
\`\`\`bash
# Drop existing database
psql -U postgres -c "DROP DATABASE pakar_padi;"

# Create new database
psql -U postgres -c "CREATE DATABASE pakar_padi;"
\`\`\`

### Issue 4: Port Already in Use

**Error:**
\`\`\`
Error: listen EADDRINUSE: address already in use :::5000
\`\`\`

**Solution:**

Windows:
\`\`\`bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
\`\`\`

macOS/Linux:
\`\`\`bash
lsof -i :5000
kill -9 <PID>
\`\`\`

### Issue 5: npm install Fails

**Error:**
\`\`\`
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
\`\`\`

**Solution:**
\`\`\`bash
# Clear npm cache
npm cache clean --force

# Install with legacy peer deps
npm install --legacy-peer-deps

# Or use npm 7+
npm install
\`\`\`

### Issue 6: Missing Environment Variables

**Error:**
\`\`\`
Error: OPENAI_API_KEY is not defined
\`\`\`

**Solution:**
\`\`\`bash
# Copy environment template
cp .env.example .env

# Edit .env dan isi semua required variables
nano .env

# Verify variables
cat .env
\`\`\`

### Issue 7: Database Seed Fails

**Error:**
\`\`\`
Error: relation "users" does not exist
\`\`\`

**Solution:**
\`\`\`bash
# Ensure database is created
psql -U postgres -d pakar_padi -c "\dt"

# Run seed script
npm run seed

# Check if tables created
psql -U postgres -d pakar_padi -c "\dt"
\`\`\`

### Issue 8: OpenAI API Error

**Error:**
\`\`\`
Error: 401 Unauthorized - Invalid API key
\`\`\`

**Solution:**
1. Get API key dari https://platform.openai.com/api-keys
2. Verify key format (starts with sk-)
3. Check quota di OpenAI dashboard
4. Update .env dengan correct key
5. Restart application

### Issue 9: Image Upload Error

**Error:**
\`\`\`
Error: ENOENT: no such file or directory, open './uploads/...'
\`\`\`

**Solution:**
\`\`\`bash
# Create uploads directory
mkdir -p uploads

# Set permissions
chmod 755 uploads

# Verify
ls -la uploads
\`\`\`

### Issue 10: Frontend Not Loading

**Error:**
\`\`\`
Error: connect ECONNREFUSED 127.0.0.1:3000
\`\`\`

**Solution:**
\`\`\`bash
# Check if frontend is running
lsof -i :3000

# Kill existing process
kill -9 <PID>

# Run frontend
npm run dev

# Check if backend is running
curl http://localhost:5000/api/health
\`\`\`

## Performance Issues

### Slow Database Queries

**Symptoms:**
- Diagnosis takes long time
- Admin panel is slow

**Solutions:**
\`\`\`sql
-- Add indexes
CREATE INDEX idx_symptoms_code ON symptoms(code);
CREATE INDEX idx_diseases_name ON diseases(name);
CREATE INDEX idx_rules_disease_id ON rules(disease_id);
CREATE INDEX idx_history_user_id ON diagnosis_history(user_id);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM diagnosis_history WHERE user_id = 1;

-- Vacuum database
VACUUM ANALYZE;
\`\`\`

### High Memory Usage

**Symptoms:**
- Application crashes
- System becomes slow

**Solutions:**
\`\`\`bash
# Monitor memory
top -p $(pgrep -f "node server.js")

# Check for memory leaks
node --inspect server.js

# Increase Node.js memory
NODE_OPTIONS=--max-old-space-size=4096 npm run dev
\`\`\`

### Slow Image Processing

**Symptoms:**
- Image diagnosis takes long time
- Timeout errors

**Solutions:**
\`\`\`javascript
// Optimize image processing
const sharp = require('sharp');

// Resize image before processing
await sharp(imagePath)
  .resize(224, 224)
  .toFile(outputPath);

// Increase timeout
const timeout = 30000; // 30 seconds
\`\`\`

## Debugging Tips

### Enable Debug Logging

\`\`\`bash
# Set debug level
DEBUG=* npm run dev

# Or specific module
DEBUG=pakar-padi:* npm run dev
\`\`\`

### Check Logs

\`\`\`bash
# View application logs
tail -f logs/combined.log

# View error logs
tail -f logs/error.log

# Search for specific error
grep "error" logs/combined.log
\`\`\`

### Database Debugging

\`\`\`bash
# Connect to database
psql -U postgres -d pakar_padi

# List tables
\dt

# Describe table
\d users

# Run query
SELECT * FROM users LIMIT 5;

# Check indexes
\di

# Check connections
SELECT * FROM pg_stat_activity;
\`\`\`

### API Testing

\`\`\`bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test with authentication
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/symptoms

# Test POST request
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
\`\`\`

## Getting Help

1. **Check Documentation**
   - README.md
   - API_GUIDE.md
   - SETUP_GUIDE.md

2. **Search GitHub Issues**
   - https://github.com/IssomAgustian/Pakar-Padi/issues

3. **Check Logs**
   - Application logs
   - Database logs
   - Browser console

4. **Contact Support**
   - Email: your-email@example.com
   - GitHub Discussions

## Verification Checklist

- [ ] Node.js v18+ installed
- [ ] PostgreSQL 12+ installed
- [ ] Git installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Database created
- [ ] Environment variables configured
- [ ] Database seeded (`npm run seed`)
- [ ] Backend running (`npm run dev`)
- [ ] Frontend running (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:3000/admin
- [ ] Can login with admin/admin123
- [ ] Can perform diagnosis

If all checked, your installation is complete!
