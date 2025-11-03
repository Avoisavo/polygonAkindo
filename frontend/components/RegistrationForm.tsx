"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function RegistrationForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    websiteUrl: "",
    siteName: "",
    pricePerAccess: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const websites = JSON.parse(localStorage.getItem("websites") || "[]")
      const newWebsite = {
        id: Date.now(),
        ...formData,
        pricePerAccess: Number.parseFloat(formData.pricePerAccess),
        createdAt: new Date().toISOString(),
        totalEarnings: 0,
        totalAccesses: 0,
      }
      websites.push(newWebsite)
      localStorage.setItem("websites", JSON.stringify(websites))

      router.push("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 border border-gray-300 rounded-lg bg-white shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="siteName" className="block text-sm font-medium">
            Website Name
          </label>
          <input
            id="siteName"
            name="siteName"
            type="text"
            placeholder="My Awesome Blog"
            value={formData.siteName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-600">The name of your website</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="websiteUrl" className="block text-sm font-medium">
            Website URL
          </label>
          <input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            placeholder="https://example.com"
            value={formData.websiteUrl}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-600">Include https:// in your URL</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="pricePerAccess" className="block text-sm font-medium">
            Price Per AI Crawler Access
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-700">$</span>
            <input
              id="pricePerAccess"
              name="pricePerAccess"
              type="number"
              placeholder="0.01"
              step="0.01"
              min="0.01"
              value={formData.pricePerAccess}
              onChange={handleChange}
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-sm text-gray-600">Minimum $0.01 per access</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold mb-2">How it works:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• AI crawlers are detected when accessing your website</li>
            <li>• They are shown a paywall with your set price</li>
            <li>• You earn the specified amount per successful payment</li>
            <li>• View earnings and statistics in your dashboard</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? "Registering..." : "Register Website"}
        </button>
      </form>
    </div>
  )
}

