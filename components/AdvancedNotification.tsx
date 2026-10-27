'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BellRing, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Wallet, 
  TrendingUp, 
  Sparkles,
  Bot
} from 'lucide-react';

interface AdvancedNotificationProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export function AdvancedNotification({ message, onClose, duration = 4000 }: AdvancedNotificationProps) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  // Determine icon and badges based on message contents
  const lowerMsg = message.toLowerCase();
  let icon = <BellRing className="w-4 h-4 text-amber-400" />;
  let badgeText = 'LIVE ALERT';
  let badgeColor = 'bg-amber-400/20 text-amber-300 border-amber-400/30';
  let glowingBorder = 'border-amber-500/40 shadow-amber-500/20';

  if (lowerMsg.includes('bot') || lowerMsg.includes('trading')) {
    icon = <Bot className="w-4 h-4 text-emerald-400" />;
    badgeText = 'BOT EXECUTION';
    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    glowingBorder = 'border-emerald-500/40 shadow-emerald-500/20';
  } else if (lowerMsg.includes('profit') || lowerMsg.includes('win') || lowerMsg.includes('credited')) {
    icon = <TrendingUp className="w-4 h-4 text-emerald-400" />;
    badgeText = 'SUCCESSFUL EVENT';
    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    glowingBorder = 'border-emerald-500/40 shadow-emerald-500/20';
  } else if (lowerMsg.includes('deposit') || lowerMsg.includes('withdrawn') || lowerMsg.includes('balance') || lowerMsg.includes('usdt')) {
    icon = <Wallet className="w-4 h-4 text-amber-400" />;
    badgeText = 'WALLET TRANSACTION';
    badgeColor = 'bg-amber-400/20 text-amber-300 border-amber-400/30';
    glowingBorder = 'border-amber-500/40 shadow-amber-500/20';
  } else if (lowerMsg.includes('loss') || lowerMsg.includes('error') || lowerMsg.includes('limit')) {
    icon = <AlertTriangle className="w-4 h-4 text-rose-400" />;
    badgeText = 'RISK WARNING';
    badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    glowingBorder = 'border-rose-500/40 shadow-rose-500/20';
  } else if (lowerMsg.includes('copied') || lowerMsg.includes('saved')) {
    icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    badgeText = 'SYSTEM CONFIRM';
    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    glowingBorder = 'border-emerald-500/40 shadow-emerald-500/20';
  }

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Alert Notification"
        initial={{ y: -60, opacity: 0, scale: 0.94 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -40, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 26, stiffness: 400 }}
        className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-20px)] max-w-[420px] pointer-events-auto"
      >
        <div className={`relative overflow-hidden rounded-2xl bg-neutral-950/95 backdrop-blur-2xl text-white border shadow-2xl ${glowingBorder} p-3.5 group`}>
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Info Bar */}
          <div className="relative z-10 flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/80">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1">
                <span>G-SQUAD</span>
                <span className="text-neutral-600">•</span>
                <span className="text-amber-400 font-extrabold">{badgeText}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColor}`}>
                LIVE
              </span>
              <button
                type="button"
                onClick={onClose}
                className="w-5 h-5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="relative z-10 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 shadow-inner">
              {icon}
            </div>
            <div className="flex-1 pr-1">
              <p className="text-xs font-semibold text-neutral-100 leading-snug">
                {message}
              </p>
            </div>
          </div>

          {/* Countdown Drain Progress Bar at Bottom Edge */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-900 overflow-hidden">
            <motion.div 
              key={message}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300"
            />
          </div>

        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
