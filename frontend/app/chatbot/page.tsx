'use client';

import { useState } from 'react';
import { sendMessageToAgent } from '@/lib/api';

export default function ChatbotPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent'; content: string }>>([]);
  const [loading, setLoading] = useState(false);

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
      setMessages((prev) => [...prev, { role: 'agent', content: agentResponse }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response';
      setMessages((prev) => [...prev, { role: 'agent', content: errorMessage }]);
    } finally {
      setLoading(false);
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
