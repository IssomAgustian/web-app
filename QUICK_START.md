# Pakar Padi - Quick Start Guide (5 Minutes)

## Prerequisites
- Node.js v18+ installed
- PostgreSQL 12+ installed
- npm or yarn package manager
- OpenAI API key (for AI features)

---

## Complete Setup (5 Minutes)

### Step 1: Clone Repository
\`\`\`bash
git clone https://github.com/IssomAgustian/Pakar-Padi.git
cd Pakar-Padi
\`\`\`

### Step 2: Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Step 3: Setup PostgreSQL Database

#### Windows/macOS
\`\`\`bash
# Create database
createdb pakar_padi

# Create user (optional)
psql -U postgres -c "CREATE USER pakar_user WITH PASSWORD 'pakar_password_123';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE pakar_padi TO pakar_user;"
\`\`\`

#### Linux
\`\`\`bash
sudo -u postgres createdb pakar_padi
sudo -u postgres psql -c "CREATE USER pakar_user WITH PASSWORD 'pakar_password_123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE pakar_padi TO pakar_user;"
\`\`\`

### Step 4: Configure Environment
\`\`\`bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
# Important variables:
# - DB_HOST=localhost
# - DB_PORT=5432
# - DB_NAME=pakar_padi
# - DB_USER=postgres (or pakar_user)
# - DB_PASSWORD=password
# - JWT_SECRET=your_secret_key
# - OPENAI_API_KEY=sk-your-key-here
\`\`\`

### Step 5: Seed Database
\`\`\`bash
npm run seed
\`\`\`

This creates tables and populates initial data (symptoms, diseases, rules).

### Step 6: Start Application
\`\`\`bash
npm run dev
\`\`\`

You will see:
\`\`\`
Server running on http://localhost:5000
Database connected successfully
Frontend running on http://localhost:3000
\`\`\`

---

## Access Application

### Frontend
- **URL**: http://localhost:3000
- **Features**: Diagnosis gejala, diagnosis gambar, riwayat

### Admin Panel
- **URL**: http://localhost:3000/admin
- **Default Login**: admin / admin123
- **Features**: 10 admin menus

### Backend API
- **URL**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## Quick Test

### Test Backend
\`\`\`bash
curl http://localhost:5000/api/health
\`\`\`

Expected response:
\`\`\`json
{"status": "ok"}
\`\`\`

### Test Frontend
Open http://localhost:3000 in browser

### Test Admin Panel
Open http://localhost:3000/admin in browser and login with admin/admin123

---

## Docker Alternative

If you prefer Docker:

\`\`\`bash
docker-compose up -d
\`\`\`

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin: http://localhost:3000/admin

---

## Common Issues

### Port Already in Use
\`\`\`bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
\`\`\`

### Database Connection Error
\`\`\`bash
# Check PostgreSQL is running
psql -U postgres -d postgres

# Verify database exists
psql -U postgres -l | grep pakar_padi

# Check .env configuration
cat .env
\`\`\`

### Dependencies Error
\`\`\`bash
npm cache clean --force
npm install --legacy-peer-deps
\`\`\`

---

## Next Steps

1. ✅ Backend running on http://localhost:5000
2. ✅ Frontend running on http://localhost:3000
3. ✅ Database seeded
4. 📝 Explore admin panel
5. 🔍 Test diagnosis features
6. 📊 View reports
7. 🚀 Deploy to production

---

## Documentation

- **[README.md](./README.md)** - Project overview
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup
- **[RUNNING_LOCALLY.md](./RUNNING_LOCALLY.md)** - Local development
- **[API_GUIDE.md](./API_GUIDE.md)** - API documentation
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Production deployment

---

## Success Checklist

- [ ] Node.js v18+ installed
- [ ] PostgreSQL running
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Database created
- [ ] .env configured
- [ ] Database seeded
- [ ] Backend running (port 5000)
- [ ] Frontend running (port 3000)
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:3000/admin
- [ ] Can login with admin/admin123

Once all checked, your Pakar Padi system is ready! 🎉
