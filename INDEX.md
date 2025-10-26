# Pakar Padi - Complete Project Index

## Dokumentasi Utama

### Untuk Memulai
1. **[README.md](./README.md)** - Baca ini terlebih dahulu
   - Overview project
   - Features
   - Tech stack
   - Quick links

2. **[QUICK_START.md](./QUICK_START.md)** - Setup dalam 5 menit
   - Prerequisites
   - Step-by-step setup
   - Verification

3. **[RUNNING_LOCALLY.md](./RUNNING_LOCALLY.md)** - Menjalankan di lokal
   - Method 1: Manual setup
   - Method 2: Docker
   - Method 3: Startup scripts
   - Troubleshooting

### Untuk Development
4. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Setup detail
   - Install prerequisites
   - Database setup
   - Environment configuration
   - Seed database
   - Troubleshooting

5. **[API_GUIDE.md](./API_GUIDE.md)** - API documentation
   - Base URL
   - Authentication
   - All endpoints
   - Request/response examples
   - Error handling

6. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
   - Project structure
   - Database design
   - API endpoints
   - Business logic
   - Integration flow

### Untuk Admin & Maintenance
7. **[FEATURES.md](./FEATURES.md)** - Feature documentation
   - User features
   - Admin features (10 menus)
   - Advanced features
   - Planned features

8. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Production deployment
   - Deployment options
   - Performance optimization
   - Monitoring
   - Backup strategy
   - Security

9. **[MAINTENANCE.md](./MAINTENANCE.md)** - Maintenance guide
   - Regular tasks
   - Database maintenance
   - Application maintenance
   - Monitoring
   - Performance tuning
   - Disaster recovery

10. **[INSTALLATION_TROUBLESHOOTING.md](./INSTALLATION_TROUBLESHOOTING.md)** - Troubleshooting
    - Common issues
    - Solutions
    - Performance issues
    - Debugging tips

### Untuk Kontribusi
11. **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contributing guide
    - Code of conduct
    - How to contribute
    - Commit format
    - Code style
    - Testing
    - Pull request process

## File Struktur

