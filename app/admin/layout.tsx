"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Leaf,
  Citrus as Virus,
  GitBranch,
  Brain,
  History,
  Users,
  Zap,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Leaf, label: "Manajemen Gejala", href: "/admin/symptoms" },
  { icon: Virus, label: "Manajemen Penyakit", href: "/admin/diseases" },
  { icon: GitBranch, label: "Manajemen Aturan", href: "/admin/rules" },
  { icon: Brain, label: "Model AI", href: "/admin/ai-models" },
  { icon: History, label: "Riwayat Diagnosa", href: "/admin/history" },
  { icon: Users, label: "Manajemen Pengguna", href: "/admin/users" },
  { icon: Zap, label: "Solusi AI", href: "/admin/ai-solutions" },
  { icon: BarChart3, label: "Laporan", href: "/admin/reports" },
  { icon: Settings, label: "Pengaturan Sistem", href: "/admin/settings" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-green-700 to-green-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-green-600 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Pakar Padi</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-green-600 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${
                  isActive ? "bg-green-600 text-white" : "text-green-100 hover:bg-green-600"
                }`}
                title={!sidebarOpen ? item.label : ""}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-green-600">
          <button className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">Admin User • {new Date().toLocaleDateString("id-ID")}</div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  )
}
