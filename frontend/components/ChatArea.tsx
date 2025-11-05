import { useState } from 'react';
import { Plus, ChevronDown, Paperclip, Zap, Brain, Image, Search, Send } from 'lucide-react';
import { sendMessageToAgent } from '@/lib/api';
import NextImage from 'next/image';
import TextType from './TextType';

interface ChatAreaProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

interface Message {
  role: 'user' | 'agent';
  content: string;
}

const ChatArea = ({ selectedModel, setSelectedModel }: ChatAreaProps) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const quickActions = [
    { icon: Zap, label: 'Reasoning' },
    { icon: Image, label: 'Create Image' },
    { icon: Search, label: 'Deep Research' },
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
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
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="w-5 h-5 rounded flex items-center justify-center">
            <NextImage
              src="/openai.png"
              alt="OpenAI"
              width={18}
              height={18}
              className="object-contain"
            />
          </div>
          <span className="text-sm font-medium text-gray-900">{selectedModel}</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4" />
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
                      ? 'bg-gradient-to-r from-gray-800 to-black text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl bg-white border border-gray-200 px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-800" style={{ animationDelay: '0ms' }}></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-800" style={{ animationDelay: '150ms' }}></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-800" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className="px-6 pb-6">
        <div className="max-w-3xl mx-auto">
          {/* Input Box */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <Zap className="w-4 h-4 text-indigo-600" />
              <input
                type="text"
                placeholder="Initiate a query or send a command to the AI..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="flex-1 px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <Paperclip className="w-4 h-4 text-gray-500" />
                </button>
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <action.icon className="w-3.5 h-3.5" />
                    {action.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || loading}
                className="p-2 bg-gradient-to-r from-gray-800 to-black rounded-lg hover:from-gray-700 hover:to-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
