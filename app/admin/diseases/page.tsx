"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Search } from "lucide-react"

export default function DiseasesManagement() {
  const [diseases, setDiseases] = useState([
    {
      id: 1,
      name: "Blast",
      description: "Penyakit blast pada padi",
      prevention: "Gunakan varietas tahan",
      treatment: "Aplikasi fungisida",
    },
    {
      id: 2,
      name: "Brown Spot",
      description: "Bercak coklat pada daun",
      prevention: "Sanitasi lahan",
      treatment: "Fungisida sistemik",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: "", description: "", prevention: "", treatment: "" })

  const handleAdd = () => {
    if (editingId) {
      setDiseases(diseases.map((d) => (d.id === editingId ? { ...d, ...formData } : d)))
      setEditingId(null)
    } else {
      setDiseases([...diseases, { id: Date.now(), ...formData }])
    }
    setFormData({ name: "", description: "", prevention: "", treatment: "" })
    setShowForm(false)
  }

  const handleEdit = (disease) => {
    setFormData(disease)
    setEditingId(disease.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setDiseases(diseases.filter((d) => d.id !== id))
  }

  const filteredDiseases = diseases.filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Penyakit</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFormData({ name: "", description: "", prevention: "", treatment: "" })
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus size={18} /> Tambah Penyakit
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Cari penyakit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Penyakit" : "Tambah Penyakit Baru"}</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nama Penyakit"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                placeholder="Deskripsi"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-20"
              />
              <textarea
                placeholder="Metode Pencegahan"
                value={formData.prevention}
                onChange={(e) => setFormData({ ...formData, prevention: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-20"
              />
              <textarea
                placeholder="Penanganan"
                value={formData.treatment}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Simpan
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nama Penyakit</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Deskripsi</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredDiseases.map((disease) => (
              <tr key={disease.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-800">{disease.name}</td>
                <td className="px-6 py-3 text-sm text-gray-600">{disease.description}</td>
                <td className="px-6 py-3 text-sm flex gap-2">
                  <button onClick={() => handleEdit(disease)} className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(disease.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
