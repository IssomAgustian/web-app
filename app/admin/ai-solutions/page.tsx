"use client"

import { useState } from "react"
import { Save, RotateCcw } from "lucide-react"

export default function AISolutionsManagement() {
  const [config, setConfig] = useState({
    apiKey: "***hidden***",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt:
      "Anda adalah ahli pertanian padi dengan spesialisasi penyakit tanaman padi. Berikan solusi yang praktis dan mudah dipahami.",
  })

  const [testResult, setTestResult] = useState("")
  const [testDisease, setTestDisease] = useState("Blast")

  const handleTest = () => {
    setTestResult(
      `Solusi untuk ${testDisease}:\n\n1. Identifikasi penyakit dengan benar\n2. Aplikasikan fungisida yang sesuai\n3. Lakukan monitoring rutin\n4. Terapkan praktik budidaya yang baik`,
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Manajemen Solusi AI</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Konfigurasi OpenAI</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input
                type="password"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <select
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>gpt-3.5-turbo</option>
                <option>gpt-4</option>
                <option>gpt-4-turbo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature ({config.temperature})</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: Number.parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
              <input
                type="number"
                value={config.maxTokens}
                onChange={(e) => setConfig({ ...config, maxTokens: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
              <textarea
                value={config.systemPrompt}
                onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-24"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Save size={18} /> Simpan
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
                <RotateCcw size={18} /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Testing */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Test Generasi Solusi</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Penyakit</label>
              <select
                value={testDisease}
                onChange={(e) => setTestDisease(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>Blast</option>
                <option>Brown Spot</option>
                <option>Leaf Smut</option>
                <option>Sheath Blight</option>
              </select>
            </div>
            <button
              onClick={handleTest}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Test Generasi
            </button>
            {testResult && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{testResult}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
