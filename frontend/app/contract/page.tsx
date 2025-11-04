'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseUnits, formatUnits, keccak256, toBytes } from 'viem'
import ConnectWallet from './ConnectWallet'
import { x402polyABI } from '../../lib/x402polyABI'
import { erc20ABI } from '../../lib/erc20ABI'
import { X402POLY_CONTRACT, PAYMENT_TOKEN } from '../../lib/networkConfig'

export default function ContractPage() {
  const [mounted, setMounted] = useState(false)
  const { address, isConnected } = useAccount()
  
  // Register section state
  const [registerUrl, setRegisterUrl] = useState('')
  const [registerPrice, setRegisterPrice] = useState('')
  
  // Scrape section state
  const [scrapeUrl, setScrapeUrl] = useState('')
  
  // Update price section state
  const [updatePriceUrl, setUpdatePriceUrl] = useState('')
  const [updatePriceAmount, setUpdatePriceAmount] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Get payment token address from contract
  const { data: paymentTokenAddress } = useReadContract({
    address: X402POLY_CONTRACT,
    abi: x402polyABI,
    functionName: 'paymentToken',
  })

  // Helper function to convert URL to siteId (bytes32)
  const urlToSiteId = (url: string): `0x${string}` => {
    // Normalize URL (remove trailing slash, convert to lowercase)
    const normalizedUrl = url.trim().toLowerCase().replace(/\/$/, '')
    return keccak256(toBytes(normalizedUrl))
  }

  // Register site
  const { writeContract: registerSite, data: registerTxHash, isPending: isRegistering } = useWriteContract()
  const { isLoading: isRegisterConfirming, isSuccess: isRegisterSuccess } = useWaitForTransactionReceipt({
    hash: registerTxHash,
  })

  const handleRegister = async () => {
    if (!registerUrl || !registerPrice) {
      alert('Please enter both URL and price')
      return
    }

    const price = parseFloat(registerPrice)
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price > 0')
      return
    }

    // USDC uses 6 decimals
    const priceInWei = parseUnits(registerPrice, 6)
    const siteId = urlToSiteId(registerUrl)

    try {
      await registerSite({
        address: X402POLY_CONTRACT,
        abi: x402polyABI,
        functionName: 'registerSite',
        args: [siteId, priceInWei],
      })
    } catch (error: any) {
      console.error('Register error:', error)
      alert(`Registration failed: ${error.message || 'Unknown error'}`)
    }
  }

  // Get site info for scraping
  const scrapeSiteId = scrapeUrl ? urlToSiteId(scrapeUrl) : undefined
  const { data: siteInfo } = useReadContract({
    address: X402POLY_CONTRACT,
    abi: x402polyABI,
    functionName: 'sites',
    args: scrapeSiteId ? [scrapeSiteId] : undefined,
    query: {
      enabled: !!scrapeSiteId,
    },
  })

  // Check if user has access
  const { data: hasAccess } = useReadContract({
    address: X402POLY_CONTRACT,
    abi: x402polyABI,
    functionName: 'hasAccess',
    args: address && scrapeSiteId ? [address, scrapeSiteId] : undefined,
    query: {
      enabled: !!address && !!scrapeSiteId,
    },
  })

  // Check allowance
  const { data: allowance } = useReadContract({
    address: PAYMENT_TOKEN,
    abi: erc20ABI,
    functionName: 'allowance',
    args: address ? [address, X402POLY_CONTRACT] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Approve token
  const { writeContract: approveToken, data: approveTxHash, isPending: isApproving } = useWriteContract()
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  })

  // Buy access
  const { writeContract: buyAccess, data: buyTxHash, isPending: isBuying } = useWriteContract()
  const { isLoading: isBuyConfirming, isSuccess: isBuySuccess } = useWaitForTransactionReceipt({
    hash: buyTxHash,
  })

  const handleApprove = async () => {
    if (!scrapeSiteId || !siteInfo || !siteInfo[2]) {
      alert('Site not found')
      return
    }

    const price = siteInfo[0]

    try {
      await approveToken({
        address: PAYMENT_TOKEN,
        abi: erc20ABI,
        functionName: 'approve',
        args: [X402POLY_CONTRACT, price],
      })
    } catch (error: any) {
      console.error('Approve error:', error)
      alert(`Approval failed: ${error.message || 'Unknown error'}`)
    }
  }

  const handleBuyAccess = async () => {
    if (!scrapeSiteId || !siteInfo || !siteInfo[2]) {
      alert('Site not found')
      return
    }

    try {
      await buyAccess({
        address: X402POLY_CONTRACT,
        abi: x402polyABI,
        functionName: 'buyAccess',
        args: [scrapeSiteId],
      })
    } catch (error: any) {
      console.error('Buy access error:', error)
      alert(`Purchase failed: ${error.message || 'Unknown error'}`)
    }
  }

  // Update price
  const updatePriceSiteId = updatePriceUrl ? urlToSiteId(updatePriceUrl) : undefined
  const { data: updatePriceSiteInfo } = useReadContract({
    address: X402POLY_CONTRACT,
    abi: x402polyABI,
    functionName: 'sites',
    args: updatePriceSiteId ? [updatePriceSiteId] : undefined,
    query: {
      enabled: !!updatePriceSiteId,
    },
  })

  const { writeContract: updatePrice, data: updatePriceTxHash, isPending: isUpdatingPrice } = useWriteContract()
  const { isLoading: isUpdatePriceConfirming, isSuccess: isUpdatePriceSuccess } = useWaitForTransactionReceipt({
    hash: updatePriceTxHash,
  })

  const handleUpdatePrice = async () => {
    if (!updatePriceUrl || !updatePriceAmount) {
      alert('Please enter both URL and new price')
      return
    }

    const price = parseFloat(updatePriceAmount)
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price > 0')
      return
    }

    if (!updatePriceSiteInfo || !updatePriceSiteInfo[2]) {
      alert('Site not found')
      return
    }

    if (updatePriceSiteInfo[1].toLowerCase() !== address?.toLowerCase()) {
      alert('You are not the owner of this site')
      return
    }

    const priceInWei = parseUnits(updatePriceAmount, 6)
    const siteId = urlToSiteId(updatePriceUrl)

    try {
      await updatePrice({
        address: X402POLY_CONTRACT,
        abi: x402polyABI,
        functionName: 'updatePrice',
        args: [siteId, priceInWei],
      })
    } catch (error: any) {
      console.error('Update price error:', error)
      alert(`Update price failed: ${error.message || 'Unknown error'}`)
    }
  }

  // Withdraw section
  const { data: pendingWithdrawal } = useReadContract({
    address: X402POLY_CONTRACT,
    abi: x402polyABI,
    functionName: 'pendingWithdrawals',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const { writeContract: withdraw, data: withdrawTxHash, isPending: isWithdrawing } = useWriteContract()
  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawTxHash,
  })

  const handleWithdraw = async () => {
    if (!pendingWithdrawal || pendingWithdrawal === BigInt(0)) {
      alert('No funds available to withdraw')
      return
    }

    try {
      await withdraw({
        address: X402POLY_CONTRACT,
        abi: x402polyABI,
        functionName: 'withdraw',
      })
    } catch (error: any) {
      console.error('Withdraw error:', error)
      alert(`Withdrawal failed: ${error.message || 'Unknown error'}`)
    }
  }

  // Format price for display (USDC uses 6 decimals)
  const formatPrice = (price: bigint | undefined) => {
    if (!price) return '0'
    return formatUnits(price, 6)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            x402poly License Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Register your website or purchase access to scrape
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <ConnectWallet />
        </div>

        {isConnected && (
          <>
            {/* Register Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Register Your Website
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Register your website to license scraping access. Users will need to pay the price you set to scrape your site.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={registerUrl}
                    onChange={(e) => setRegisterUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price per Scrape (USDC)
                  </label>
                  <input
                    type="number"
                    value={registerPrice}
                    onChange={(e) => setRegisterPrice(e.target.value)}
                    placeholder="0.01"
                    step="0.000001"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleRegister}
                  disabled={isRegistering || isRegisterConfirming || !registerUrl || !registerPrice}
                  className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {isRegistering || isRegisterConfirming
                    ? 'Registering...'
                    : 'Register Site'}
                </button>

                {isRegisterSuccess && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-green-600 dark:text-green-400 font-semibold">
                      ✓ Site registered successfully!
                    </p>
                    {registerTxHash && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-mono">
                        TX: {registerTxHash}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Scrape Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Purchase Access to Scrape
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Enter a website URL to check if it's registered and purchase access to scrape it.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website URL to Scrape
                  </label>
                  <input
                    type="text"
                    value={scrapeUrl}
                    onChange={(e) => setScrapeUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {scrapeUrl && siteInfo && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {siteInfo[2] ? (
                      <>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Price:</span>{' '}
                            {formatPrice(siteInfo[0])} USDC
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Owner:</span>{' '}
                            {siteInfo[1]}
                          </p>
                          {hasAccess ? (
                            <p className="text-green-600 dark:text-green-400 font-semibold">
                              ✓ You have access to scrape this site
                            </p>
                          ) : (
                            <p className="text-yellow-600 dark:text-yellow-400 font-semibold">
                              ⚠ You need to purchase access
                            </p>
                          )}
                        </div>

                        {!hasAccess && (
                          <div className="mt-4 space-y-2">
                            {allowance && allowance < siteInfo[0] && (
                              <button
                                onClick={handleApprove}
                                disabled={isApproving || isApproveConfirming}
                                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                              >
                                {isApproving || isApproveConfirming
                                  ? 'Approving...'
                                  : 'Approve USDC'}
                              </button>
                            )}

                            {isApproveSuccess && (
                              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <p className="text-green-600 dark:text-green-400 text-sm font-semibold">
                                      ✓ Token approved!
                                    </p>
                              </div>
                            )}

                            {(!allowance || allowance >= siteInfo[0]) && (
                              <button
                                onClick={handleBuyAccess}
                                disabled={isBuying || isBuyConfirming || !allowance || allowance < siteInfo[0]}
                                className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                              >
                                {isBuying || isBuyConfirming
                                  ? 'Purchasing...'
                                  : `Purchase Access (${formatPrice(siteInfo[0])} USDC)`}
                              </button>
                            )}

                            {isBuySuccess && (
                              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <p className="text-green-600 dark:text-green-400 text-sm font-semibold">
                                  ✓ Access purchased successfully!
                                </p>
                                {buyTxHash && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-mono">
                                    TX: {buyTxHash}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-red-600 dark:text-red-400 font-semibold">
                        Site not registered
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Update Price Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Update Site Price
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Update the price for your registered website. Only the site owner can update the price.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={updatePriceUrl}
                    onChange={(e) => setUpdatePriceUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {updatePriceUrl && updatePriceSiteInfo && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {updatePriceSiteInfo[2] ? (
                      <>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Current Price:</span>{' '}
                            {formatPrice(updatePriceSiteInfo[0])} USDC
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Owner:</span>{' '}
                            {updatePriceSiteInfo[1]}
                          </p>
                          {updatePriceSiteInfo[1].toLowerCase() === address?.toLowerCase() ? (
                            <p className="text-green-600 dark:text-green-400 font-semibold">
                              ✓ You own this site
                            </p>
                          ) : (
                            <p className="text-red-600 dark:text-red-400 font-semibold">
                              ✗ You are not the owner of this site
                            </p>
                          )}
                        </div>

                        {updatePriceSiteInfo[1].toLowerCase() === address?.toLowerCase() && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                New Price per Scrape (USDC)
                              </label>
                              <input
                                type="number"
                                value={updatePriceAmount}
                                onChange={(e) => setUpdatePriceAmount(e.target.value)}
                                placeholder="0.01"
                                step="0.000001"
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>

                            <button
                              onClick={handleUpdatePrice}
                              disabled={isUpdatingPrice || isUpdatePriceConfirming || !updatePriceAmount}
                              className="w-full mt-4 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                            >
                              {isUpdatingPrice || isUpdatePriceConfirming
                                ? 'Updating...'
                                : 'Update Price'}
                            </button>

                            {isUpdatePriceSuccess && (
                              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <p className="text-green-600 dark:text-green-400 text-sm font-semibold">
                                  ✓ Price updated successfully!
                                </p>
                                {updatePriceTxHash && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-mono">
                                    TX: {updatePriceTxHash}
                                  </p>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <p className="text-red-600 dark:text-red-400 font-semibold">
                        Site not registered
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Withdraw Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Withdraw Earnings
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Withdraw your accumulated earnings from users purchasing access to your registered sites.
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="font-semibold">Pending Withdrawal:</span>
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(pendingWithdrawal)} USDC
                  </p>
                </div>

                <button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing || isWithdrawConfirming || !pendingWithdrawal || pendingWithdrawal === BigInt(0)}
                  className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {isWithdrawing || isWithdrawConfirming
                    ? 'Withdrawing...'
                    : 'Withdraw Earnings'}
                </button>

                {isWithdrawSuccess && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-green-600 dark:text-green-400 font-semibold">
                      ✓ Withdrawal successful!
                    </p>
                    {withdrawTxHash && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-mono">
                        TX: {withdrawTxHash}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

