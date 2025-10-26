# Pakar Padi - Sistem Pakar Diagnosis Penyakit Padi

Pakar Padi adalah sistem pakar berbasis AI untuk diagnosis penyakit padi dengan dua metode:
1. **Diagnosis Berdasarkan Gejala** - Menggunakan Forward Chaining
2. **Diagnosis Berdasarkan Gambar** - Menggunakan Certainty Factor dan AI

## Fitur Utama

### Untuk User
- Registrasi dan login
- Diagnosis berdasarkan gejala dengan forward chaining
- Diagnosis berdasarkan gambar dengan AI
- Solusi penanganan otomatis dari AI
- Riwayat diagnosis
- Profil pengguna

### Untuk Admin
- Dashboard dengan statistik lengkap
- Manajemen gejala penyakit
- Manajemen data penyakit
- Manajemen aturan forward chaining
- Manajemen model AI
- Riwayat diagnosis semua user
- Manajemen pengguna
- Konfigurasi solusi AI
- Laporan dan analytics
- Pengaturan sistem

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript
- **Database**: PostgreSQL
- **Authentication**: JWT
- **AI Integration**: OpenAI API

## Cara Menjalankan di Lokal

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm atau yarn
- Git

### Step 1: Clone Repository

\`\`\`bash
git clone https://github.com/IssomAgustian/Pakar-Padi.git
cd Pakar-Padi
\`\`\`

### Step 2: Setup Backend

\`\`\`bash
# Masuk ke folder backend (jika terpisah)
cd backend

# Install dependencies
npm install

# Setup database
createdb pakar_padi

# Seed database
npm run seed

# Configure environment
cp .env.example .env

# Edit .env dengan konfigurasi Anda:
# - DATABASE_URL
# - JWT_SECRET
# - OPENAI_API_KEY
# - PORT (default: 5000)

# Run backend
npm run dev
\`\`\`

Backend akan berjalan di http://localhost:5000

### Step 3: Setup Frontend

\`\`\`bash
# Kembali ke root folder
cd ..

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local

# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Run frontend
npm run dev
\`\`\`

Frontend akan berjalan di http://localhost:3000

### Step 4: Access Application

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Backend API**: http://localhost:5000/api

### Default Credentials

**User Account:**
- Email: user@example.com
- Password: user123

**Admin Account:**
- Email: admin@example.com
- Password: admin123

## Struktur Folder

\`\`\`
Pakar-Padi/
├── app/                          # Frontend Next.js
│   ├── page.tsx                  # Landing page
│   ├── login/                    # Login page
│   ├── register/                 # Register page
│   ├── dashboard/                # User dashboard
│   │   ├── page.tsx
│   │   └── history/
│   ├── diagnosis/
│   │   ├── symptoms/
│   │   ├── image/
│   │   └── results/
│   ├── profile/
│   ├── admin/                    # Admin panel
│   │   ├── page.tsx
│   │   ├── symptoms/
│   │   ├── diseases/
│   │   ├── rules/
│   │   ├── ai-models/
│   │   ├── history/
│   │   ├── users/
│   │   ├── solutions/
│   │   ├── reports/
│   │   └── settings/
│   └── layout.tsx
├── components/
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── api-client.ts             # API client
│   └── utils.ts
├── public/
├── styles/
├── .env.local.example
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.js
└── README.md

backend/                          # Backend Express.js
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── app.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── symptoms.js
│   │   ├── diseases.js
│   │   ├── rules.js
│   │   ├── diagnosis.js
│   │   ├── history.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── services/
│   │   ├── forwardChainingService.js
│   │   ├── certaintyFactorService.js
│   │   ├── imageProcessingService.js
│   │   ├── aiSolutionService.js
│   │   └── reportService.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── helpers.js
│   │   ├── constants.js
│   │   └── cache.js
│   └── server.js
├── scripts/
│   ├── seed.js
│   └── sample-data.js
├── .env.example
├── package.json
├── docker-compose.yml
└── Dockerfile
\`\`\`

## API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register user
- \`POST /api/auth/login\` - Login user
- \`POST /api/auth/logout\` - Logout user

### Symptoms
- \`GET /api/symptoms\` - Get all symptoms
- \`POST /api/symptoms\` - Create symptom (admin)
- \`PUT /api/symptoms/:id\` - Update symptom (admin)
- \`DELETE /api/symptoms/:id\` - Delete symptom (admin)

### Diseases
- \`GET /api/diseases\` - Get all diseases
- \`POST /api/diseases\` - Create disease (admin)
- \`PUT /api/diseases/:id\` - Update disease (admin)
- \`DELETE /api/diseases/:id\` - Delete disease (admin)

### Diagnosis
- \`POST /api/diagnosis/symptoms\` - Diagnosis by symptoms
- \`POST /api/diagnosis/image\` - Diagnosis by image
- \`GET /api/diagnosis/:id\` - Get diagnosis result
- \`GET /api/diagnosis/:id/export\` - Export diagnosis as PDF

### History
- \`GET /api/history\` - Get user diagnosis history
- \`DELETE /api/history/:id\` - Delete diagnosis from history

### Admin
- \`GET /api/admin/dashboard\` - Dashboard statistics
- \`GET /api/admin/users\` - Get all users
- \`PUT /api/admin/users/:id\` - Update user
- \`DELETE /api/admin/users/:id\` - Delete user

## Environment Variables

### Frontend (.env.local)
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### Backend (.env)
\`\`\`
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/pakar_padi
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
OPENAI_API_KEY=your-openai-api-key
CORS_ORIGIN=http://localhost:3000
\`\`\`

## Database Schema

### Users Table
- id (UUID)
- name (String)
- email (String, unique)
- password (String, hashed)
- role (String: user, admin)
- isActive (Boolean)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### Symptoms Table
- id (UUID)
- name (String)
- description (Text)
- createdAt (Timestamp)

### Diseases Table
- id (UUID)
- name (String)
- description (Text)
- severity (String: rendah, sedang, tinggi)
- createdAt (Timestamp)

### Rules Table
- id (UUID)
- symptomId (UUID, FK)
- diseaseId (UUID, FK)
- confidence (Float)
- createdAt (Timestamp)

### Diagnosis Table
- id (UUID)
- userId (UUID, FK)
- diseaseId (UUID, FK)
- confidence (Float)
- certaintyFactor (Float)
- type (String: symptoms, image)
- imageUrl (String, nullable)
- createdAt (Timestamp)

### Solutions Table
- id (UUID)
- diagnosisId (UUID, FK)
- title (String)
- description (Text)
- steps (JSON)
- medicines (JSON)
- prevention (JSON)
- createdAt (Timestamp)

## Troubleshooting

### Backend Connection Error
\`\`\`
Error: connect ECONNREFUSED 127.0.0.1:5432
\`\`\`
**Solution**: Pastikan PostgreSQL sudah running
\`\`\`bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Buka Services dan start PostgreSQL
\`\`\`

### Database Error
\`\`\`
Error: database "pakar_padi" does not exist
\`\`\`
**Solution**: Create database
\`\`\`bash
createdb pakar_padi
npm run seed
\`\`\`

### API Connection Error
\`\`\`
Error: Failed to fetch from http://localhost:5000/api
\`\`\`
**Solution**: 
- Pastikan backend sudah running
- Cek \`NEXT_PUBLIC_API_URL\` di .env.local
- Cek CORS configuration di backend

### Port Already in Use
\`\`\`
Error: listen EADDRINUSE: address already in use :::5000
\`\`\`
**Solution**: Kill process yang menggunakan port
\`\`\`bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
\`\`\`

## Development Tips

### Hot Reload
Frontend dan backend keduanya support hot reload. Perubahan file akan otomatis di-reload.

### Debug Mode
\`\`\`bash
# Frontend
npm run dev -- --debug

# Backend
DEBUG=* npm run dev
\`\`\`

### Database Inspection
\`\`\`bash
# Connect ke database
psql pakar_padi

# List tables
\\dt

# Query data
SELECT * FROM users;
\`\`\`

## Deployment

### Vercel (Frontend)
1. Push ke GitHub
2. Connect repository ke Vercel
3. Set environment variables
4. Deploy

### Heroku (Backend)
1. Create Heroku app
2. Add PostgreSQL addon
3. Set environment variables
4. Deploy

### Docker
\`\`\`bash
# Build
docker-compose build

# Run
docker-compose up
\`\`\`

## Contributing

1. Fork repository
2. Create feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to branch (\`git push origin feature/AmazingFeature\`)
5. Open Pull Request

## License

This project is licensed under the MIT License.

## Support

Untuk bantuan lebih lanjut:
- Buka issue di GitHub
- Email: support@pakarpadi.com
- Documentation: https://docs.pakarpadi.com

## Changelog

### v1.0.0 (2025-01-26)
- Initial release
- User authentication
- Diagnosis by symptoms
- Diagnosis by image
- Admin panel
- Full API integration
