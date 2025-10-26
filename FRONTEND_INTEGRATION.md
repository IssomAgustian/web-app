# Frontend Integration Guide

## Setup Frontend to Connect with Backend

### 1. Environment Configuration

Create \`.env.local\` in your React project:

\`\`\`env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_TIMEOUT=30000
\`\`\`

### 2. API Client Setup

Create \`src/services/api.js\`:

\`\`\`javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
);

export default apiClient;
\`\`\`

### 3. Authentication Service

Create \`src/services/authService.js\`:

\`\`\`javascript
import apiClient from './api';

export const authService = {
  register: (username, email, password, confirmPassword) =>
    apiClient.post('/auth/register', { username, email, password, confirmPassword }),

  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  getCurrentUser: () =>
    apiClient.get('/auth/me'),

  logout: () => {
    localStorage.removeItem('token');
    return apiClient.post('/auth/logout');
  },
};
\`\`\`

### 4. Diagnosis Service

Create \`src/services/diagnosisService.js\`:

\`\`\`javascript
import apiClient from './api';

export const diagnosisService = {
  // Symptom-based diagnosis
  diagnoseBySymptoms: (symptomIds) =>
    apiClient.post('/diagnose/symptoms', { symptom_ids: symptomIds }),

  // Image-based diagnosis
  diagnoseByImage: (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return apiClient.post('/diagnose/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Confirm image diagnosis
  confirmImageDiagnosis: (diseaseId, baseConfidence, answers) =>
    apiClient.post('/diagnose/image/confirm', {
      disease_id: diseaseId,
      base_confidence: baseConfidence,
      answers,
    }),

  // Get all diseases
  getDiseases: () =>
    apiClient.get('/diseases'),

  // Get all symptoms
  getSymptoms: () =>
    apiClient.get('/symptoms'),
};
\`\`\`

### 5. History Service

Create \`src/services/historyService.js\`:

\`\`\`javascript
import apiClient from './api';

export const historyService = {
  getHistory: (limit = 10, offset = 0) =>
    apiClient.get('/history', { params: { limit, offset } }),

  getHistoryDetail: (id) =>
    apiClient.get(\`/history/\${id}\`),

  deleteHistory: (id) =>
    apiClient.delete(\`/history/\${id}\`),
};
\`\`\`

### 6. React Component Examples

#### Symptom Diagnosis Component

\`\`\`jsx
import { useState, useEffect } from 'react';
import { diagnosisService } from '../services/diagnosisService';

export function SymptomDiagnosis() {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSymptoms();
  }, []);

  const loadSymptoms = async () => {
    try {
      const response = await diagnosisService.getSymptoms();
      setSymptoms(response.data);
    } catch (error) {
      console.error('Error loading symptoms:', error);
    }
  };

  const handleSymptomChange = (symptomId) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleDiagnose = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Pilih minimal satu gejala');
      return;
    }

    setLoading(true);
    try {
      const response = await diagnosisService.diagnoseBySymptoms(selectedSymptoms);
      setResult(response.data);
    } catch (error) {
      console.error('Diagnosis error:', error);
      alert('Terjadi kesalahan saat diagnosis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Diagnosis Berdasarkan Gejala</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Pilih Gejala:</h3>
        <div className="grid grid-cols-2 gap-3">
          {symptoms.map((symptom) => (
            <label key={symptom.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedSymptoms.includes(symptom.id)}
                onChange={() => handleSymptomChange(symptom.id)}
                className="mr-2"
              />
              <span>{symptom.name}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleDiagnose}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Sedang Diagnosis...' : 'Lakukan Diagnosis'}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="text-xl font-bold text-green-800 mb-2">
            Hasil Diagnosis: {result.disease.name}
          </h3>
          <p className="text-green-700 mb-4">
            Tingkat Keyakinan: {Math.round(result.confidence * 100)}%
          </p>

          <div className="bg-white p-4 rounded">
            <h4 className="font-bold mb-2">Penanganan:</h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-semibold">Langkah-langkah:</h5>
                <ol className="list-decimal list-inside">
                  {result.solution.treatment_steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h5 className="font-semibold">Obat yang Direkomendasikan:</h5>
                <ul className="list-disc list-inside">
                  {result.solution.recommended_medicines.map((med, idx) => (
                    <li key={idx}>
                      {med.name} - {med.dosage} ({med.frequency})
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-semibold">Panduan Penggunaan:</h5>
                <p>{result.solution.usage_guidance}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
\`\`\`

#### Image Diagnosis Component

\`\`\`jsx
import { useState } from 'react';
import { diagnosisService } from '../services/diagnosisService';

export function ImageDiagnosis() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [initialDiagnosis, setInitialDiagnosis] = useState(null);
  const [answers, setAnswers] = useState({});
  const [finalResult, setFinalResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDiagnose = async () => {
    if (!image) {
      alert('Pilih gambar terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      const response = await diagnosisService.diagnoseByImage(image);
      setInitialDiagnosis(response.data);
    } catch (error) {
      console.error('Diagnosis error:', error);
      alert('Terjadi kesalahan saat diagnosis');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const answerArray = initialDiagnosis.confirmation_questions.map((q, idx) => ({
        question_id: idx,
        answer: answers[idx] || false,
      }));

      const response = await diagnosisService.confirmImageDiagnosis(
        initialDiagnosis.initial_diagnosis.disease.id,
        initialDiagnosis.initial_diagnosis.confidence,
        answerArray
      );
      setFinalResult(response.data);
    } catch (error) {
      console.error('Confirmation error:', error);
      alert('Terjadi kesalahan saat konfirmasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Diagnosis Berdasarkan Gambar</h2>

      {!initialDiagnosis && (
        <div className="mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />
          {preview && (
            <img src={preview || "/placeholder.svg"} alt="Preview" className="max-w-xs mb-4 rounded" />
          )}
          <button
            onClick={handleDiagnose}
            disabled={!image || loading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Sedang Diagnosis...' : 'Analisis Gambar'}
          </button>
        </div>
      )}

      {initialDiagnosis && !finalResult && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <h3 className="text-lg font-bold mb-2">
            Diagnosis Awal: {initialDiagnosis.initial_diagnosis.disease.name}
          </h3>
          <p className="mb-4">
            Tingkat Keyakinan: {initialDiagnosis.initial_diagnosis.certainty_level}
            ({initialDiagnosis.initial_diagnosis.confidence_percentage}%)
          </p>

          {initialDiagnosis.confirmation_questions.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-3">Pertanyaan Konfirmasi:</h4>
              {initialDiagnosis.confirmation_questions.map((q, idx) => (
                <label key={idx} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={answers[idx] || false}
                    onChange={(e) =>
                      setAnswers({ ...answers, [idx]: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span>{q.question}</span>
                </label>
              ))}
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Sedang Konfirmasi...' : 'Konfirmasi Diagnosis'}
          </button>
        </div>
      )}

      {finalResult && (
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <h3 className="text-xl font-bold text-green-800 mb-2">
            Hasil Diagnosis Final: {finalResult.final_diagnosis.disease.name}
          </h3>
          <p className="text-green-700 mb-4">
            Tingkat Keyakinan: {finalResult.final_diagnosis.certainty_level}
            ({finalResult.final_diagnosis.confidence_percentage}%)
          </p>
          {/* Display solution similar to symptom diagnosis */}
        </div>
      )}
    </div>
  );
}
\`\`\`

### 7. State Management (Optional - using Context API)

Create \`src/context/AuthContext.jsx\`:

\`\`\`jsx
import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
\`\`\`

### 8. Testing API Endpoints

Use Postman or cURL to test:

\`\`\`bash
# Register
curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get symptoms
curl http://localhost:5000/api/symptoms

# Diagnose by symptoms
curl -X POST http://localhost:5000/api/diagnose/symptoms \\
  -H "Content-Type: application/json" \\
  -d '{"symptom_ids": [1, 2, 3]}'
\`\`\`

### 9. Error Handling

Implement global error handling in your React app:

\`\`\`jsx
import { useEffect } from 'react';

export function useApiError() {
  useEffect(() => {
    const handleError = (error) => {
      if (error.response?.status === 401) {
        // Redirect to login
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        // Show permission error
        alert('Anda tidak memiliki akses ke resource ini');
      } else if (error.response?.status === 500) {
        // Show server error
        alert('Terjadi kesalahan pada server');
      }
    };

    return handleError;
  }, []);
}
\`\`\`

## Deployment Checklist

- [ ] Backend running on production server
- [ ] Frontend API URL configured correctly
- [ ] CORS enabled for frontend domain
- [ ] JWT secret configured
- [ ] OpenAI API key configured
- [ ] Database migrations completed
- [ ] SSL/HTTPS enabled
- [ ] Environment variables set
- [ ] Error logging configured
- [ ] Monitoring setup
