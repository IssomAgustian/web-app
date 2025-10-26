"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Leaf, Zap, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-green-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">Pakar Padi</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-green-600 hover:bg-green-700">Register</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Diagnosis Penyakit Padi dengan AI</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sistem pakar cerdas untuk mendiagnosis penyakit padi dengan akurasi tinggi menggunakan gejala atau foto
            tanaman
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/diagnosis/symptoms">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Mulai Diagnosis <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline">
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Diagnosis Gejala</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Pilih gejala yang terlihat pada tanaman padi Anda dan sistem akan mengidentifikasi penyakitnya dengan
                akurat
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Diagnosis Gambar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Upload foto tanaman padi Anda dan AI akan menganalisis untuk mendeteksi penyakit secara otomatis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Leaf className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Solusi Lengkap</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Dapatkan rekomendasi penanganan lengkap termasuk obat, dosis, dan cara pencegahan penyakit
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-100 bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>&copy; 2025 Pakar Padi. Semua hak dilindungi.</p>
        </div>
      </footer>
    </main>
  )
}
