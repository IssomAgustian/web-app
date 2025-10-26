"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Leaf, Zap, BarChart3, History, LogOut } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalDiagnosis: number
  recentDiagnosis: Array<{
    id: string
    disease: string
    date: string
  }>
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const user = localStorage.getItem("user")
    if (user) {
      try {
        const userData = JSON.parse(user)
        setUserName(userData.name)
      } catch (err) {
        console.error(err)
      }
    }

    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error("Gagal mengambil statistik")

      const data = await response.json()
      setStats(data.data)
    } catch (err) {
      setError("Gagal memuat dashboard.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat dashboard...</p>
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
          <div className="flex gap-4 items-center">
            <span className="text-gray-700">Selamat datang, {userName}</span>
            <Link href="/profile">
              <Button variant="outline">Profil</Button>
            </Link>
            <Button onClick={handleLogout} variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Kelola diagnosis penyakit padi Anda dengan mudah</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Diagnosis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats?.totalDiagnosis || 0}</div>
              <p className="text-xs text-gray-600 mt-1">Diagnosis yang telah dilakukan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Diagnosis Gejala</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">0</div>
              <p className="text-xs text-gray-600 mt-1">Berdasarkan gejala</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Diagnosis Gambar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">0</div>
              <p className="text-xs text-gray-600 mt-1">Berdasarkan gambar</p>
            </CardContent>
          </Card>
        </div>

        {/* Diagnosis Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="border-2 border-green-200 hover:shadow-lg transition">
            <CardHeader>
              <Zap className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Diagnosis Berdasarkan Gejala</CardTitle>
              <CardDescription>Pilih gejala yang terlihat pada tanaman padi Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Sistem akan menganalisis gejala yang Anda pilih dan memberikan diagnosis akurat tentang penyakit yang
                mungkin menyerang tanaman padi Anda.
              </p>
              <Link href="/diagnosis/symptoms" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700">Mulai Diagnosis</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 hover:shadow-lg transition">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>Diagnosis Berdasarkan Gambar</CardTitle>
              <CardDescription>Upload foto tanaman padi Anda untuk diagnosis otomatis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Unggah foto tanaman padi Anda dan AI akan menganalisis gambar untuk mendeteksi penyakit secara otomatis
                dengan akurasi tinggi.
              </p>
              <Link href="/diagnosis/image" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Mulai Diagnosis</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Diagnosis */}
        {stats && stats.recentDiagnosis.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Diagnosis Terbaru</CardTitle>
                  <CardDescription>Riwayat diagnosis terakhir Anda</CardDescription>
                </div>
                <Link href="/dashboard/history">
                  <Button variant="outline" size="sm">
                    <History className="w-4 h-4 mr-2" />
                    Lihat Semua
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentDiagnosis.slice(0, 5).map((diagnosis) => (
                  <div key={diagnosis.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{diagnosis.disease}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(diagnosis.date).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Link href={`/diagnosis/results?id=${diagnosis.id}`}>
                      <Button variant="outline" size="sm">
                        Lihat Detail
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
