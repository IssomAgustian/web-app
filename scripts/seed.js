import { query } from "../src/config/database.js"
import { hashPassword } from "../src/utils/helpers.js"

async function seedDatabase() {
  try {
    console.log("Seeding database...")

    // Create admin user
    const adminPassword = await hashPassword("admin123")
    await query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
      ["admin", "admin@pakar-padi.com", adminPassword, "admin"],
    )

    // Insert diseases
    const diseases = [
      {
        name: "Blast",
        description: "Penyakit blast adalah penyakit yang disebabkan oleh jamur Pyricularia oryzae",
        prevention: "Gunakan varietas tahan, jaga kelembaban, dan aplikasi fungisida",
        symptoms: "Bercak berbentuk diamond pada daun, berwarna coklat dengan tepi gelap",
      },
      {
        name: "Brown Spot",
        description: "Penyakit bercak coklat disebabkan oleh jamur Bipolaris oryzae",
        prevention: "Gunakan benih sehat, rotasi tanaman, dan jaga sanitasi",
        symptoms: "Bercak coklat kecil pada daun, berkembang menjadi bercak besar",
      },
      {
        name: "Leaf Smut",
        description: "Penyakit karat daun disebabkan oleh jamur Entyloma oryzae",
        prevention: "Gunakan varietas tahan dan jaga kelembaban optimal",
        symptoms: "Bercak hitam kecil pada daun, berbentuk bulat atau oval",
      },
    ]

    for (const disease of diseases) {
      await query(
        `INSERT INTO diseases (name, description, prevention_methods, symptoms_description) 
        VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
        [disease.name, disease.description, disease.prevention, disease.symptoms],
      )
    }

    // Insert symptoms
    const symptoms = [
      { code: "S001", name: "Bercak pada daun", category: "Daun" },
      { code: "S002", name: "Bercak berbentuk diamond", category: "Daun" },
      { code: "S003", name: "Tepi bercak gelap", category: "Daun" },
      { code: "S004", name: "Bercak coklat", category: "Daun" },
      { code: "S005", name: "Bercak hitam kecil", category: "Daun" },
      { code: "S006", name: "Daun menguning", category: "Daun" },
      { code: "S007", name: "Daun layu", category: "Daun" },
      { code: "S008", name: "Batang busuk", category: "Batang" },
    ]

    for (const symptom of symptoms) {
      await query(
        "INSERT INTO symptoms (code, name, description, category) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
        [symptom.code, symptom.name, "", symptom.category],
      )
    }

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Seeding error:", error)
    process.exit(1)
  }
}

seedDatabase()
