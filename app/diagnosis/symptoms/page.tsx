"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Loader2, Leaf } from "lucide-react"
import Link from "next/link"

interface Symptom {
  id: string
  name: string
  description: string
}

export default function DiagnosisSymptomsPage() {
  const router = useRouter()
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [diagnosing, setDiagnosing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchSymptoms()
  }, [router])

  const fetchSymptoms = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/symptoms`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error("Gagal mengambil data gejala")

      const data = await response.json()
      setSymptoms(data.data || [])
    } catch (err) {
      setError("Gagal memuat gejala. Silakan coba lagi.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId],
    )
  }

  const handleDiagnose = async () => {
    if (selectedSymptoms.length === 0) {
      setError("Pilih minimal satu gejala")
      return
    }

    setDiagnosing(true)
    setError("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/diagnosis/symptoms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          symptomIds: selectedSymptoms,
        }),
      })

      if (!response.ok) throw new Error("Diagnosis gagal")

      const data = await response.json()
      router.push(`/diagnosis/results?id=${data.data.id}`)
    } catch (err) {
      setError("Terjadi kesalahan saat diagnosis. Silakan coba lagi.")
      console.error(err)
    } finally {
      setDiagnosing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat gejala...</p>
        </div>
      </div>
    )
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
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Diagnosis Berdasarkan Gejala</CardTitle>
            <CardDescription>Pilih gejala yang Anda lihat pada tanaman padi Anda</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-4 mb-8">
              {symptoms.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Tidak ada gejala tersedia</p>
              ) : (
                symptoms.map((symptom) => (
                  <div
                    key={symptom.id}
                    className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Checkbox
                      id={symptom.id}
                      checked={selectedSymptoms.includes(symptom.id)}
                      onCheckedChange={() => handleSymptomToggle(symptom.id)}
                      className="mt-1"
                    />
                    <label htmlFor={symptom.id} className="flex-1 cursor-pointer">
                      <p className="font-medium text-gray-900">{symptom.name}</p>
                      <p className="text-sm text-gray-600">{symptom.description}</p>
                    </label>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleDiagnose}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={diagnosing || selectedSymptoms.length === 0}
              >
                {diagnosing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Lakukan Diagnosis"
                )}
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Batal
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-600 text-center mt-4">Dipilih: {selectedSymptoms.length} gejala</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
