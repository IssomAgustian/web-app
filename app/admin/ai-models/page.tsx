"use client"

import { useState } from "react"
import { Trash2, Upload, BarChart3 } from "lucide-react"

export default function AIModelsManagement() {
  const [models, setModels] = useState([
    { id: 1, name: "Rice Disease Detector v1.0", version: "1.0", accuracy: 0.92, classes: 4, uploadDate: "2024-01-15" },
    { id: 2, name: "Rice Disease Detector v2.0", version: "2.0", accuracy: 0.95, classes: 6, uploadDate: "2024-02-20" },
  ])

  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Model AI (Certainty Factor)</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Upload size={18} /> Upload Model Baru
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Upload Model AI Baru</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nama Model"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Versi"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="file"
                accept=".h5,.pkl,.pt"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Upload
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((model) => (
          <div key={model.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{model.name}</h3>
                <p className="text-sm text-gray-600">v{model.version}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                  <BarChart3 size={18} />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-100 rounded">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Akurasi:</span>
                <span className="font-semibold text-green-600">{(model.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jumlah Kelas:</span>
                <span className="font-semibold">{model.classes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tanggal Upload:</span>
                <span className="font-semibold">{model.uploadDate}</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Test Model
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
