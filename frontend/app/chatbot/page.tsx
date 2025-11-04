'use client';

import { useState } from 'react';
import { sendMessageToAgent } from '@/lib/api';
import { useAccount, useWalletClient } from 'wagmi';
import { parseEther, getAddress } from 'viem';

interface PaymentRequest {
  type: string;
  url: string;
  payment: {
    id: string;
    price: string;
    recipientAddress: string;
    network: string;
    description: string;
    facilitatorUrl?: string;
    nonce?: string;
  };
  message: string;
  instructions?: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
}

export default function ChatbotPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent'; content: string; paymentRequest?: PaymentRequest }>>([]);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const examplePrompts = [
    { icon: '📅', title: 'Plan your week with a smart daily schedule' },
    { icon: '📝', title: "Ask AI to prioritize today's top tasks" },
    { icon: '📄', title: 'Summarize this article in one paragraph' },
    { icon: '⏰', title: 'Set reminders for upcoming deadlines' },
  ];

  async function sendMessage() {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const agentResponse = await sendMessageToAgent(userMessage);
      
      // Check if response is a payment request
      if (typeof agentResponse === 'object' && agentResponse.paymentRequired) {
        const paymentRequest = agentResponse as unknown as PaymentRequest;
        setMessages((prev) => [...prev, { 
          role: 'agent', 
          content: paymentRequest.message,
          paymentRequest: paymentRequest
        }]);
      } else {
        setMessages((prev) => [...prev, { role: 'agent', content: agentResponse as string }]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response';
      setMessages((prev) => [...prev, { role: 'agent', content: errorMessage }]);
    } finally {
      setLoading(false);
    }
  }

  async function handlePayNow(paymentReq: PaymentRequest) {
    if (!isConnected || !address || !walletClient) {
      setMessages((prev) => [...prev, { 
        role: 'agent', 
        content: '⚠️ Please connect your wallet using the button in the header to proceed with payment.' 
      }]);
      return;
    }

    setProcessingPayment(paymentReq.payment.id);
    
    try {
      setMessages((prev) => [...prev, { 
        role: 'agent', 
        content: `💳 Initiating payment of ${paymentReq.payment.price}...\nPlease confirm the transaction in your wallet.` 
      }]);

      // Parse the price (remove $ and convert to ETH/MATIC)
      const priceStr = paymentReq.payment.price.replace('$', '');
      const priceValue = parseFloat(priceStr);
      
      // For demo: assume 1 MATIC = $1 USD (adjust in production)
      const amountInEther = priceValue.toString();

      // Send transaction (checksum the address first)
      const txHash = await walletClient.sendTransaction({
        account: address,
        to: getAddress(paymentReq.payment.recipientAddress),
        value: parseEther(amountInEther),
        chain: walletClient.chain,
      });

      console.log('✅ Payment transaction sent:', txHash);

      setMessages((prev) => [...prev, { 
        role: 'agent', 
        content: `✅ Payment successful!\n\nTransaction Hash: ${txHash}\n\nRetrying content retrieval...` 
      }]);

      // Send payment completion to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/payment/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: paymentReq.payment.id,
          txHash: txHash,
          url: paymentReq.url
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Retry the original scrape request
        const originalMessage = messages.find(m => m.paymentRequest?.payment.id === paymentReq.payment.id);
        if (originalMessage) {
          // Find the user message that triggered this
          const userMessageIndex = messages.findIndex(m => m === originalMessage) - 1;
          const userMsg = messages[userMessageIndex];
          if (userMsg && userMsg.role === 'user') {
            // Resend the message
            setLoading(true);
            try {
              const agentResponse = await sendMessageToAgent(userMsg.content);
              if (typeof agentResponse === 'string') {
                setMessages((prev) => [...prev, { role: 'agent', content: agentResponse }]);
              }
            } catch (error) {
              setMessages((prev) => [...prev, { 
                role: 'agent', 
                content: '❌ Failed to retrieve content after payment. Please try again.' 
              }]);
            } finally {
              setLoading(false);
            }
          }
        }
      }

    } catch (err: any) {
      console.error('❌ Payment failed:', err);
      setMessages((prev) => [...prev, { 
        role: 'agent', 
        content: `❌ Payment failed: ${err.message || 'Unknown error'}\n\nPlease try again or contact support.` 
      }]);
    } finally {
      setProcessingPayment(null);
    }
  }

  function handleExampleClick(prompt: string) {
    setMessage(prompt);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black">
      <div className="w-full max-w-3xl px-6 py-8">
        {messages.length === 0 ? (
          <>
            {/* Greeting Section */}
            <div className="mb-12 flex flex-col items-center text-center">
              <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white dark:bg-black">
                  <span className="text-5xl">🤖</span>
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-semibold text-black dark:text-white">
                Good Afternoon, Alex
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">What's on your mind?</p>
            </div>

            {/* Input Section */}
            <div className="mb-8">
              <div className="relative rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-3 flex items-center text-gray-400">
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-sm">Ask AI a question or make a request...</span>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder=""
                  className="w-full resize-none bg-transparent text-black outline-none dark:text-white"
                  rows={3}
                />
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      Attach
                    </button>
                    <button
                      type="button"
                      className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                    >
                      Writing Styles
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                    <button
                      onClick={sendMessage}
                      disabled={!message.trim() || loading}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Example Prompts */}
            <div>
              <p className="mb-4 text-center text-sm uppercase tracking-wide text-gray-500">
                Get started with an example below
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {examplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick(prompt.title)}
                    className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-2xl dark:bg-gray-800">
                      {prompt.icon}
                    </div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-black dark:text-gray-300 dark:group-hover:text-white">
                      {prompt.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Chat Messages */}
            <div className="mb-6 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'bg-gray-100 text-black dark:bg-gray-800 dark:text-white'
                    }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                  
                  {/* Inline Payment Request */}
                  {msg.paymentRequest && (
                    <div className="mt-3 space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                      <div className="text-xs font-semibold uppercase tracking-wide text-blue-800 dark:text-blue-300">
                        💳 Payment Required
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                          <span className="font-bold text-gray-900 dark:text-white">{msg.paymentRequest.payment.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Network:</span>
                          <span className="text-gray-900 dark:text-white">{msg.paymentRequest.payment.network}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Description:</span>
                          <span className="text-gray-900 dark:text-white">{msg.paymentRequest.payment.description}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePayNow(msg.paymentRequest!)}
                        disabled={processingPayment === msg.paymentRequest.payment.id}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {processingPayment === msg.paymentRequest.payment.id ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing Payment...
                          </span>
                        ) : (
                          `Pay ${msg.paymentRequest.payment.price} Now`
                        )}
                      </button>

                      {!isConnected && (
                        <p className="text-xs text-yellow-700 dark:text-yellow-400">
                          ⚠️ Connect your wallet in the header first
                        </p>
                      )}
                    </div>
                  )}
                </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }}></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }}></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Section (Sticky at bottom) */}
            <div className="sticky bottom-4">
              <div className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="w-full resize-none bg-transparent text-black outline-none dark:text-white"
                  rows={2}
                />
                <div className="mt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim() || loading}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
