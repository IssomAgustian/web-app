"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function Reports() {
  const [reportType, setReportType] = useState("diseases")
  const [dateRange, setDateRange] = useState("month")

  const diseaseReportData = [
    { disease: "Blast", count: 245, percentage: 35 },
    { disease: "Brown Spot", count: 175, percentage: 25 },
    { disease: "Leaf Smut", count: 140, percentage: 20 },
    { disease: "Sheath Blight", count: 105, percentage: 15 },
    { disease: "Others", count: 35, percentage: 5 },
  ]

  const usageReportData = [
    { week: "Week 1", users: 120, diagnoses: 450 },
    { week: "Week 2", users: 145, diagnoses: 520 },
    { week: "Week 3", users: 165, diagnoses: 610 },
    { week: "Week 4", users: 180, diagnoses: 720 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Laporan</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <Download size={18} /> Export PDF
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Laporan</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="diseases">Penyakit Paling Sering</option>
            <option value="usage">Penggunaan Sistem</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
            <option value="year">Tahun Ini</option>
          </select>
        </div>
      </div>

      {/* Report Content */}
      {reportType === "diseases" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Penyakit Paling Sering Didiagnosa</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={diseaseReportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="disease" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Statistik</h2>
            <div className="space-y-3">
              {diseaseReportData.map((item) => (
                <div key={item.disease} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{item.disease}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Penggunaan Sistem</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usageReportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#3b82f6" name="Pengguna Aktif" />
              <Bar dataKey="diagnoses" fill="#10b981" name="Total Diagnosa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
