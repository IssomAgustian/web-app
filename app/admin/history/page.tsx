"use client"

import { useState } from "react"
import { Search, Eye, Trash2, Download } from "lucide-react"

export default function DiagnosisHistory() {
  const [histories, setHistories] = useState([
    { id: 1, user: "Budi Santoso", type: "Gejala", disease: "Blast", confidence: 0.85, date: "2024-03-15" },
    { id: 2, user: "Siti Nurhaliza", type: "Gambar", disease: "Brown Spot", confidence: 0.92, date: "2024-03-14" },
    { id: 3, user: "Rini Wijaya", type: "Gejala", disease: "Leaf Smut", confidence: 0.78, date: "2024-03-13" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filteredHistories = histories.filter(
    (h) =>
      (h.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.disease.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType === "all" || h.type === filterType),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Riwayat Diagnosa</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <Download size={18} /> Export
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari pengguna atau penyakit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">Semua Tipe</option>
          <option value="Gejala">Diagnosa Gejala</option>
          <option value="Gambar">Diagnosa Gambar</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Pengguna</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipe Diagnosa</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Penyakit</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Confidence</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tanggal</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistories.map((history) => (
              <tr key={history.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-800">{history.user}</td>
                <td className="px-6 py-3 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      history.type === "Gejala" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {history.type}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm font-medium text-gray-800">{history.disease}</td>
                <td className="px-6 py-3 text-sm text-gray-800">{(history.confidence * 100).toFixed(0)}%</td>
                <td className="px-6 py-3 text-sm text-gray-600">{history.date}</td>
                <td className="px-6 py-3 text-sm flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-100 rounded">
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
