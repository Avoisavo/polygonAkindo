'use client'

import { useState, useEffect } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function ConnectWallet() {
  const [mounted, setMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const { signMessage, isPending: isSigning, data: signature, error: signError } = useSignMessage()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignMessage = () => {
    if (!address) return
    const message = `Welcome to Counter DApp!\n\nSign this message to verify your wallet.\n\nWallet: ${address}\nTimestamp: ${new Date().toISOString()}`
    signMessage({ message })
  }

  // Prevent hydration mismatch by not rendering wallet-dependent UI until mounted
  if (!mounted) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-40 bg-gray-300 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (isConnected && address) {
    return (
      <div className="flex flex-col gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <ConnectButton />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSignMessage}
              disabled={isSigning}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-lg transition-colors text-sm font-medium disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSigning ? 'Signing...' : 'Sign Message'}
            </button>
          </div>
        </div>

        {signature && (
          <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">
              ✓ Message signed successfully!
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all">
              {signature}
            </p>
          </div>
        )}

        {signError && (
          <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-600 dark:text-red-400 font-semibold mb-1">
              Signing Error:
            </p>
            <p className="text-xs text-red-600 dark:text-red-400">
              {signError.message}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <ConnectButton />
    </div>
  )
}

