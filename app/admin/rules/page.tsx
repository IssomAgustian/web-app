"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Search, Play } from "lucide-react"

export default function RulesManagement() {
  const [rules, setRules] = useState([
    { id: 1, disease: "Blast", symptoms: ["Bercak Diamond", "Daun Menguning"], confidence: 0.85 },
    { id: 2, disease: "Brown Spot", symptoms: ["Bercak Coklat", "Daun Layu"], confidence: 0.75 },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ disease: "", symptoms: [], confidence: 0.5 })

  const handleAdd = () => {
    if (editingId) {
      setRules(rules.map((r) => (r.id === editingId ? { ...r, ...formData } : r)))
      setEditingId(null)
    } else {
      setRules([...rules, { id: Date.now(), ...formData }])
    }
    setFormData({ disease: "", symptoms: [], confidence: 0.5 })
    setShowForm(false)
  }

  const handleEdit = (rule) => {
    setFormData(rule)
    setEditingId(rule.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setRules(rules.filter((r) => r.id !== id))
  }

  const filteredRules = rules.filter((r) => r.disease.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Aturan (Forward Chaining)</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFormData({ disease: "", symptoms: [], confidence: 0.5 })
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus size={18} /> Tambah Aturan
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Cari aturan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Aturan" : "Tambah Aturan Baru"}</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nama Penyakit"
                value={formData.disease}
                onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                placeholder="Confidence Level (0-1)"
                min="0"
                max="1"
                step="0.1"
                value={formData.confidence}
                onChange={(e) => setFormData({ ...formData, confidence: Number.parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Penyakit</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Gejala</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Confidence</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredRules.map((rule) => (
              <tr key={rule.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-800">{rule.disease}</td>
                <td className="px-6 py-3 text-sm text-gray-600">{rule.symptoms.join(", ")}</td>
                <td className="px-6 py-3 text-sm text-gray-800">{(rule.confidence * 100).toFixed(0)}%</td>
                <td className="px-6 py-3 text-sm flex gap-2">
                  <button className="p-2 text-green-600 hover:bg-green-100 rounded" title="Test Rule">
                    <Play size={16} />
                  </button>
                  <button onClick={() => handleEdit(rule)} className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(rule.id)} className="p-2 text-red-600 hover:bg-red-100 rounded">
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
