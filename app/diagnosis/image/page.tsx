"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Leaf, Upload, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DiagnosisImagePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [diagnosing, setDiagnosing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Silakan pilih file gambar")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5MB")
      return
    }

    setImage(file)
    setError("")

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImage(null)
    setPreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDiagnose = async () => {
    if (!image) {
      setError("Pilih gambar terlebih dahulu")
      return
    }

    setDiagnosing(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("image", image)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/diagnosis/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
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
            <CardTitle className="text-3xl">Diagnosis Berdasarkan Gambar</CardTitle>
            <CardDescription>Upload foto tanaman padi Anda untuk diagnosis otomatis</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center cursor-pointer hover:bg-green-50 transition"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {!preview ? (
                  <div>
                    <Upload className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">Klik untuk upload gambar</p>
                    <p className="text-sm text-gray-600">atau drag and drop gambar di sini</p>
                    <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG, WebP (Max 5MB)</p>
                  </div>
                ) : (
                  <div className="relative inline-block">
                    <Image
                      src={preview || "/placeholder.svg"}
                      alt="Preview"
                      width={300}
                      height={300}
                      className="rounded-lg max-h-64 object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveImage()
                      }}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  Pastikan gambar menunjukkan bagian tanaman yang terserang penyakit dengan jelas untuk hasil diagnosis
                  yang akurat.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleDiagnose}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={diagnosing || !image}
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
