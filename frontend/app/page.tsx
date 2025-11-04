'use client';

import { Luckiest_Guy } from 'next/font/google';

const luckiestGuy = Luckiest_Guy({
  subsets: ['latin'],
  weight: '400',
});

export default function Home() {
  return (
    <main className="w-full min-h-screen relative flex flex-col">
      

      <div className="w-full">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-auto"
        >
          <source src="/landing/landing1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </main>
  );
}
