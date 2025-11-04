'use client';

import { useRouter } from 'next/navigation';
import { Orbitron, Space_Grotesk } from 'next/font/google';
import DecryptedText from '@/components/DecryptedText';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['700', '900'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500'],
});

export default function Home() {
  const router = useRouter();

  return (
    <main className="w-full min-h-screen relative flex flex-col">
      
      <div className="absolute inset-0 flex items-center justify-center z-20" style={{ marginTop: '-8rem' }}>
        <div className="flex flex-col items-center gap-6">
          <h1 className={`text-6xl md:text-8xl font-black text-white ${orbitron.className}`} 
              style={{ 
                textShadow: '0 0 30px rgba(99, 102, 241, 0.5), 0 0 60px rgba(99, 102, 241, 0.3), 0 4px 12px rgba(0,0,0,0.4)',
                letterSpacing: '0.1em'
              }}>
            <DecryptedText
              text="POLYGATE"
              animateOn="view"
              revealDirection="center"
              speed={50}
              maxIterations={15}
            />
          </h1>
          <p className={`text-xl md:text-2xl text-black ${spaceGrotesk.className}`}
             style={{ 
               textShadow: '0 0 20px rgba(99, 102, 241, 0.3), 0 2px 8px rgba(0,0,0,0.3)',
               letterSpacing: '0.05em'
             }}>
            <DecryptedText
              text="Own your data. Earn your future."
              animateOn="view"
              revealDirection="start"
              speed={40}
              maxIterations={12}
            />
          </p>
          
          <button 
            onClick={() => router.push('/register')}
            className={`mt-4 px-8 py-3 text-base font-bold text-black bg-gray-300 rounded-lg 
                       transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] 
                       border border-gray-400 hover:border-gray-500 active:scale-95 hover:bg-gray-400 ${orbitron.className}`}
            style={{
              letterSpacing: '0.1em',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.4), 0 4px 12px rgba(177, 169, 169, 0.3)',
            }}
          >
            START
          </button>
        </div>
      </div>

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
