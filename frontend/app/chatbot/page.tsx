'use client';

import { useState } from 'react';
import { sendMessageToAgent } from '@/lib/api';
import { useAccount, useWalletClient } from 'wagmi';
import { parseEther, getAddress } from 'viem';
import { Brain } from 'lucide-react';
import Sidebar from '@/components/SideBar';
import ChatArea from '@/components/ChatArea';
import TextType from '@/components/TextType';

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

interface PaymentInfo {
  paid: boolean;
  amount: string;
  txHash: string;
  explorerLink?: string;
  agentWallet: string;
}

export default function ChatbotPage() {
  const [selectedModel, setSelectedModel] = useState('ChatGPT-4o');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent'; content: string; paymentRequest?: PaymentRequest; paymentInfo?: PaymentInfo }>>([]);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  // Helper function to convert transaction hashes and URLs to clickable links
  function renderMessageWithTxLinks(content: string) {
    // Combined regex to match URLs and transaction hashes
    const combinedRegex = /(https?:\/\/[^\s]+)|(0x[a-fA-F0-9]{64})/g;
    
    const parts = content.split(combinedRegex).filter(Boolean);
    
    return parts.map((part, index) => {
      // Check if it's a URL
      if (part && part.match(/^https?:\/\//)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300 break-all"
          >
            {part}
          </a>
        );
      }
      // Check if it's a transaction hash
      if (part && part.match(/^0x[a-fA-F0-9]{64}$/)) {
        return (
          <a
            key={index}
            href={`https://amoy.polygonscan.com/tx/${part}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300 break-all"
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  }

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
      
      // Check if response contains payment info from agent auto-pay
      if (typeof agentResponse === 'object' && agentResponse.paymentMade) {
        setMessages((prev) => [...prev, { 
          role: 'agent', 
          content: agentResponse.agentResponse as string,
          paymentInfo: agentResponse.payment as PaymentInfo
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
        content: '⚠️ Wallet Not Connected\n\n━━━━━━━━━━━━━━━━━━━━\n\n💡 To proceed with payment:\n• Click "Connect Wallet" in the header\n• Select your wallet provider\n• Approve the connection\n\n━━━━━━━━━━━━━━━━━━━━' 
      }]);
      return;
    }

    setProcessingPayment(paymentReq.payment.id);
    
    try {
      setMessages((prev) => [...prev, { 
        role: 'agent', 
        content: `💳 Payment Initiated\n\n━━━━━━━━━━━━━━━━━━━━\n\n💰 Amount: ${paymentReq.payment.price}\n\n⏳ Please confirm the transaction in your wallet...\n\n━━━━━━━━━━━━━━━━━━━━` 
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
        content: `✅ Payment Successful!\n\n━━━━━━━━━━━━━━━━━━━━\n\n📋 Transaction Details:\n${txHash}\n\n🔗 View on Explorer:\nhttps://amoy.polygonscan.com/tx/${txHash}\n\n━━━━━━━━━━━━━━━━━━━━\n\n⏳ Retrieving content...` 
      }]);

      // Send payment completion to backend
      console.log('📤 Sending payment completion to backend:', {
        paymentId: paymentReq.payment.id,
        txHash: txHash,
        url: paymentReq.url
      });
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      console.log('🔗 API URL:', apiUrl);
      
      const response = await fetch(`${apiUrl}/payment/complete`, {
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

      console.log('📥 Response status:', response.status, response.statusText);
      const result = await response.json();
      console.log('📥 Result:', result);

      if (result.success && result.contentRetrieved && result.content) {
        // Display the retrieved content
        const contentMessage = `✅ Content Retrieved Successfully!\n\n` +
          `━━━━━━━━━━━━━━━━━━━━\n\n` +
          `📄 Title:\n${result.content.title}\n\n` +
          `📝 Content Preview:\n${result.content.preview}\n\n` +
          `🔗 Source:\n${result.content.url}\n\n` +
          `━━━━━━━━━━━━━━━━━━━━\n\n` +
          `💳 Payment Transaction:\n${txHash}\n\n` +
          `🔍 View on Explorer:\nhttps://amoy.polygonscan.com/tx/${txHash}`;
        
        setMessages((prev) => [...prev, { 
          role: 'agent', 
          content: contentMessage
        }]);
      } else if (result.success) {
        setMessages((prev) => [...prev, { 
          role: 'agent', 
          content: `✅ Payment Confirmed!\n\n━━━━━━━━━━━━━━━━━━━━\n\n📋 Transaction Details:\n${txHash}\n\n🔗 View on Explorer:\nhttps://amoy.polygonscan.com/tx/${txHash}\n\n━━━━━━━━━━━━━━━━━━━━\n\n⚠️ Content Retrieval Issue\n\nYour payment was successful, but we encountered an issue retrieving the content. Please try again or contact support.` 
        }]);
      }

    } catch (err: any) {
      console.error('❌ Payment failed:', err);
      setMessages((prev) => [...prev, { 
        role: 'agent', 
        content: `❌ Payment Failed\n\n━━━━━━━━━━━━━━━━━━━━\n\n⚠️ Error:\n${err.message || 'Unknown error occurred'}\n\n━━━━━━━━━━━━━━━━━━━━\n\n💡 What to do:\n• Check your wallet balance\n• Ensure you're on the correct network\n• Try again or contact support` 
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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between dark:bg-gray-900 dark:border-gray-800">
          <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-colors dark:hover:bg-gray-800">
            <div className="w-5 h-5 rounded flex items-center justify-center">
              <img
                src="/openai.png"
                alt="OpenAI"
                width={18}
                height={18}
                className="object-contain"
              />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedModel}</span>
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Chat
            </button>
          </div>
        </header>

        {/* Main Chat Area */}
        <main className="flex-1 overflow-y-auto px-6 py-12 flex flex-col">
          {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="max-w-2xl w-full text-center space-y-6">
              {/* Avatar with gradient blob */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-400 via-gray-600 to-black rounded-full blur-2xl opacity-60"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-700 via-gray-800 to-black rounded-full flex items-center justify-center">
                      <Brain className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Greeting */}
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                  Good Morning, Judha
                </h1>
                <h2 className="text-3xl font-semibold text-gray-900">
                  How Can I{' '}
                  <TextType
                    text={[
                      "Assist You Today?",
                      "Help You Today?", 
                      "Support You Today?",
                      "Serve You Today?"
                    ]}
                    as="span"
                    className="bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent"
                    typingSpeed={80}
                    deletingSpeed={50}
                    pauseDuration={2000}
                    loop={true}
                    showCursor={true}
                    cursorCharacter="|"
                    cursorClassName="text-gray-800"
                  />
                </h2>
              </div>
            </div>
          </div>
        ) : (
            <div className="max-w-3xl w-full mx-auto space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-gray-800 to-black text-white dark:from-gray-700 dark:to-gray-900'
                        : 'bg-white border border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
                    }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{renderMessageWithTxLinks(msg.content)}</p>
                  
                  {/* Payment Info - Agent Auto-Paid */}
                  {msg.paymentInfo && (
                    <div className="mt-3 space-y-2 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-800 dark:text-green-300">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Payment Made by Agent
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                          <span className="font-mono font-bold text-green-700 dark:text-green-300">{msg.paymentInfo.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Agent Wallet:</span>
                          <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                            {msg.paymentInfo.agentWallet.substring(0, 6)}...{msg.paymentInfo.agentWallet.substring(38)}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-600 dark:text-gray-400">Transaction:</span>
                          <a 
                            href={`https://amoy.polygonscan.com/tx/${msg.paymentInfo.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 break-all"
                          >
                            {msg.paymentInfo.txHash}
                          </a>
                        </div>
                      </div>
                      
                      <div className="pt-2 text-xs italic text-gray-600 dark:text-gray-400">
                        ✅ Payment verified by facilitator
                      </div>
                    </div>
                  )}
                  
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
                  <div className="max-w-[80%] rounded-2xl bg-white border border-gray-200 px-4 py-3 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-800 dark:bg-gray-400" style={{ animationDelay: '0ms' }}></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-800 dark:bg-gray-400" style={{ animationDelay: '150ms' }}></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-800 dark:bg-gray-400" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Input Area - Using ChatArea.tsx design */}
        <div className="px-6 pb-6">
          <div className="max-w-3xl mx-auto">
            {/* Input Box */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center px-4 py-3 border-b border-gray-100">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <input
                  type="text"
                  placeholder="Initiate a query or send a command to the AI..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  className="flex-1 px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none disabled:opacity-50"
                />
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Reasoning
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Create Image
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Deep Research
                  </button>
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!message.trim() || loading}
                  className="p-2 bg-gradient-to-r from-gray-800 to-black rounded-lg hover:from-gray-700 hover:to-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
