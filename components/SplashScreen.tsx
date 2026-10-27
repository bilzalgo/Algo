'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onFinish?: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 8-second splash duration
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between py-14 px-6 bg-neutral-50 text-neutral-900 select-none overflow-hidden"
        >
          {/* Soft amber ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Spacer for vertical balance */}
          <div className="w-full h-8" />

          {/* Center: ONLY App Logo and App Name */}
          <motion.div 
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center relative z-10"
          >
            {/* Mascot App Logo */}
            <motion.div 
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-amber-400/20 border border-amber-300/60 p-3 shadow-xl shadow-amber-400/20 flex items-center justify-center overflow-hidden mb-5 backdrop-blur-xs"
            >
              <Image
                src="/assets/aistudio/6819650_af089a78.png"
                alt="G-squad Logo"
                width={120}
                height={120}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                priority
              />
            </motion.div>

            {/* ONLY App Name */}
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
              G-<span className="text-amber-500">squad</span>
            </h1>
          </motion.div>

          {/* Footer Bottom: Small progress bar loading left and right */}
          <div className="w-full flex flex-col items-center justify-center z-10">
            <div className="w-40 sm:w-48 h-1.5 bg-neutral-200 border border-neutral-300/80 rounded-full overflow-hidden relative shadow-inner">
              <motion.div
                className="h-full w-14 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                animate={{
                  x: ['-10%', '240%', '-10%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.0,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
