"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Leaf, Eye, Trash2 } from "lucide-react"
import Link from "next/link"

interface DiagnosisHistory {
  id: string
  disease: {
    name: string
    severity: string
  }
  confidence: number
  type: "symptoms" | "image"
  createdAt: string
}

export default function HistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState<DiagnosisHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<"all" | "symptoms" | "image">("all")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchHistory()
  }, [router, filter])

  const fetchHistory = async () => {
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/history`)
      if (filter !== "all") {
        url.searchParams.append("type", filter)
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error("Gagal mengambil riwayat")

      const data = await response.json()
      setHistory(data.data || [])
    } catch (err) {
      setError("Gagal memuat riwayat diagnosis.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus diagnosis ini?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error("Gagal menghapus")

      setHistory(history.filter((item) => item.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "tinggi":
        return "bg-red-100 text-red-800"
      case "sedang":
        return "bg-yellow-100 text-yellow-800"
      case "rendah":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat riwayat...</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Riwayat Diagnosis</CardTitle>
            <CardDescription>Lihat semua diagnosis yang telah Anda lakukan</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Filter */}
            <div className="flex gap-2 mb-6">
              {(["all", "symptoms", "image"] as const).map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? "default" : "outline"}
                  onClick={() => setFilter(type)}
                  className={filter === type ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {type === "all" ? "Semua" : type === "symptoms" ? "Gejala" : "Gambar"}
                </Button>
              ))}
            </div>

            {/* History List */}
            {history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Belum ada riwayat diagnosis</p>
                <Link href="/dashboard">
                  <Button className="bg-green-600 hover:bg-green-700">Mulai Diagnosis</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{item.disease.name}</h3>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(item.disease.severity)}`}
                          >
                            {item.disease.severity}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {item.type === "symptoms" ? "Diagnosis Gejala" : "Diagnosis Gambar"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{formatDate(item.createdAt)}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${item.confidence}%` }} />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{item.confidence}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/diagnosis/results?id=${item.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
