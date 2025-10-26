# Pakar Padi Backend API Documentation

## Base URL
\`\`\`
http://localhost:5000/api
\`\`\`

## Authentication
Gunakan JWT token di header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

---

## 1. Authentication Endpoints

### Register
\`\`\`
POST /auth/register
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": { "id": 1, "username": "user123", "email": "user@example.com", "role": "user" },
    "token": "eyJhbGc..."
  },
  "message": "User registered successfully"
}
\`\`\`

### Login
\`\`\`
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": { "id": 1, "username": "user123", "email": "user@example.com", "role": "user" },
    "token": "eyJhbGc..."
  },
  "message": "Login successful"
}
\`\`\`

### Get Current User
\`\`\`
GET /auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "role": "user",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
\`\`\`

---

## 2. Diagnosis Endpoints

### Diagnose by Symptoms (Forward Chaining)
\`\`\`
POST /diagnose/symptoms
Content-Type: application/json

{
  "symptom_ids": [1, 2, 3]
}

Response:
{
  "success": true,
  "data": {
    "disease": {
      "id": 1,
      "name": "Blast",
      "description": "...",
      "prevention_methods": "..."
    },
    "confidence": 0.85,
    "solution": {
      "treatment_steps": ["Langkah 1", "Langkah 2", ...],
      "recommended_medicines": [
        {
          "name": "Obat A",
          "dosage": "10 ml/liter",
          "frequency": "Setiap 7 hari",
          "duration": "3 minggu"
        }
      ],
      "usage_guidance": "...",
      "prevention_methods": ["..."],
      "additional_notes": "..."
    }
  }
}
\`\`\`

### Diagnose by Image (Certainty Factor)
\`\`\`
POST /diagnose/image
Content-Type: multipart/form-data

Form Data:
- image: <file>

Response:
{
  "success": true,
  "data": {
    "initial_diagnosis": {
      "disease": { "id": 1, "name": "Blast", ... },
      "confidence": 0.85,
      "certainty_level": "Hampir Pasti",
      "confidence_percentage": 85
    },
    "confirmation_questions": [
      {
        "question": "Apakah bercak berbentuk diamond?",
        "yes_certainty_adjustment": 0.1,
        "no_certainty_adjustment": -0.05
      }
    ],
    "solution": { ... },
    "image_path": "/uploads/images/..."
  }
}
\`\`\`

### Confirm Image Diagnosis
\`\`\`
POST /diagnose/image/confirm
Content-Type: application/json

{
  "disease_id": 1,
  "base_confidence": 0.85,
  "answers": [
    { "question_id": 1, "answer": true },
    { "question_id": 2, "answer": false }
  ]
}

Response:
{
  "success": true,
  "data": {
    "final_diagnosis": {
      "disease": { ... },
      "confidence": 0.92,
      "certainty_level": "Hampir Pasti"
    },
    "solution": { ... }
  }
}
\`\`\`

---

## 3. Data Management Endpoints

### Get All Diseases
\`\`\`
GET /diseases

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Blast",
      "description": "...",
      "prevention_methods": "...",
      "symptoms_description": "..."
    }
  ]
}
\`\`\`

### Get All Symptoms
\`\`\`
GET /symptoms

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "S001",
      "name": "Bercak pada daun",
      "description": "...",
      "category": "Daun"
    }
  ]
}
\`\`\`

### Get All Rules
\`\`\`
GET /rules

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "disease_id": 1,
      "disease_name": "Blast",
      "symptom_ids": [1, 2, 3],
      "confidence_level": 1.0
    }
  ]
}
\`\`\`

---

## 4. History Endpoints

### Get User Diagnosis History
\`\`\`
GET /history?limit=10&offset=0
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "disease_id": 1,
        "disease_name": "Blast",
        "diagnosis_type": "symptoms",
        "confidence_level": 0.85,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 5,
    "limit": 10,
    "offset": 0
  }
}
\`\`\`

### Get Specific Diagnosis History
\`\`\`
GET /history/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "disease_id": 1,
    "disease_name": "Blast",
    "diagnosis_type": "symptoms",
    "confidence_level": 0.85,
    "symptoms_selected": [1, 2, 3],
    "ai_solution": { ... },
    "created_at": "2024-01-15T10:30:00Z"
  }
}
\`\`\`

### Delete Diagnosis History
\`\`\`
DELETE /history/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "History deleted"
}
\`\`\`

---

## 5. Admin Endpoints

### Get Dashboard Statistics
\`\`\`
GET /admin/dashboard/stats
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "data": {
    "total_users": 150,
    "total_diagnoses": 1250,
    "diagnoses_by_type": [
      { "diagnosis_type": "symptoms", "count": 800 },
      { "diagnosis_type": "image", "count": 450 }
    ],
    "most_common_diseases": [
      { "name": "Blast", "count": 450 },
      { "name": "Brown Spot", "count": 350 }
    ],
    "recent_diagnoses": [ ... ]
  }
}
\`\`\`

### Get All Users
\`\`\`
GET /admin/users?limit=20&offset=0
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "data": {
    "data": [ ... ],
    "total": 150
  }
}
\`\`\`

### Get Diagnosis History (Admin)
\`\`\`
GET /admin/diagnosis-history?limit=20&disease_id=1&diagnosis_type=symptoms
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "data": [ ... ]
}
\`\`\`

### Export Diagnoses
\`\`\`
GET /admin/export/diagnoses
Authorization: Bearer <admin_token>

Response: CSV file download
\`\`\`

---

## Error Responses

\`\`\`json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Error message here"
  }
}
\`\`\`

### Common Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
\`\`\`

---

## Integration with Frontend

### Example: Diagnose by Symptoms
\`\`\`javascript
const response = await fetch('http://localhost:5000/api/diagnose/symptoms', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({
    symptom_ids: [1, 2, 3]
  })
});

const result = await response.json();
console.log(result.data.disease);
console.log(result.data.solution);
\`\`\`

### Example: Diagnose by Image
\`\`\`javascript
const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch('http://localhost:5000/api/diagnose/image', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.data.initial_diagnosis);
console.log(result.data.confirmation_questions);
\`\`\`
