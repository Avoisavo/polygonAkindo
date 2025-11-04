"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { ShineBorder } from "@/registry/magicui/shine-border"
import { validateRegistration, prepareRegisterSite } from "@/lib/register"

export function RegistrationForm() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [formData, setFormData] = useState({
    websiteUrl: "",
    siteName: "",
    pricePerAccess: "",
  })
  const [error, setError] = useState<string | null>(null)

  // Smart contract hooks
  const { writeContract: registerSite, data: txHash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
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
    setError(null)

    // Check if wallet is connected
    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    // Validate input
    const validationError = validateRegistration(formData.websiteUrl, formData.pricePerAccess)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      // Prepare contract call
      const contractData = prepareRegisterSite(formData.websiteUrl, formData.pricePerAccess)
      
      // Call smart contract
      await registerSite(contractData)
      
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || 'Registration failed')
    }
  }

  // Redirect to dashboard on success
  if (isSuccess) {
    setTimeout(() => {
      router.push('/contract')
    }, 2000)
  }

  return (
    <div className="relative p-8 border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden">
      <ShineBorder
        borderWidth={2}
        duration={10}
        shineColor={["#3b82f6", "#8b5cf6", "#ec4899"]}
      />
      
      {/* Connection Status */}
      {!isConnected && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Please connect your wallet to register a website
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {isSuccess && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-semibold">✅ Website registered successfully!</p>
          {txHash && (
            <p className="text-xs text-gray-600 mt-1 font-mono">TX: {txHash}</p>
          )}
          <p className="text-sm text-green-700 mt-2">Redirecting to dashboard...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
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
          disabled={!isConnected || isPending || isConfirming || isSuccess}
          className="w-full px-4 py-3 text-white bg-black rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isPending || isConfirming ? "Registering..." : isSuccess ? "Registered!" : "Register Website"}
        </button>
      </form>
    </div>
  )
}

