# Panduan Setup Lengkap Pakar Padi

## Persiapan Awal

### 1. Install Prerequisites

#### Windows
- Download Node.js dari https://nodejs.org/ (v18+)
- Download PostgreSQL dari https://www.postgresql.org/download/windows/
- Download Git dari https://git-scm.com/

#### macOS
\`\`\`bash
# Install Homebrew jika belum
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install PostgreSQL
brew install postgresql
\`\`\`

#### Linux (Ubuntu/Debian)
\`\`\`bash
sudo apt update
sudo apt install nodejs npm postgresql postgresql-contrib git
\`\`\`

### 2. Verifikasi Instalasi

\`\`\`bash
node --version    # v18.0.0 atau lebih baru
npm --version     # 9.0.0 atau lebih baru
psql --version    # 12 atau lebih baru
git --version
\`\`\`

## Setup Step-by-Step

### Step 1: Clone Repository

\`\`\`bash
git clone https://github.com/IssomAgustian/Pakar-Padi.git
cd Pakar-Padi
\`\`\`

### Step 2: Install Dependencies

\`\`\`bash
npm install
\`\`\`

Tunggu hingga semua dependencies terinstall (bisa memakan waktu 5-10 menit).

### Step 3: Setup PostgreSQL Database

#### Windows/macOS
\`\`\`bash
# Buka PostgreSQL command line
psql -U postgres

# Di dalam psql, jalankan:
CREATE DATABASE pakar_padi;
CREATE USER pakar_user WITH PASSWORD 'pakar_password_123';
ALTER ROLE pakar_user SET client_encoding TO 'utf8';
ALTER ROLE pakar_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE pakar_user SET default_transaction_deferrable TO on;
ALTER ROLE pakar_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE pakar_padi TO pakar_user;
\exit
\`\`\`

#### Linux
\`\`\`bash
sudo -u postgres psql

# Di dalam psql, jalankan command di atas
\`\`\`

### Step 4: Konfigurasi Environment

\`\`\`bash
# Copy file contoh
cp .env.example .env

# Edit file .env dengan text editor favorit Anda
# Sesuaikan dengan konfigurasi database Anda
\`\`\`

**Isi .env:**
\`\`\`env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=pakar_padi
DB_USER=pakar_user
DB_PASSWORD=pakar_password_123

JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d

OPENAI_API_KEY=sk-your-openai-api-key-here

MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
\`\`\`

### Step 5: Seed Database

\`\`\`bash
npm run seed
\`\`\`

Ini akan membuat tabel dan mengisi data awal (gejala, penyakit, aturan).

### Step 6: Jalankan Backend

\`\`\`bash
npm run dev
\`\`\`

Anda akan melihat output:
\`\`\`
Server running on http://localhost:5000
Database connected successfully
\`\`\`

### Step 7: Jalankan Frontend (Terminal Baru)

\`\`\`bash
npm run dev
\`\`\`

Frontend akan berjalan di `http://localhost:3000`

## Akses Aplikasi

### User Interface
- URL: http://localhost:3000
- Fitur: Diagnosis gejala, diagnosis gambar, riwayat

### Admin Panel
- URL: http://localhost:3000/admin
- Default Login: admin / admin123
- Fitur: 10 menu admin lengkap

### API Documentation
- URL: http://localhost:5000/api/docs (jika Swagger disetup)

## Troubleshooting

### Error: "Cannot find module 'express'"
\`\`\`bash
npm install
\`\`\`

### Error: "Database connection failed"
1. Pastikan PostgreSQL running
2. Cek username dan password di .env
3. Cek database sudah dibuat

### Error: "Port 5000 already in use"
\`\`\`bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
\`\`\`

### Error: "OPENAI_API_KEY not found"
- Dapatkan API key dari https://platform.openai.com/api-keys
- Tambahkan ke file .env

## Verifikasi Setup

### Test Backend
\`\`\`bash
curl http://localhost:5000/api/health
\`\`\`

Seharusnya return:
\`\`\`json
{"status": "ok"}
\`\`\`

### Test Frontend
Buka http://localhost:3000 di browser

### Test Admin Panel
Buka http://localhost:3000/admin di browser

## Next Steps

1. Explore admin panel
2. Tambah gejala dan penyakit
3. Buat aturan forward chaining
4. Test diagnosis
5. Customize sesuai kebutuhan

## Support

Jika ada masalah, cek:
1. Console output untuk error messages
2. File logs di folder logs/
3. GitHub Issues
4. Dokumentasi di README.md
