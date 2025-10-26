# Pakar Padi - Data Structure Documentation

## Database Tables

### 1. Users Table
Menyimpan informasi pengguna dan autentikasi.

\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',  -- 'admin' atau 'user'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

**Contoh Data:**
\`\`\`json
{
  "id": 1,
  "username": "farmer_john",
  "email": "john@example.com",
  "password_hash": "$2a$10$...",
  "role": "user",
  "created_at": "2024-01-15T10:30:00Z"
}
\`\`\`

---

### 2. Diseases Table
Menyimpan informasi penyakit padi.

\`\`\`sql
CREATE TABLE diseases (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  prevention_methods TEXT,
  symptoms_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

**Contoh Data:**
\`\`\`json
{
  "id": 1,
  "name": "Blast (Pyricularia oryzae)",
  "description": "Penyakit blast adalah penyakit yang disebabkan oleh jamur Pyricularia oryzae...",
  "prevention_methods": "1. Gunakan varietas tahan\n2. Jaga kelembaban optimal\n3. Aplikasi fungisida...",
  "symptoms_description": "Bercak berbentuk diamond pada daun, berwarna coklat dengan tepi gelap..."
}
\`\`\`

---

### 3. Symptoms Table
Menyimpan daftar gejala penyakit.

\`\`\`sql
CREATE TABLE symptoms (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

**Contoh Data:**
\`\`\`json
{
  "id": 1,
  "code": "S001",
  "name": "Bercak pada daun",
  "description": "Adanya bercak atau noda pada permukaan daun padi",
  "category": "Daun"
}
\`\`\`

**Kategori Gejala:**
- Daun (Leaf)
- Batang (Stem)
- Pelepah (Sheath)
- Akar (Root)
- Umum (General)

---

### 4. Rules Table
Menyimpan aturan forward chaining untuk diagnosis berdasarkan gejala.

\`\`\`sql
CREATE TABLE rules (
  id SERIAL PRIMARY KEY,
  disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,
  symptom_ids INTEGER[] NOT NULL,  -- Array of symptom IDs
  confidence_level DECIMAL(3,2) DEFAULT 1.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

**Contoh Data:**
\`\`\`json
{
  "id": 1,
  "disease_id": 1,
  "symptom_ids": [1, 2, 3, 4],
  "confidence_level": 1.0,
  "created_at": "2024-01-15T10:30:00Z"
}
\`\`\`

**Penjelasan:**
- Jika gejala dengan ID 1, 2, 3, dan 4 semuanya dipilih, maka penyakit dengan ID 1 (Blast) didiagnosa dengan confidence 1.0 (100%)

---

### 5. Diagnosis History Table
Menyimpan riwayat diagnosis pengguna.

\`\`\`sql
CREATE TABLE diagnosis_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  disease_id INTEGER REFERENCES diseases(id),
  diagnosis_type VARCHAR(20) NOT NULL,  -- 'symptoms' atau 'image'
  confidence_level DECIMAL(3,2),
  symptoms_selected INTEGER[],  -- Untuk diagnosis berdasarkan gejala
  image_path VARCHAR(255),  -- Untuk diagnosis berdasarkan gambar
  certainty_level VARCHAR(50),  -- 'Tidak ada', 'Mungkin', 'Kemungkinan Besar', 'Hampir Pasti', 'Pasti'
  ai_solution TEXT,  -- JSON string dari solusi AI
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

**Contoh Data (Symptom-based):**
\`\`\`json
{
  "id": 1,
  "user_id": 1,
  "disease_id": 1,
  "diagnosis_type": "symptoms",
  "confidence_level": 0.95,
  "symptoms_selected": [1, 2, 3],
  "image_path": null,
  "certainty_level": "Hampir Pasti",
  "ai_solution": "{\"treatment_steps\": [...], \"recommended_medicines\": [...]}",
  "created_at": "2024-01-15T10:30:00Z"
}
\`\`\`

**Contoh Data (Image-based):**
\`\`\`json
{
  "id": 2,
  "user_id": 1,
  "disease_id": 1,
  "diagnosis_type": "image",
  "confidence_level": 0.87,
  "symptoms_selected": null,
  "image_path": "/uploads/images/1705318200000-abc123.jpg",
  "certainty_level": "Hampir Pasti",
  "ai_solution": "{\"treatment_steps\": [...], \"recommended_medicines\": [...]}",
  "created_at": "2024-01-15T10:35:00Z"
}
\`\`\`

---

### 6. AI Models Table
Menyimpan metadata model AI untuk diagnosis gambar.

\`\`\`sql
CREATE TABLE ai_models (
  id SERIAL PRIMARY KEY,
  model_name VARCHAR(100) NOT NULL,
  version VARCHAR(20),
  model_path VARCHAR(255),
  accuracy DECIMAL(3,2),
  classes TEXT[],  -- Array of disease names
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

**Contoh Data:**
\`\`\`json
{
  "id": 1,
  "model_name": "rice_disease_detector",
  "version": "1.0",
  "model_path": "/models/rice_disease_v1.h5",
  "accuracy": 0.92,
  "classes": ["Blast", "Brown Spot", "Leaf Smut", "Healthy"],
  "created_at": "2024-01-15T10:30:00Z"
}
\`\`\`

---

### 7. Certainty Rules Table
Menyimpan aturan certainty factor untuk diagnosis gambar.

\`\`\`sql
CREATE TABLE certainty_rules (
  id SERIAL PRIMARY KEY,
  disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,
  base_certainty DECIMAL(3,2),
  confirmation_questions JSONB,  -- JSON array of questions
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

**Contoh Data:**
\`\`\`json
{
  "id": 1,
  "disease_id": 1,
  "base_certainty": 0.7,
  "confirmation_questions": [
    {
      "question": "Apakah bercak berbentuk diamond?",
      "yes_certainty_adjustment": 0.15,
      "no_certainty_adjustment": -0.1
    },
    {
      "question": "Apakah pusat bercak berwarna abu-abu?",
      "yes_certainty_adjustment": 0.1,
      "no_certainty_adjustment": -0.05
    }
  ]
}
\`\`\`

---

## Data Relationships

\`\`\`
┌─────────────┐
│   users     │
└──────┬──────┘
       │ (1:many)
       │
       ▼
┌──────────────────────┐
│ diagnosis_history    │
└──────┬───────────────┘
       │ (many:1)
       │
       ▼
┌─────────────┐
│  diseases   │
└──────┬──────┘
       │ (1:many)
       │
       ├─────────────────────────┐
       │                         │
       ▼                         ▼
   ┌────────┐            ┌──────────────┐
   │ rules  │            │certainty_rules│
   └────────┘            └──────────────┘
       │
       │ (many:many via array)
       │
       ▼
   ┌──────────┐
   │ symptoms │
   └──────────┘
\`\`\`

---

## API Response Examples

### Diagnosis Response (Symptom-based)
\`\`\`json
{
  "success": true,
  "data": {
    "disease": {
      "id": 1,
      "name": "Blast (Pyricularia oryzae)",
      "description": "...",
      "prevention_methods": "..."
    },
    "confidence": 0.95,
    "solution": {
      "treatment_steps": [
        "Identifikasi area yang terinfeksi",
        "Isolasi tanaman yang terinfeksi",
        "Aplikasikan fungisida"
      ],
      "recommended_medicines": [
        {
          "name": "Trichoderma",
          "dosage": "10 ml/liter air",
          "frequency": "Setiap 7 hari",
          "duration": "3 minggu"
        }
      ],
      "usage_guidance": "Semprotkan pada pagi atau sore hari...",
      "prevention_methods": ["Gunakan varietas tahan", "Jaga kelembaban optimal"],
      "additional_notes": "Konsultasikan dengan ahli pertanian jika tidak ada perbaikan"
    }
  },
  "message": "Diagnosis completed"
}
\`\`\`

### Diagnosis Response (Image-based)
\`\`\`json
{
  "success": true,
  "data": {
    "initial_diagnosis": {
      "disease": {
        "id": 1,
        "name": "Blast"
      },
      "confidence": 0.85,
      "certainty_level": "Hampir Pasti",
      "confidence_percentage": 85
    },
    "confirmation_questions": [
      {
        "question": "Apakah bercak berbentuk diamond?",
        "yes_certainty_adjustment": 0.15,
        "no_certainty_adjustment": -0.1
      }
    ],
    "solution": { ... },
    "image_path": "/uploads/images/1705318200000-abc123.jpg"
  }
}
\`\`\`

---

## Data Validation Rules

### Diseases
- name: Required, unique, max 100 chars
- description: Optional, max 5000 chars
- prevention_methods: Optional, max 5000 chars
- symptoms_description: Optional, max 5000 chars

### Symptoms
- code: Required, unique, max 10 chars
- name: Required, max 100 chars
- description: Optional, max 1000 chars
- category: Optional, max 50 chars

### Rules
- disease_id: Required, must exist in diseases table
- symptom_ids: Required, array of valid symptom IDs
- confidence_level: Optional, decimal 0-1, default 1.0

### Diagnosis History
- user_id: Optional (for anonymous users)
- disease_id: Required, must exist in diseases table
- diagnosis_type: Required, either 'symptoms' or 'image'
- confidence_level: Decimal 0-1
- symptoms_selected: Array of symptom IDs (for symptom-based)
- image_path: String (for image-based)

---

## Indexing Strategy

For optimal performance, create indexes on:

\`\`\`sql
-- Foreign keys
CREATE INDEX idx_diagnosis_history_user_id ON diagnosis_history(user_id);
CREATE INDEX idx_diagnosis_history_disease_id ON diagnosis_history(disease_id);
CREATE INDEX idx_rules_disease_id ON rules(disease_id);

-- Frequently searched columns
CREATE INDEX idx_diseases_name ON diseases(name);
CREATE INDEX idx_symptoms_code ON symptoms(code);
CREATE INDEX idx_users_email ON users(email);

-- Date-based queries
CREATE INDEX idx_diagnosis_history_created_at ON diagnosis_history(created_at);
\`\`\`
