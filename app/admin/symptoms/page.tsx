"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Search, Download, Upload } from "lucide-react"

export default function SymptomsManagement() {
  const [symptoms, setSymptoms] = useState([
    { id: 1, code: "S001", name: "Bercak Coklat", description: "Bercak coklat pada daun" },
    { id: 2, code: "S002", name: "Daun Menguning", description: "Daun berubah warna kuning" },
    { id: 3, code: "S003", name: "Bercak Berbentuk Diamond", description: "Bercak dengan bentuk diamond" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ code: "", name: "", description: "" })

  const handleAdd = () => {
    if (editingId) {
      setSymptoms(symptoms.map((s) => (s.id === editingId ? { ...s, ...formData } : s)))
      setEditingId(null)
    } else {
      setSymptoms([...symptoms, { id: Date.now(), ...formData }])
    }
    setFormData({ code: "", name: "", description: "" })
    setShowForm(false)
  }

  const handleEdit = (symptom) => {
    setFormData(symptom)
    setEditingId(symptom.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setSymptoms(symptoms.filter((s) => s.id !== id))
  }

  const filteredSymptoms = symptoms.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Gejala</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Download size={18} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            <Upload size={18} /> Import
          </button>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingId(null)
              setFormData({ code: "", name: "", description: "" })
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus size={18} /> Tambah Gejala
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Cari gejala..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Gejala" : "Tambah Gejala Baru"}</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Kode Gejala"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Nama Gejala"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                placeholder="Deskripsi"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-24"
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Kode</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nama Gejala</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Deskripsi</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredSymptoms.map((symptom) => (
              <tr key={symptom.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-800">{symptom.code}</td>
                <td className="px-6 py-3 text-sm text-gray-800">{symptom.name}</td>
                <td className="px-6 py-3 text-sm text-gray-600">{symptom.description}</td>
                <td className="px-6 py-3 text-sm flex gap-2">
                  <button onClick={() => handleEdit(symptom)} className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(symptom.id)}
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
