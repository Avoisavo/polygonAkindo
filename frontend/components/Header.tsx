"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo / Brand */}
          <div className="flex-1 flex items-center justify-start">
            <Link href="/" className="text-xl font-bold text-gray-900">
              PolyGate
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/register" className="text-gray-700 hover:text-gray-900 transition-colors">
              Register Site
            </Link>
            <Link href="/chatbot" className="text-gray-700 hover:text-gray-900 transition-colors">
              Chatbot
            </Link>
            <Link href="/instruction" className="text-gray-700 hover:text-gray-900 transition-colors">
              Docs
            </Link>
          </nav>

          {/* Connect Wallet Button */}
          <div className="flex-1 flex items-center justify-end">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}

