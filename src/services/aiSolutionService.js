import { OpenAI } from "openai"
import logger from "../utils/logger.js"

export class AISolutionService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  /**
   * Generate treatment solution using AI
   * @param {Object} disease - Disease object
   * @param {number} confidence - Confidence level (0-1)
   * @returns {Promise<Object>} Generated solution
   */
  async generateSolution(disease, confidence) {
    try {
      const prompt = this.buildPrompt(disease, confidence)

      const response = await this.client.chat.completions.create({
        model: process.env.AI_MODEL || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Anda adalah ahli pertanian padi dengan spesialisasi penyakit tanaman padi. 
            Berikan solusi yang praktis, mudah dipahami, dan berdasarkan standar pertanian modern.
            Respons harus dalam format JSON yang valid.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      })

      const content = response.choices[0].message.content
      const solution = this.parseSolution(content)

      logger.info(`AI solution generated for disease: ${disease.name}`)

      return solution
    } catch (error) {
      logger.error("AI solution generation error:", error)
      throw error
    }
  }

  /**
   * Build prompt for AI
   * @param {Object} disease - Disease object
   * @param {number} confidence - Confidence level
   * @returns {string} Formatted prompt
   */
  buildPrompt(disease, confidence) {
    return `
Berikan solusi penanganan untuk penyakit padi "${disease.name}" dengan tingkat keyakinan ${Math.round(confidence * 100)}%.

Informasi penyakit:
- Deskripsi: ${disease.description || "Tidak tersedia"}
- Gejala: ${disease.symptoms_description || "Tidak tersedia"}
- Metode Pencegahan: ${disease.prevention_methods || "Tidak tersedia"}

Berikan respons dalam format JSON dengan struktur berikut (HARUS valid JSON):
{
  "treatment_steps": ["langkah 1", "langkah 2", "langkah 3", ...],
  "recommended_medicines": [
    {
      "name": "nama obat",
      "dosage": "dosis penggunaan",
      "frequency": "frekuensi penggunaan",
      "duration": "durasi penggunaan"
    }
  ],
  "usage_guidance": "panduan detail penggunaan obat dan penanganan",
  "prevention_methods": ["cara pencegahan 1", "cara pencegahan 2", ...],
  "additional_notes": "catatan tambahan atau peringatan penting"
}

Pastikan informasi akurat, praktis, dan sesuai dengan standar pertanian padi Indonesia.
    `
  }

  /**
   * Parse AI response
   * @param {string} content - AI response content
   * @returns {Object} Parsed solution
   */
  parseSolution(content) {
    try {
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in response")
      }

      const solution = JSON.parse(jsonMatch[0])

      return {
        treatment_steps: solution.treatment_steps || [],
        recommended_medicines: solution.recommended_medicines || [],
        usage_guidance: solution.usage_guidance || "",
        prevention_methods: solution.prevention_methods || [],
        additional_notes: solution.additional_notes || "",
      }
    } catch (error) {
      logger.error("Error parsing AI solution:", error)
      // Return default structure if parsing fails
      return {
        treatment_steps: [],
        recommended_medicines: [],
        usage_guidance: content,
        prevention_methods: [],
        additional_notes: "Silakan konsultasikan dengan ahli pertanian untuk informasi lebih detail.",
      }
    }
  }

  /**
   * Generate confirmation questions for image diagnosis
   * @param {Object} disease - Disease object
   * @returns {Promise<Array>} Confirmation questions
   */
  async generateConfirmationQuestions(disease) {
    try {
      const prompt = `
Berikan 3-5 pertanyaan konfirmasi untuk membantu memastikan diagnosis penyakit padi "${disease.name}".
Pertanyaan harus spesifik, mudah dipahami, dan dapat dijawab dengan ya/tidak.

Respons dalam format JSON:
[
  {
    "question": "pertanyaan?",
    "yes_certainty_adjustment": 0.1,
    "no_certainty_adjustment": -0.05
  }
]

Pastikan adjustments bernilai antara -0.2 dan 0.2.
      `

      const response = await this.client.chat.completions.create({
        model: process.env.AI_MODEL || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Anda adalah ahli pertanian padi. Berikan pertanyaan konfirmasi yang akurat.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 500,
      })

      const content = response.choices[0].message.content
      const jsonMatch = content.match(/\[[\s\S]*\]/)

      if (!jsonMatch) {
        return []
      }

      return JSON.parse(jsonMatch[0])
    } catch (error) {
      logger.error("Error generating confirmation questions:", error)
      return []
    }
  }
}

export default new AISolutionService()
