# Running Pakar Padi Locally

Panduan lengkap untuk menjalankan Pakar Padi di komputer lokal Anda.

## Prerequisites

Pastikan sudah install:
- **Node.js v18+** - https://nodejs.org/
- **PostgreSQL 12+** - https://www.postgresql.org/
- **Git** - https://git-scm.com/
- **Text Editor** - VS Code, Sublime, dll

## Method 1: Manual Setup (Recommended for Development)

### Step 1: Clone Repository

\`\`\`bash
git clone https://github.com/IssomAgustian/Pakar-Padi.git
cd Pakar-Padi
\`\`\`

### Step 2: Install Dependencies

\`\`\`bash
npm install
\`\`\`

Tunggu hingga selesai (5-10 menit tergantung kecepatan internet).

### Step 3: Setup PostgreSQL

#### Windows
1. Buka PostgreSQL Command Line (pgAdmin atau psql)
2. Jalankan:
\`\`\`sql
CREATE DATABASE pakar_padi;
CREATE USER pakar_user WITH PASSWORD 'pakar_password_123';
GRANT ALL PRIVILEGES ON DATABASE pakar_padi TO pakar_user;
\`\`\`

#### macOS
\`\`\`bash
# Jika menggunakan Homebrew
brew services start postgresql

# Buat database
createdb pakar_padi

# Buat user
psql -d pakar_padi -c "CREATE USER pakar_user WITH PASSWORD 'pakar_password_123';"
psql -d pakar_padi -c "GRANT ALL PRIVILEGES ON DATABASE pakar_padi TO pakar_user;"
\`\`\`

#### Linux (Ubuntu/Debian)
\`\`\`bash
# Start PostgreSQL
sudo systemctl start postgresql

# Buat database
sudo -u postgres createdb pakar_padi

# Buat user
sudo -u postgres psql -c "CREATE USER pakar_user WITH PASSWORD 'pakar_password_123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE pakar_padi TO pakar_user;"
\`\`\`

### Step 4: Configure Environment

\`\`\`bash
# Copy environment file
cp .env.example .env

# Edit .env dengan text editor
# Minimal configuration:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=pakar_padi
# DB_USER=pakar_user
# DB_PASSWORD=pakar_password_123
# JWT_SECRET=your_secret_key_here
\`\`\`

### Step 5: Seed Database

\`\`\`bash
npm run seed
\`\`\`

Ini akan membuat tabel dan mengisi data awal.

### Step 6: Run Application

**Terminal 1 - Backend:**
\`\`\`bash
npm run dev
\`\`\`

Anda akan melihat:
\`\`\`
Server running on http://localhost:5000
Database connected successfully
\`\`\`

**Terminal 2 - Frontend (buka terminal baru):**
\`\`\`bash
npm run dev
\`\`\`

Anda akan melihat:
\`\`\`
> next dev
  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
\`\`\`

### Step 7: Access Application

Buka browser dan akses:
- **User Interface**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API**: http://localhost:5000/api

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

## Method 2: Using Docker (Recommended for Production)

### Prerequisites
- Docker - https://www.docker.com/
- Docker Compose - https://docs.docker.com/compose/

### Steps

\`\`\`bash
# Clone repository
git clone https://github.com/IssomAgustian/Pakar-Padi.git
cd Pakar-Padi

# Start with Docker Compose
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
\`\`\`

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin: http://localhost:3000/admin

Stop:
\`\`\`bash
docker-compose down
\`\`\`

## Method 3: Using Startup Scripts

### Windows

\`\`\`bash
# Run startup script
start.bat
\`\`\`

### macOS/Linux

\`\`\`bash
# Make script executable
chmod +x start.sh

# Run startup script
./start.sh
\`\`\`

## Verification

### Check Backend

\`\`\`bash
curl http://localhost:5000/api/health
\`\`\`

Expected response:
\`\`\`json
{"status": "ok"}
\`\`\`

### Check Frontend

Open http://localhost:3000 in browser. Anda harus melihat halaman utama.

### Check Admin Panel

Open http://localhost:3000/admin in browser. Login dengan admin/admin123.

## Troubleshooting

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

# Check database exists
psql -U postgres -l | grep pakar_padi

# Verify .env configuration
cat .env
\`\`\`

### Dependencies Installation Error

\`\`\`bash
# Clear cache
npm cache clean --force

# Install again
npm install --legacy-peer-deps
\`\`\`

### OpenAI API Error

1. Get API key dari https://platform.openai.com/api-keys
2. Add ke .env: `OPENAI_API_KEY=sk-...`
3. Restart application

## Development Tips

### Hot Reload
- Frontend: Automatic (Next.js)
- Backend: Automatic (nodemon)

### Debug Mode

\`\`\`bash
# Backend debug
DEBUG=* npm run dev

# Frontend debug
npm run dev -- --debug
\`\`\`

### Database Inspection

\`\`\`bash
# Connect to database
psql -U pakar_user -d pakar_padi

# List tables
\dt

# View data
SELECT * FROM users;

# Exit
\q
\`\`\`

### API Testing

\`\`\`bash
# Test endpoint
curl http://localhost:5000/api/health

# Test with authentication
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/symptoms
\`\`\`

## Next Steps

1. Explore admin panel
2. Add gejala dan penyakit
3. Create aturan forward chaining
4. Test diagnosis
5. Customize sesuai kebutuhan

## Getting Help

- Check [README.md](./README.md)
- Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- Check [API_GUIDE.md](./API_GUIDE.md)
- Open GitHub issue
- Contact: your-email@example.com

Happy coding! 🚀
