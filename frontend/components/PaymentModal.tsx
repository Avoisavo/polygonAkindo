'use client';

import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { parseEther, formatEther } from 'viem';

interface PaymentDetails {
  id: string;
  price: string;
  recipientAddress: string;
  network: string;
  description: string;
  facilitatorUrl?: string;
  nonce?: string;
}

interface PaymentRequest {
  type: string;
  url: string;
  payment: PaymentDetails;
  message: string;
  instructions?: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
}

interface PaymentModalProps {
  paymentRequest: PaymentRequest;
  onPaymentComplete: (txHash: string) => void;
  onCancel: () => void;
}

export function PaymentModal({ paymentRequest, onPaymentComplete, onCancel }: PaymentModalProps) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!isConnected || !address || !walletClient) {
      setError('Please connect your wallet first');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      console.log('💳 Initiating payment:', paymentRequest.payment);

      // Parse the price (remove $ and convert to ETH/MATIC)
      const priceStr = paymentRequest.payment.price.replace('$', '');
      const priceValue = parseFloat(priceStr);
      
      // For demo: assume 1 MATIC = $1 USD (adjust in production)
      const amountInEther = priceValue.toString();

      // Send transaction
      const txHash = await walletClient.sendTransaction({
        account: address,
        to: paymentRequest.payment.recipientAddress as `0x${string}`,
        value: parseEther(amountInEther),
        chain: walletClient.chain,
      });

      console.log('✅ Payment transaction sent:', txHash);

      // Notify parent component
      onPaymentComplete(txHash);

    } catch (err: any) {
      console.error('❌ Payment failed:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-900">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payment Required
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {paymentRequest.message}
          </p>
        </div>

        {/* Payment Details */}
        <div className="mb-6 space-y-4 rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {paymentRequest.payment.price}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Network</span>
            <span className="text-sm text-gray-900 dark:text-white">
              {paymentRequest.payment.network}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Recipient</span>
            <span className="text-xs font-mono text-gray-900 dark:text-white">
              {paymentRequest.payment.recipientAddress.slice(0, 6)}...{paymentRequest.payment.recipientAddress.slice(-4)}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {paymentRequest.payment.description}
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              🔒 This payment will be processed via x402 protocol on {paymentRequest.payment.network}
            </p>
          </div>
        </div>

        {/* Instructions */}
        {paymentRequest.instructions && (
          <div className="mb-6 space-y-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              How it works
            </p>
            <ol className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>1. {paymentRequest.instructions.step1}</li>
              <li>2. {paymentRequest.instructions.step2}</li>
              <li>3. {paymentRequest.instructions.step3}</li>
              <li>4. {paymentRequest.instructions.step4}</li>
            </ol>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Wallet Status */}
        {!isConnected && (
          <div className="mb-4 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              ⚠️ Please connect your wallet using the button in the header to proceed with payment.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={!isConnected || processing}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Pay ${paymentRequest.payment.price}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

