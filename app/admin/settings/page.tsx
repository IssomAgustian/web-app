"use client"

import { useState } from "react"
import { Save, RotateCcw } from "lucide-react"

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    // Forward Chaining Settings
    fcThreshold: 0.6,
    fcConfidenceWeight: 0.8,

    // Certainty Factor Settings
    cfThreshold: 0.5,
    cfLevels: {
      notPresent: 0.2,
      maybe: 0.4,
      likely: 0.6,
      almostCertain: 0.8,
      certain: 1.0,
    },

    // General Settings
    appName: "Pakar Padi",
    appVersion: "1.0.0",
    maxUploadSize: 10,
    enableNotifications: true,
    maintenanceMode: false,
  })

  const handleSave = () => {
    alert("Pengaturan berhasil disimpan!")
  }

  const handleReset = () => {
    alert("Pengaturan direset ke default!")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Pengaturan Sistem</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forward Chaining Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Forward Chaining</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Threshold ({settings.fcThreshold})</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.fcThreshold}
                onChange={(e) => setSettings({ ...settings, fcThreshold: Number.parseFloat(e.target.value) })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Nilai minimum untuk mencocokkan aturan</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confidence Weight ({settings.fcConfidenceWeight})
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.fcConfidenceWeight}
                onChange={(e) => setSettings({ ...settings, fcConfidenceWeight: Number.parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Certainty Factor Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Certainty Factor</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Threshold ({settings.cfThreshold})</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.cfThreshold}
                onChange={(e) => setSettings({ ...settings, cfThreshold: Number.parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-700 mb-2">Skala Keyakinan:</p>
              <div className="space-y-1 text-gray-600">
                <p>Tidak ada: 0 - {settings.cfLevels.notPresent}</p>
                <p>
                  Mungkin: {settings.cfLevels.notPresent} - {settings.cfLevels.maybe}
                </p>
                <p>
                  Kemungkinan Besar: {settings.cfLevels.maybe} - {settings.cfLevels.likely}
                </p>
                <p>
                  Hampir Pasti: {settings.cfLevels.likely} - {settings.cfLevels.almostCertain}
                </p>
                <p>
                  Pasti: {settings.cfLevels.almostCertain} - {settings.cfLevels.certain}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Pengaturan Umum</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Aplikasi</label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Versi Aplikasi</label>
              <input
                type="text"
                value={settings.appVersion}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran Upload Maksimal (MB)</label>
              <input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => setSettings({ ...settings, maxUploadSize: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">Aktifkan Notifikasi</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">Mode Maintenance</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Save size={18} /> Simpan Pengaturan
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
        >
          <RotateCcw size={18} /> Reset ke Default
        </button>
      </div>
    </div>
  )
}
