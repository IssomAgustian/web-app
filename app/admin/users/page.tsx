"use client"

import { useState } from "react"
import { Search, Lock, Trash2, Eye } from "lucide-react"

export default function UsersManagement() {
  const [users, setUsers] = useState([
    {
      id: 1,
      username: "budi_santoso",
      email: "budi@example.com",
      joinDate: "2024-01-10",
      status: "active",
      diagnoses: 15,
    },
    {
      id: 2,
      username: "siti_nurhaliza",
      email: "siti@example.com",
      joinDate: "2024-01-15",
      status: "active",
      diagnoses: 8,
    },
    {
      id: 3,
      username: "rini_wijaya",
      email: "rini@example.com",
      joinDate: "2024-02-01",
      status: "blocked",
      diagnoses: 3,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleBlock = (id) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u)))
  }

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Manajemen Pengguna</h1>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Cari pengguna..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Bergabung</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Diagnosa</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-800">{user.username}</td>
                <td className="px-6 py-3 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-3 text-sm text-gray-600">{user.joinDate}</td>
                <td className="px-6 py-3 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status === "active" ? "Aktif" : "Diblokir"}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-800">{user.diagnoses}</td>
                <td className="px-6 py-3 text-sm flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleBlock(user.id)}
                    className="p-2 text-yellow-600 hover:bg-yellow-100 rounded"
                  >
                    <Lock size={16} />
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="p-2 text-red-600 hover:bg-red-100 rounded">
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
