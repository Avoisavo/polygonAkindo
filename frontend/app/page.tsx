'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Luckiest_Guy } from 'next/font/google';

const luckiestGuy = Luckiest_Guy({
  subsets: ['latin'],
  weight: '400',
});

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="w-full min-h-screen relative">
      <div className="absolute bottom-50 left-1/2 -translate-x-1/2 z-20">
        <h1 className={`text-6xl md:text-7xl font-bold text-gray-700 ${luckiestGuy.className}`} style={{ textShadow: '0 0 20px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)' }}>
          PolyGate
        </h1>
      </div>
      <div className="w-full h-screen scale-90">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading...</div>}>
          <Spline
            scene="/scene (6).splinecode" 
          />
        </Suspense>
      </div>
    </main>
  );
}
