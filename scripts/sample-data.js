/**
 * Sample Data for Pakar Padi
 * Run this script to populate database with sample data
 */

import { query } from "../src/config/database.js"

async function insertSampleData() {
  try {
    console.log("Inserting sample data...")

    // Sample Diseases
    const diseases = [
      {
        name: "Blast (Pyricularia oryzae)",
        description:
          "Penyakit blast adalah penyakit yang disebabkan oleh jamur Pyricularia oryzae. Penyakit ini merupakan salah satu penyakit paling penting pada tanaman padi di seluruh dunia.",
        prevention:
          "1. Gunakan varietas tahan\n2. Jaga kelembaban optimal\n3. Aplikasi fungisida secara berkala\n4. Sanitasi lahan",
        symptoms:
          "Bercak berbentuk diamond pada daun, berwarna coklat dengan tepi gelap, pusat bercak berwarna abu-abu",
      },
      {
        name: "Brown Spot (Bipolaris oryzae)",
        description:
          "Penyakit bercak coklat disebabkan oleh jamur Bipolaris oryzae. Penyakit ini menyerang daun, batang, dan biji padi.",
        prevention: "1. Gunakan benih sehat\n2. Rotasi tanaman\n3. Jaga sanitasi lahan\n4. Aplikasi fungisida",
        symptoms:
          "Bercak coklat kecil pada daun, berkembang menjadi bercak besar dengan halo kuning, dapat menyerang seluruh daun",
      },
      {
        name: "Leaf Smut (Entyloma oryzae)",
        description: "Penyakit karat daun disebabkan oleh jamur Entyloma oryzae. Penyakit ini menyerang daun padi.",
        prevention: "1. Gunakan varietas tahan\n2. Jaga kelembaban optimal\n3. Sanitasi lahan\n4. Aplikasi fungisida",
        symptoms: "Bercak hitam kecil pada daun, berbentuk bulat atau oval, dapat berkembang menjadi bercak besar",
      },
      {
        name: "Sheath Blight (Rhizoctonia solani)",
        description:
          "Penyakit busuk pelepah disebabkan oleh jamur Rhizoctonia solani. Penyakit ini menyerang pelepah daun dan batang.",
        prevention: "1. Jaga kelembaban optimal\n2. Sanitasi lahan\n3. Rotasi tanaman\n4. Aplikasi fungisida",
        symptoms: "Bercak coklat pada pelepah daun, berkembang ke atas, dapat menyebabkan busuk batang",
      },
      {
        name: "Bacterial Leaf Blight (Xanthomonas oryzae)",
        description:
          "Penyakit hawar daun bakteri disebabkan oleh bakteri Xanthomonas oryzae. Penyakit ini sangat merugikan.",
        prevention: "1. Gunakan benih sehat\n2. Jaga sanitasi lahan\n3. Rotasi tanaman\n4. Aplikasi antibiotik",
        symptoms: "Bercak memanjang pada daun, berwarna kuning dengan tepi gelap, dapat menyebabkan kematian daun",
      },
    ]

    for (const disease of diseases) {
      await query(
        `INSERT INTO diseases (name, description, prevention_methods, symptoms_description) 
        VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
        [disease.name, disease.description, disease.prevention, disease.symptoms],
      )
    }

    console.log("✓ Diseases inserted")

    // Sample Symptoms
    const symptoms = [
      { code: "S001", name: "Bercak pada daun", category: "Daun" },
      { code: "S002", name: "Bercak berbentuk diamond", category: "Daun" },
      { code: "S003", name: "Tepi bercak gelap", category: "Daun" },
      { code: "S004", name: "Pusat bercak abu-abu", category: "Daun" },
      { code: "S005", name: "Bercak coklat", category: "Daun" },
      { code: "S006", name: "Halo kuning di sekitar bercak", category: "Daun" },
      { code: "S007", name: "Bercak hitam kecil", category: "Daun" },
      { code: "S008", name: "Daun menguning", category: "Daun" },
      { code: "S009", name: "Daun layu", category: "Daun" },
      { code: "S010", name: "Batang busuk", category: "Batang" },
      { code: "S011", name: "Bercak pada pelepah daun", category: "Pelepah" },
      { code: "S012", name: "Bercak memanjang", category: "Daun" },
      { code: "S013", name: "Bercak dengan tepi gelap", category: "Daun" },
      { code: "S014", name: "Kematian daun", category: "Daun" },
      { code: "S015", name: "Pertumbuhan terhambat", category: "Umum" },
    ]

    for (const symptom of symptoms) {
      await query(
        "INSERT INTO symptoms (code, name, description, category) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
        [symptom.code, symptom.name, "", symptom.category],
      )
    }

    console.log("✓ Symptoms inserted")

    // Get IDs for creating rules
    const diseasesResult = await query("SELECT id, name FROM diseases")
    const symptomsResult = await query("SELECT id, code FROM symptoms")

    const diseaseMap = {}
    const symptomMap = {}

    diseasesResult.rows.forEach((d) => {
      diseaseMap[d.name] = d.id
    })

    symptomsResult.rows.forEach((s) => {
      symptomMap[s.code] = s.id
    })

    // Sample Rules (Forward Chaining)
    const rules = [
      {
        disease: "Blast (Pyricularia oryzae)",
        symptoms: ["S001", "S002", "S003", "S004"],
        confidence: 1.0,
      },
      {
        disease: "Blast (Pyricularia oryzae)",
        symptoms: ["S002", "S003"],
        confidence: 0.9,
      },
      {
        disease: "Brown Spot (Bipolaris oryzae)",
        symptoms: ["S005", "S006", "S008"],
        confidence: 1.0,
      },
      {
        disease: "Brown Spot (Bipolaris oryzae)",
        symptoms: ["S005", "S006"],
        confidence: 0.85,
      },
      {
        disease: "Leaf Smut (Entyloma oryzae)",
        symptoms: ["S007", "S001"],
        confidence: 0.95,
      },
      {
        disease: "Sheath Blight (Rhizoctonia solani)",
        symptoms: ["S011", "S010"],
        confidence: 1.0,
      },
      {
        disease: "Bacterial Leaf Blight (Xanthomonas oryzae)",
        symptoms: ["S012", "S013", "S014"],
        confidence: 1.0,
      },
    ]

    for (const rule of rules) {
      const diseaseId = diseaseMap[rule.disease]
      const symptomIds = rule.symptoms.map((code) => symptomMap[code])

      await query(
        "INSERT INTO rules (disease_id, symptom_ids, confidence_level) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
        [diseaseId, symptomIds, rule.confidence],
      )
    }

    console.log("✓ Rules inserted")

    // Sample Certainty Rules
    const certaintyRules = [
      {
        disease: "Blast (Pyricularia oryzae)",
        base_certainty: 0.7,
        questions: [
          {
            question: "Apakah bercak berbentuk diamond?",
            yes_certainty_adjustment: 0.15,
            no_certainty_adjustment: -0.1,
          },
          {
            question: "Apakah pusat bercak berwarna abu-abu?",
            yes_certainty_adjustment: 0.1,
            no_certainty_adjustment: -0.05,
          },
        ],
      },
      {
        disease: "Brown Spot (Bipolaris oryzae)",
        base_certainty: 0.75,
        questions: [
          {
            question: "Apakah ada halo kuning di sekitar bercak?",
            yes_certainty_adjustment: 0.15,
            no_certainty_adjustment: -0.1,
          },
          {
            question: "Apakah bercak berwarna coklat?",
            yes_certainty_adjustment: 0.1,
            no_certainty_adjustment: -0.05,
          },
        ],
      },
    ]

    for (const rule of certaintyRules) {
      const diseaseId = diseaseMap[rule.disease]

      await query(
        "INSERT INTO certainty_rules (disease_id, base_certainty, confirmation_questions) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
        [diseaseId, rule.base_certainty, JSON.stringify(rule.questions)],
      )
    }

    console.log("✓ Certainty rules inserted")

    console.log("\n✅ Sample data inserted successfully!")
  } catch (error) {
    console.error("Error inserting sample data:", error)
    process.exit(1)
  }
}

insertSampleData()
