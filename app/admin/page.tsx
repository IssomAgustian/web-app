"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, Activity, Zap, TrendingUp } from "lucide-react"

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
)

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalDiagnosis: 3840,
    activeDiseases: 12,
    systemUptime: "99.8%",
  })

  const [diagnosisData] = useState([
    { month: "Jan", symptoms: 120, image: 85 },
    { month: "Feb", symptoms: 150, image: 110 },
    { month: "Mar", symptoms: 180, image: 140 },
    { month: "Apr", symptoms: 200, image: 160 },
    { month: "May", symptoms: 220, image: 180 },
    { month: "Jun", symptoms: 250, image: 200 },
  ])

  const [diseaseData] = useState([
    { name: "Blast", value: 35 },
    { name: "Brown Spot", value: 25 },
    { name: "Leaf Smut", value: 20 },
    { name: "Sheath Blight", value: 15 },
    { name: "Others", value: 5 },
  ])

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Pengguna" value={stats.totalUsers} color="bg-blue-500" />
        <StatCard icon={Activity} label="Total Diagnosa" value={stats.totalDiagnosis} color="bg-green-500" />
        <StatCard icon={Zap} label="Penyakit Aktif" value={stats.activeDiseases} color="bg-yellow-500" />
        <StatCard icon={TrendingUp} label="Uptime Sistem" value={stats.systemUptime} color="bg-purple-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Diagnosis Trend */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Tren Diagnosa (6 Bulan)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={diagnosisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="symptoms" stroke="#10b981" name="Diagnosa Gejala" />
              <Line type="monotone" dataKey="image" stroke="#3b82f6" name="Diagnosa Gambar" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Disease Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Distribusi Penyakit</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={diseaseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {diseaseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Aktivitas Terbaru</h3>
        <div className="space-y-3">
          {[
            { user: "Budi Santoso", action: "Diagnosa Gejala", time: "2 jam lalu" },
            { user: "Siti Nurhaliza", action: "Upload Gambar", time: "3 jam lalu" },
            { user: "Admin", action: "Update Aturan", time: "5 jam lalu" },
            { user: "Rini Wijaya", action: "Diagnosa Gambar", time: "1 hari lalu" },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div>
                <p className="font-medium text-gray-800">{activity.user}</p>
                <p className="text-sm text-gray-600">{activity.action}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
