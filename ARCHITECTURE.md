# Pakar Padi Backend Architecture

## System Overview

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP/REST API
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Express.js Backend                         │
├─────────────────────────────────────────────────────────────┤
│  Routes │ Controllers │ Services │ Middleware │ Utils       │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   PostgreSQL         Redis Cache      File Storage
   (Database)         (Caching)        (Images)
\`\`\`

## Directory Structure

\`\`\`
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # Database connection & initialization
│   │   ├── app.js        # App configuration
│   │   └── ai.js         # AI service configuration
│   │
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # Authentication & authorization
│   │   ├── errorHandler.js
│   │   └── validation.js # Request validation
│   │
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication routes
│   │   ├── diseases.js   # Disease management
│   │   ├── symptoms.js   # Symptom management
│   │   ├── rules.js      # Rule management
│   │   ├── diagnosis.js  # Diagnosis endpoints
│   │   ├── history.js    # History endpoints
│   │   └── admin.js      # Admin endpoints
│   │
│   ├── services/         # Business logic
│   │   ├── forwardChainingService.js
│   │   ├── certaintyFactorService.js
│   │   ├── imageProcessingService.js
│   │   ├── aiSolutionService.js
│   │   └── reportService.js
│   │
│   ├── utils/            # Utility functions
│   │   ├── logger.js
│   │   ├── helpers.js
│   │   ├── constants.js
│   │   └── cache.js
│   │
│   └── models/           # Data models (if using ORM)
│
├── scripts/              # Database scripts
│   └── seed.js          # Database seeding
│
├── uploads/              # Uploaded files
│   └── images/
│
├── logs/                 # Application logs
│
├── server.js             # Entry point
├── package.json
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── README.md
\`\`\`

## Data Flow

### Symptom-Based Diagnosis Flow
\`\`\`
1. User selects symptoms (Frontend)
   ↓
2. POST /api/diagnose/symptoms with symptom_ids
   ↓
3. ForwardChainingService.diagnose()
   - Get all rules from database
   - Calculate match scores
   - Find disease with highest confidence
   ↓
4. AISolutionService.generateSolution()
   - Call OpenAI API
   - Generate treatment steps & medicines
   ↓
5. Save to diagnosis_history (if authenticated)
   ↓
6. Return diagnosis + solution to frontend
\`\`\`

### Image-Based Diagnosis Flow
\`\`\`
1. User uploads image (Frontend)
   ↓
2. POST /api/diagnose/image with image file
   ↓
3. ImageProcessingService.processImage()
   - Validate file
   - Resize & optimize
   - Save to disk
   ↓
4. AI Model Prediction (Mock or Real ML Model)
   - Predict disease & confidence
   ↓
5. CertaintyFactorService.applyUncertainty()
   - Convert confidence to certainty level
   - Get confirmation questions
   ↓
6. Return initial diagnosis + questions
   ↓
7. User answers confirmation questions
   ↓
8. POST /api/diagnose/image/confirm
   ↓
9. CertaintyFactorService.calculateCombinedCertainty()
   - Adjust confidence based on answers
   ↓
10. AISolutionService.generateSolution()
    - Generate final treatment
    ↓
11. Return final diagnosis + solution
\`\`\`

## Database Schema

### Users Table
- id (PK)
- username (UNIQUE)
- email (UNIQUE)
- password_hash
- role (admin/user)
- created_at, updated_at

### Diseases Table
- id (PK)
- name (UNIQUE)
- description
- prevention_methods
- symptoms_description
- created_at, updated_at

### Symptoms Table
- id (PK)
- code (UNIQUE)
- name
- description
- category
- created_at

### Rules Table (Forward Chaining)
- id (PK)
- disease_id (FK)
- symptom_ids (Array)
- confidence_level
- created_at, updated_at

### Diagnosis History Table
- id (PK)
- user_id (FK, nullable)
- disease_id (FK)
- diagnosis_type (symptoms/image)
- confidence_level
- symptoms_selected (Array)
- image_path
- certainty_level
- ai_solution (JSON)
- created_at

## Authentication Flow

\`\`\`
1. User registers/logs in
   ↓
2. Backend validates credentials
   ↓
3. Generate JWT token
   ↓
4. Return token to frontend
   ↓
5. Frontend stores token (localStorage/sessionStorage)
   ↓
6. Frontend includes token in Authorization header
   ↓
7. Backend verifies token in middleware
   ↓
8. Request proceeds if valid, rejected if invalid
\`\`\`

## Error Handling

- Centralized error handler middleware
- Consistent error response format
- Logging of all errors
- Appropriate HTTP status codes
- User-friendly error messages

## Security Measures

- Password hashing with bcryptjs
- JWT token authentication
- Input validation with Joi
- CORS configuration
- File upload restrictions
- SQL injection prevention (parameterized queries)
- Rate limiting (recommended for production)

## Performance Optimization

- Redis caching for frequently accessed data
- Database indexing on foreign keys
- Image optimization and compression
- Pagination for list endpoints
- Connection pooling for database

## Scalability Considerations

- Stateless API design
- Horizontal scaling ready
- Load balancer compatible
- Microservices ready architecture
- Async/await for non-blocking operations

---

## Complete Data Flow

### Admin Panel - Add Symptom Flow
\`\`\`
1. Admin clicks "Tambah Gejala"
   ↓
2. Form modal opens
   ↓
3. Admin fills: code, name, description
   ↓
4. Admin clicks "Simpan"
   ↓
5. POST /api/symptoms with data
   ↓
6. Backend validates input
   ↓
7. Save to database
   ↓
8. Return success response
   ↓
9. Frontend updates table
   ↓
10. Show success message
\`\`\`

### Admin Panel - Test Rule Flow
\`\`\`
1. Admin selects a rule
   ↓
2. Clicks "Test Rule"
   ↓
3. Simulation form opens
   ↓
4. Admin selects symptoms to test
   ↓
5. POST /api/rules/test with symptoms
   ↓
6. Backend runs forward chaining
   ↓
7. Returns matched disease & confidence
   ↓
8. Display result in modal
\`\`\`

### Admin Panel - Generate Report Flow
\`\`\`
1. Admin selects report type
   ↓
2. Selects date range
   ↓
3. Clicks "Generate Report"
   ↓
4. GET /api/admin/reports with filters
   ↓
5. Backend queries diagnosis_history
   ↓
6. Calculates statistics
   ↓
7. Returns data with charts
   ↓
8. Frontend displays report
   ↓
9. Admin can export to PDF/Excel
\`\`\`

---

## API Endpoints for Admin

### Dashboard
- `GET /api/admin/dashboard` - Get statistics

### Symptoms
- `GET /api/symptoms` - List all
- `POST /api/symptoms` - Create
- `PUT /api/symptoms/:id` - Update
- `DELETE /api/symptoms/:id` - Delete
- `POST /api/symptoms/import` - Import CSV

### Diseases
- `GET /api/diseases` - List all
- `POST /api/diseases` - Create
- `PUT /api/diseases/:id` - Update
- `DELETE /api/diseases/:id` - Delete

### Rules
- `GET /api/rules` - List all
- `POST /api/rules` - Create
- `PUT /api/rules/:id` - Update
- `DELETE /api/rules/:id` - Delete
- `POST /api/rules/test` - Test rule

### History
- `GET /api/history` - List with filters
- `DELETE /api/history/:id` - Delete
- `GET /api/history/export` - Export data

### Users
- `GET /api/admin/users` - List all
- `PUT /api/admin/users/:id/block` - Block user
- `PUT /api/admin/users/:id/password` - Reset password
- `DELETE /api/admin/users/:id` - Delete user

### Reports
- `GET /api/admin/reports/diseases` - Disease report
- `GET /api/admin/reports/usage` - Usage report
- `GET /api/admin/reports/export` - Export report

---

## Security in Admin Panel

- JWT authentication required for all admin endpoints
- Role-based access control (admin only)
- Input validation on all forms
- CSRF protection
- Rate limiting on sensitive operations
- Audit logging for admin actions
- Password hashing for user management

---

## Performance Optimization

### Frontend
- Code splitting per page
- Image optimization
- Lazy loading for tables
- Pagination for large datasets
- Caching of API responses

### Backend
- Database indexing on frequently queried columns
- Query optimization
- Connection pooling
- Redis caching for statistics
- Pagination for list endpoints

---

## Scalability

- Stateless API design
- Horizontal scaling ready
- Load balancer compatible
- Microservices ready
- Async/await for non-blocking operations
- Database replication ready
