'use client';

import { useState } from 'react';
import Sidebar from '@/components/SideBar';
import ChatArea from '@/components/ChatArea';

export default function ChatbotPage() {
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <ChatArea selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
    </div>
  );
}