### Frontend (Next.js)
\`\`\`
app/
├── admin/
│   ├── layout.tsx              # Admin layout dengan sidebar
│   ├── page.tsx                # Dashboard
│   ├── symptoms/page.tsx       # Manajemen gejala
│   ├── diseases/page.tsx       # Manajemen penyakit
│   ├── rules/page.tsx          # Manajemen aturan
│   ├── ai-models/page.tsx      # Manajemen model AI
│   ├── history/page.tsx        # Riwayat diagnosa
│   ├── users/page.tsx          # Manajemen pengguna
│   ├── ai-solutions/page.tsx   # Konfigurasi AI
│   ├── reports/page.tsx        # Laporan
│   └── settings/page.tsx       # Pengaturan sistem
├── layout.tsx                  # Root layout
└── globals.css                 # Global styles
\`\`\`

### Backend (Node.js)
\`\`\`
src/
├── config/
│   ├── database.js             # Database connection
│   ├── app.js                  # App configuration
│   └── ai.js                   # AI configuration
├── middleware/
│   ├── auth.js                 # JWT authentication
│   ├── errorHandler.js         # Error handling
│   └── validation.js           # Input validation
├── routes/
│   ├── auth.js                 # Authentication endpoints
│   ├── symptoms.js             # Symptom endpoints
│   ├── diseases.js             # Disease endpoints
│   ├── rules.js                # Rule endpoints
│   ├── diagnosis.js            # Diagnosis endpoints
│   ├── history.js              # History endpoints
│   ├── admin.js                # Admin endpoints
│   └── users.js                # User endpoints
├── services/
│   ├── forwardChainingService.js    # Forward chaining logic
│   ├── certaintyFactorService.js    # Certainty factor logic
│   ├── imageProcessingService.js    # Image processing
│   ├── aiSolutionService.js         # AI solution generation
│   └── reportService.js             # Report generation
├── utils/
│   ├── logger.js               # Logging
│   ├── helpers.js              # Helper functions
│   ├── constants.js            # Constants
│   └── cache.js                # Caching
└── middleware/
    └── errorHandler.js         # Error handling
\`\`\`

### Configuration Files
\`\`\`
.env.example                    # Environment template
docker-compose.yml              # Docker configuration
Dockerfile                      # Docker image
package.json                    # Dependencies
tsconfig.json                   # TypeScript config
next.config.mjs                 # Next.js config
tailwind.config.js              # Tailwind config
postcss.config.js               # PostCSS config
\`\`\`

### Scripts
\`\`\`
scripts/
├── seed.js                     # Database seeding
├── sample-data.js              # Sample data
start.sh                        # Linux/macOS startup
start.bat                       # Windows startup
start-docker.sh                 # Docker startup
\`\`\`

## Admin Panel - 10 Menus

### 1. Dashboard
- Statistics cards (users, diagnoses, diseases, uptime)
- Diagnosis trend chart (6 months)
- Disease distribution pie chart
- Recent activity log

### 2. Manajemen Gejala
- List semua gejala
- Tambah/edit/hapus gejala
- Search dan filter
- Import/export CSV

### 3. Manajemen Penyakit
- List semua penyakit
- Tambah/edit/hapus penyakit
- Deskripsi, pencegahan, penanganan
- Search dan filter

### 4. Manajemen Aturan
- List aturan forward chaining
- Tambah/edit/hapus aturan
- Set confidence level
- Test aturan dengan simulasi

### 5. Model AI
- List model AI
- Upload model baru
- Monitor akurasi
- Test model dengan gambar

### 6. Riwayat Diagnosa
- List semua diagnosis
- Filter by date, user, disease, type
- View detail diagnosis
- Export ke PDF/Excel
- Delete history

### 7. Manajemen Pengguna
- List semua pengguna
- View user details
- Blokir/unblock pengguna
- Reset password
- Delete pengguna

### 8. Solusi AI
- Konfigurasi OpenAI API
- Set model, temperature, tokens
- Customize system prompt
- Test generasi solusi

### 9. Laporan
- Penyakit paling sering
- Penggunaan sistem
- Bar charts dan statistics
- Export PDF/Excel

### 10. Pengaturan Sistem
- Forward chaining settings
- Certainty factor settings
- General settings
- Security settings

## API Endpoints (20+)

### Authentication (3)
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

### Diagnosis (3)
- POST /api/diagnosis/symptoms
- POST /api/diagnosis/image
- POST /api/diagnosis/confirm

### Symptoms (4)
- GET /api/symptoms
- POST /api/symptoms
- PUT /api/symptoms/:id
- DELETE /api/symptoms/:id

### Diseases (4)
- GET /api/diseases
- POST /api/diseases
- PUT /api/diseases/:id
- DELETE /api/diseases/:id

### Rules (3)
- GET /api/rules
- POST /api/rules
- DELETE /api/rules/:id

### History (3)
- GET /api/history
- POST /api/history
- DELETE /api/history/:id

### Admin (2)
- GET /api/admin/dashboard
- GET /api/admin/reports

## Database Tables

1. **users** - User accounts
2. **diseases** - Penyakit
3. **symptoms** - Gejala
4. **rules** - Forward chaining rules
5. **diagnosis_history** - Riwayat diagnosis
6. **ai_models** - AI models metadata

## Technology Stack

### Frontend
- Next.js 16
- React 19.2
- Tailwind CSS v4
- Recharts
- Lucide React

### Backend
- Node.js v18+
- Express.js
- PostgreSQL 15
- JWT
- OpenAI API

### DevOps
- Docker
- Docker Compose
- PM2
- Nginx

## Quick Commands

### Setup
\`\`\`bash
npm install
npm run seed
\`\`\`

### Development
\`\`\`bash
npm run dev          # Run both frontend & backend
npm run dev:backend  # Run backend only
npm run dev:frontend # Run frontend only
\`\`\`

### Production
\`\`\`bash
npm run build
npm start
\`\`\`

### Docker
\`\`\`bash
docker-compose up -d
docker-compose down
docker-compose logs -f
\`\`\`

## Access Points

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Backend API**: http://localhost:5000/api
- **API Health**: http://localhost:5000/api/health

## Default Credentials

- **Username**: admin
- **Password**: admin123

## Support Resources

1. **README.md** - Project overview
2. **QUICK_START.md** - 5-minute setup
3. **SETUP_GUIDE.md** - Detailed setup
4. **API_GUIDE.md** - API documentation
5. **RUNNING_LOCALLY.md** - Local development
6. **DEPLOYMENT_GUIDE.md** - Production deployment
7. **TROUBLESHOOTING.md** - Common issues
8. **MAINTENANCE.md** - Maintenance guide
9. **FEATURES.md** - Feature documentation
10. **ARCHITECTURE.md** - System design
11. **CONTRIBUTING.md** - Contributing guide

## Next Steps

1. Read [README.md](./README.md)
2. Follow [QUICK_START.md](./QUICK_START.md)
3. Run [RUNNING_LOCALLY.md](./RUNNING_LOCALLY.md)
4. Explore admin panel
5. Test diagnosis features
6. Deploy to production

## Project Status

- Backend: ✅ Complete
- Frontend: ✅ Complete
- Admin Panel: ✅ Complete (10 menus)
- Documentation: ✅ Complete
- Ready for Production: ✅ Yes

---

**Version**: 1.0.0  
**Last Updated**: March 2024  
**Status**: Production Ready

Selamat menggunakan Pakar Padi! 🚀
