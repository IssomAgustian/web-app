# API Documentation - Pakar Padi

## Base URL
\`http://localhost:5000/api\`

## Authentication

Semua endpoint (kecuali auth) memerlukan JWT token di header:

\`\`\`
Authorization: Bearer <token>
\`\`\`

## Endpoints

### Authentication

#### Register
\`\`\`
POST /auth/register
Content-Type: application/json

{
  "username": "budi",
  "email": "budi@example.com",
  "password": "password123"
}

Response: 201
{
  "success": true,
  "data": {
    "id": 1,
    "username": "budi",
    "email": "budi@example.com",
    "token": "eyJhbGc..."
  }
}
\`\`\`

#### Login
\`\`\`
POST /auth/login
Content-Type: application/json

{
  "email": "budi@example.com",
  "password": "password123"
}

Response: 200
{
  "success": true,
  "data": {
    "id": 1,
    "username": "budi",
    "token": "eyJhbGc..."
  }
}
\`\`\`

### Diagnosis

#### Diagnosis Berdasarkan Gejala
\`\`\`
POST /diagnosis/symptoms
Content-Type: application/json
Authorization: Bearer <token>

{
  "symptom_ids": [1, 3, 5],
  "user_id": 1
}

Response: 200
{
  "success": true,
  "data": {
    "disease": {
      "id": 1,
      "name": "Blast",
      "description": "..."
    },
    "confidence": 0.85,
    "ai_solution": {
      "treatment_steps": ["Step 1", "Step 2"],
      "medicines": ["Obat A", "Obat B"],
      "usage_guide": "..."
    }
  }
}
\`\`\`

#### Diagnosis Berdasarkan Gambar
\`\`\`
POST /diagnosis/image
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- image: <file>
- user_id: 1

Response: 200
{
  "success": true,
  "data": {
    "disease": "Blast",
    "confidence": 0.92,
    "certainty_level": "Hampir Pasti",
    "confirmation_questions": [
      {
        "id": 1,
        "question": "Apakah bercak berbentuk diamond?"
      }
    ]
  }
}
\`\`\`

### Management (Admin Only)

#### Get All Symptoms
\`\`\`
GET /symptoms
Authorization: Bearer <admin_token>

Response: 200
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "S001",
      "name": "Bercak Coklat",
      "description": "..."
    }
  ]
}
\`\`\`

#### Create Symptom
\`\`\`
POST /symptoms
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "code": "S004",
  "name": "Daun Layu",
  "description": "Daun terlihat layu dan mengering"
}

Response: 201
{
  "success": true,
  "data": { ... }
}
\`\`\`

#### Get All Diseases
\`\`\`
GET /diseases
Authorization: Bearer <admin_token>

Response: 200
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Blast",
      "description": "...",
      "prevention": "...",
      "treatment": "..."
    }
  ]
}
\`\`\`

#### Get Diagnosis History
\`\`\`
GET /history?user_id=1&type=symptoms&limit=10
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "disease": "Blast",
      "type": "symptoms",
      "confidence": 0.85,
      "created_at": "2024-03-15T10:30:00Z"
    }
  ]
}
\`\`\`

## Error Responses

### 400 Bad Request
\`\`\`json
{
  "success": false,
  "message": "Invalid input",
  "errors": {
    "symptom_ids": "Required field"
  }
}
\`\`\`

### 401 Unauthorized
\`\`\`json
{
  "success": false,
  "message": "Invalid or missing token"
}
\`\`\`

### 403 Forbidden
\`\`\`json
{
  "success": false,
  "message": "Admin access required"
}
\`\`\`

### 500 Internal Server Error
\`\`\`json
{
  "success": false,
  "message": "Internal server error",
  "error": "..."
}
\`\`\`

## Rate Limiting

- 100 requests per 15 minutes per IP
- 1000 requests per hour per user

## Pagination

Endpoints yang mengembalikan list mendukung pagination:

\`\`\`
GET /symptoms?page=1&limit=10&sort=name&order=asc
\`\`\`

Parameters:
- `page`: Halaman (default: 1)
- `limit`: Jumlah item per halaman (default: 10, max: 100)
- `sort`: Field untuk sorting
- `order`: asc atau desc
