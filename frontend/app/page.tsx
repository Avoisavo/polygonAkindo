'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SplineScene = dynamic(() => import('./SplineScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-lg">Loading scene...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="w-full h-screen relative">
      <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}>
        <SplineScene />
      </Suspense>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <button
          className="pointer-events-auto px-8 py-4 text-2xl font-bold text-white border border-white bg-black rounded-lg
                     transform transition-all duration-200 hover:scale-105 active:scale-95
                     shadow-[0_4px_0_rgba(255,255,255,0.3),0_8px_0_rgba(255,255,255,0.2),0_12px_0_rgba(255,255,255,0.1)]
                     hover:shadow-[0_6px_0_rgba(255,255,255,0.4),0_10px_0_rgba(255,255,255,0.3),0_14px_0_rgba(255,255,255,0.2)]
                     hover:bg-opacity-90"
          style={{
            textShadow: '0 0 10px rgba(255,255,255,0.5)',
          }}
        >
          Start
        </button>
      </div>
    </main>
  );
}
