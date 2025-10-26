"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Leaf, Download, Share2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface DiagnosisResult {
  id: string
  disease: {
    id: string
    name: string
    description: string
    severity: string
  }
  confidence: number
  certaintyFactor?: number
  solutions: {
    id: string
    title: string
    description: string
    steps: string[]
    medicines: Array<{
      name: string
      dosage: string
      frequency: string
    }>
    prevention: string[]
  }
  createdAt: string
}

export default function DiagnosisResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const diagnosisId = searchParams.get("id")

  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    if (!diagnosisId) {
      router.push("/dashboard")
      return
    }

    fetchResult()
  }, [diagnosisId, router])

  const fetchResult = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/diagnosis/${diagnosisId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error("Gagal mengambil hasil diagnosis")

      const data = await response.json()
      setResult(data.data)
    } catch (err) {
      setError("Gagal memuat hasil diagnosis. Silakan coba lagi.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!result) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/diagnosis/${diagnosisId}/export`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error("Download gagal")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `diagnosis-${diagnosisId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("Download error:", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat hasil diagnosis...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">{error || "Hasil diagnosis tidak ditemukan"}</p>
                  <Link href="/dashboard">
                    <Button variant="outline" className="mt-4 bg-transparent">
                      Kembali ke Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "tinggi":
        return "bg-red-100 text-red-800 border-red-300"
      case "sedang":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "rendah":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600"
    if (confidence >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="border-b border-green-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">Pakar Padi</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline">Profil</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Link>

        {/* Disease Card */}
        <Card className="mb-6 border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl text-green-900">{result.disease.name}</CardTitle>
                <CardDescription className="text-green-700 mt-2">{result.disease.description}</CardDescription>
              </div>
              <div className={`px-4 py-2 rounded-lg border ${getSeverityColor(result.disease.severity)}`}>
                <p className="font-semibold text-sm">Tingkat Keparahan: {result.disease.severity}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tingkat Kepercayaan</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                  <span className={`text-2xl font-bold ${getConfidenceColor(result.confidence)}`}>
                    {result.confidence}%
                  </span>
                </div>
              </div>

              {result.certaintyFactor && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Certainty Factor</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${result.certaintyFactor}%` }}
                      />
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{result.certaintyFactor}%</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Solutions Card */}
        {result.solutions && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Solusi Penanganan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3">{result.solutions.title}</h3>
                <p className="text-gray-700 mb-4">{result.solutions.description}</p>
              </div>

              {/* Steps */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Langkah-Langkah Penanganan:</h4>
                <ol className="space-y-2">
                  {result.solutions.steps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Medicines */}
              {result.solutions.medicines.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Obat yang Direkomendasikan:</h4>
                  <div className="space-y-3">
                    {result.solutions.medicines.map((medicine, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="font-medium text-gray-900">{medicine.name}</p>
                        <p className="text-sm text-gray-600">Dosis: {medicine.dosage}</p>
                        <p className="text-sm text-gray-600">Frekuensi: {medicine.frequency}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prevention */}
              {result.solutions.prevention.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Pencegahan:</h4>
                  <ul className="space-y-2">
                    {result.solutions.prevention.map((item, index) => (
                      <li key={index} className="flex gap-2 text-gray-700">
                        <span className="text-green-600 font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={handleDownload} className="flex-1 bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Download Laporan
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <Share2 className="w-4 h-4 mr-2" />
            Bagikan
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Diagnosis Lagi
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
