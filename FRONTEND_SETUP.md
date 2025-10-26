# Frontend Setup Guide

## Prerequisites
- Node.js 18+ 
- npm atau yarn

## Installation

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/IssomAgustian/Pakar-Padi.git
cd Pakar-Padi
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Configure Environment Variables
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit \`.env.local\` dan sesuaikan dengan konfigurasi backend Anda:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 4. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Aplikasi akan berjalan di http://localhost:3000

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint

## Project Structure

\`\`\`
app/
├── page.tsx                 # Landing page
├── login/                   # Login page
├── register/                # Register page
├── dashboard/               # User dashboard
│   ├── page.tsx
│   └── history/
├── diagnosis/
│   ├── symptoms/            # Diagnosis by symptoms
│   ├── image/               # Diagnosis by image
│   └── results/             # Diagnosis results
└── profile/                 # User profile

lib/
├── api-client.ts            # API client utility

components/
└── ui/                      # UI components (shadcn/ui)
\`\`\`

## Features

### User Pages
1. **Landing Page** - Homepage dengan informasi aplikasi
2. **Login** - Halaman login pengguna
3. **Register** - Halaman registrasi pengguna baru
4. **Dashboard** - Dashboard utama dengan statistik
5. **Diagnosis by Symptoms** - Diagnosis berdasarkan gejala
6. **Diagnosis by Image** - Diagnosis berdasarkan gambar
7. **Diagnosis Results** - Hasil diagnosis dengan solusi
8. **User History** - Riwayat diagnosis pengguna
9. **User Profile** - Profil pengguna dan pengaturan

### Admin Pages
1. **Admin Dashboard** - Dashboard admin dengan statistik
2. **Symptom Management** - Kelola gejala penyakit
3. **Disease Management** - Kelola data penyakit
4. **Rules Management** - Kelola aturan forward chaining
5. **AI Models** - Kelola model AI
6. **Diagnosis History** - Lihat riwayat diagnosis semua user
7. **User Management** - Kelola pengguna
8. **AI Solutions** - Kelola solusi AI
9. **Reports** - Laporan dan analytics
10. **Settings** - Pengaturan sistem

## API Integration

Frontend menggunakan API client yang sudah dikonfigurasi di \`lib/api-client.ts\`.

### Example Usage

\`\`\`typescript
import { ApiClient } from "@/lib/api-client"

// GET request
const data = await ApiClient.get("/symptoms")

// POST request
const result = await ApiClient.post("/diagnosis/symptoms", {
  symptomIds: ["1", "2", "3"]
})

// PUT request
const updated = await ApiClient.put("/users/profile", {
  name: "New Name"
})

// DELETE request
await ApiClient.delete("/history/123")

// POST with FormData (for file uploads)
const formData = new FormData()
formData.append("image", file)
const diagnosis = await ApiClient.postFormData("/diagnosis/image", formData)
\`\`\`

## Authentication

Token disimpan di localStorage setelah login berhasil. Token akan otomatis ditambahkan ke setiap request melalui API client.

\`\`\`typescript
// Login
const response = await ApiClient.post("/auth/login", {
  email: "user@example.com",
  password: "password"
})

// Token disimpan
localStorage.setItem("token", response.data.token)
localStorage.setItem("user", JSON.stringify(response.data.user))

// Logout
localStorage.removeItem("token")
localStorage.removeItem("user")
\`\`\`

## Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Connect repository ke Vercel
3. Set environment variables di Vercel dashboard
4. Deploy

### Docker

\`\`\`bash
docker build -t pakar-padi-frontend .
docker run -p 3000:3000 pakar-padi-frontend
\`\`\`

### Manual

\`\`\`bash
npm run build
npm run start
\`\`\`

## Troubleshooting

### API Connection Error
- Pastikan backend sudah berjalan di port 5000
- Cek \`NEXT_PUBLIC_API_URL\` di \`.env.local\`
- Cek CORS configuration di backend

### Login Error
- Pastikan email dan password benar
- Cek apakah user sudah terdaftar
- Lihat console browser untuk error details

### Image Upload Error
- Pastikan ukuran gambar < 5MB
- Format gambar harus JPG, PNG, atau WebP
- Cek permissions folder upload di backend

## Support

Untuk bantuan lebih lanjut, buka issue di GitHub repository.
