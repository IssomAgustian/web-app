# Menjalankan Pakar Padi Full Stack di Lokal

Panduan lengkap untuk menjalankan aplikasi Pakar Padi (Frontend + Backend) di komputer lokal Anda.

## Prerequisites

Pastikan Anda sudah install:
- **Node.js 18+** - Download dari https://nodejs.org
- **PostgreSQL 12+** - Download dari https://www.postgresql.org
- **Git** - Download dari https://git-scm.com
- **npm** atau **yarn** - Biasanya sudah terinstall dengan Node.js

### Verifikasi Installation

\`\`\`bash
node --version      # v18.0.0 atau lebih tinggi
npm --version       # 9.0.0 atau lebih tinggi
psql --version      # psql (PostgreSQL) 12 atau lebih tinggi
git --version       # git version 2.x.x
\`\`\`

## Step-by-Step Setup

### 1. Clone Repository

\`\`\`bash
git clone https://github.com/IssomAgustian/Pakar-Padi.git
cd Pakar-Padi
\`\`\`

### 2. Setup PostgreSQL Database

#### Windows
1. Buka pgAdmin (biasanya sudah terinstall dengan PostgreSQL)
2. Klik kanan pada "Databases" → "Create" → "Database"
3. Nama database: \`pakar_padi\`
4. Klik "Save"

#### macOS/Linux
\`\`\`bash
# Buat database
createdb pakar_padi

# Verifikasi
psql -l | grep pakar_padi
\`\`\`

### 3. Setup Backend

\`\`\`bash
# Masuk ke folder backend (jika terpisah)
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env dengan text editor favorit Anda
# Sesuaikan konfigurasi berikut:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/pakar_padi
# JWT_SECRET=your-secret-key-12345
# OPENAI_API_KEY=sk-your-openai-key
# PORT=5000
# NODE_ENV=development

# Seed database dengan data awal
npm run seed

# Jalankan backend
npm run dev
\`\`\`

Backend akan berjalan di **http://localhost:5000**

Anda akan melihat output seperti:
\`\`\`
Server running on port 5000
Database connected successfully
\`\`\`

### 4. Setup Frontend (Terminal Baru)

\`\`\`bash
# Buka terminal baru, tetap di root folder Pakar-Padi
# (Jangan close terminal backend)

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
# NEXT_PUBLIC_APP_URL=http://localhost:3000

# Jalankan frontend
npm run dev
\`\`\`

Frontend akan berjalan di **http://localhost:3000**

Anda akan melihat output seperti:
\`\`\`
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
\`\`\`

### 5. Akses Aplikasi

Buka browser dan akses:

- **Landing Page**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard
- **Admin Panel**: http://localhost:3000/admin

### 6. Login dengan Akun Default

**User Account:**
- Email: user@example.com
- Password: user123

**Admin Account:**
- Email: admin@example.com
- Password: admin123

## Struktur Terminal

Anda harus membuka 2 terminal:

**Terminal 1 - Backend:**
\`\`\`
$ cd Pakar-Padi/backend
$ npm run dev
> Server running on port 5000
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`
$ cd Pakar-Padi
$ npm run dev
> ready - started server on 0.0.0.0:3000
\`\`\`

## Fitur yang Bisa Dicoba

### User Features
1. **Register** - Buat akun baru
2. **Login** - Masuk dengan akun
3. **Diagnosis Gejala** - Pilih gejala → lihat hasil diagnosis
4. **Diagnosis Gambar** - Upload foto → AI analisis
5. **Lihat Hasil** - Detail diagnosis dengan solusi
6. **Riwayat** - Lihat semua diagnosis sebelumnya
7. **Profil** - Edit informasi pengguna

### Admin Features
1. **Dashboard** - Statistik dan overview
2. **Kelola Gejala** - CRUD gejala penyakit
3. **Kelola Penyakit** - CRUD data penyakit
4. **Kelola Aturan** - CRUD aturan forward chaining
5. **Model AI** - Upload dan test model
6. **Riwayat Diagnosis** - Lihat semua diagnosis user
7. **Kelola Pengguna** - CRUD user, block/unblock
8. **Solusi AI** - Konfigurasi OpenAI
9. **Laporan** - Analytics dan export data
10. **Pengaturan** - Konfigurasi sistem

## Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:5432"

**Masalah**: PostgreSQL tidak running

**Solusi**:
\`\`\`bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Buka Services (services.msc) dan start PostgreSQL
\`\`\`

### Error: "database 'pakar_padi' does not exist"

**Masalah**: Database belum dibuat

**Solusi**:
\`\`\`bash
createdb pakar_padi
cd backend
npm run seed
\`\`\`

### Error: "Failed to fetch from http://localhost:5000/api"

**Masalah**: Backend tidak running atau API URL salah

**Solusi**:
1. Pastikan backend sudah running di terminal 1
2. Cek \`NEXT_PUBLIC_API_URL\` di \`.env.local\`
3. Pastikan URL: \`http://localhost:5000/api\`

### Error: "Port 3000 already in use"

**Masalah**: Port 3000 sudah digunakan aplikasi lain

**Solusi**:
\`\`\`bash
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
\`\`\`

### Error: "Port 5000 already in use"

**Masalah**: Port 5000 sudah digunakan

**Solusi**:
\`\`\`bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
\`\`\`

### Error: "npm: command not found"

**Masalah**: Node.js/npm belum terinstall

**Solusi**: Download dan install Node.js dari https://nodejs.org

### Error: "psql: command not found"

**Masalah**: PostgreSQL belum terinstall

**Solusi**: Download dan install PostgreSQL dari https://www.postgresql.org

## Tips & Tricks

### Hot Reload
Kedua frontend dan backend support hot reload. Perubahan file akan otomatis di-reload tanpa perlu restart.

### Database Inspection
\`\`\`bash
# Connect ke database
psql pakar_padi

# List semua table
\\dt

# Query data
SELECT * FROM users;
SELECT * FROM symptoms;
SELECT * FROM diseases;

# Exit
\\q
\`\`\`

### Clear Cache
\`\`\`bash
# Frontend
rm -rf .next
npm run dev

# Backend
rm -rf node_modules
npm install
npm run dev
\`\`\`

### Reset Database
\`\`\`bash
# Drop database
dropdb pakar_padi

# Create baru
createdb pakar_padi

# Seed data
cd backend
npm run seed
\`\`\`

## Next Steps

Setelah berhasil menjalankan aplikasi:

1. **Explore Features** - Coba semua fitur user dan admin
2. **Customize** - Sesuaikan dengan kebutuhan Anda
3. **Deploy** - Deploy ke production (Vercel + Heroku)
4. **Integrate** - Integrasikan dengan sistem lain

## Useful Commands

\`\`\`bash
# Frontend
npm run dev          # Start development
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter

# Backend
npm run dev          # Start development
npm run seed         # Seed database
npm run build        # Build for production
npm start            # Start production server
\`\`\`

## Support

Jika mengalami masalah:
1. Cek dokumentasi di README.md
2. Lihat error message di console
3. Buka issue di GitHub
4. Email: support@pakarpadi.com

Happy coding!
