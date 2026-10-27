'use client';

import React from 'react';
import { useTrading } from '@/context/TradingContext';
import { Home, Sliders, User, CreditCard } from 'lucide-react';

export function BottomNav() {
  const { activeTab, setActiveTab, openPaymentModal } = useTrading();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none flex justify-center pb-safe">
      <div className="w-full max-w-[440px] pointer-events-auto bg-white/95 backdrop-blur-md border-t border-neutral-200/80 px-[12px] py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <nav className="flex items-center justify-around relative">
          
          {/* 1. Home Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-600 font-medium'
            }`}
          >
            <div className="relative">
              <div
                className={`p-1 rounded-lg transition-colors ${
                  activeTab === 'home' ? 'bg-amber-100/70 text-amber-600' : ''
                }`}
              >
                <Home className="w-5 h-5" strokeWidth={activeTab === 'home' ? 2.5 : 2} />
              </div>
              {activeTab === 'home' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
          </button>

          {/* Payment Button (Deposit & Withdraw) with Signature Yellow Accent */}
          <div className="relative -top-2 flex flex-col items-center">
            <button
              type="button"
              onClick={() => openPaymentModal('deposit')}
              className="w-12 h-12 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-neutral-950 flex items-center justify-center shadow-md shadow-amber-400/40 border-2 border-white transition-all cursor-pointer group"
              title="Deposit & Withdraw Payment"
            >
              <CreditCard className="w-5 h-5 stroke-[2.5] group-hover:scale-105 transition-transform" />
            </button>
            <span className="text-[9px] font-bold text-neutral-800 tracking-tight mt-0.5">
              Payment
            </span>
          </div>

          {/* 2. Configure Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('configure')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'configure'
                ? 'text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-600 font-medium'
            }`}
          >
            <div className="relative">
              <div
                className={`p-1 rounded-lg transition-colors ${
                  activeTab === 'configure' ? 'bg-amber-100/70 text-amber-600' : ''
                }`}
              >
                <Sliders className="w-5 h-5" strokeWidth={activeTab === 'configure' ? 2.5 : 2} />
              </div>
              {activeTab === 'configure' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Configure</span>
          </button>

          {/* 3. Profile Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-600 font-medium'
            }`}
          >
            <div className="relative">
              <div
                className={`p-1 rounded-lg transition-colors ${
                  activeTab === 'profile' ? 'bg-amber-100/70 text-amber-600' : ''
                }`}
              >
                <User className="w-5 h-5" strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
              </div>
              {activeTab === 'profile' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Profile</span>
          </button>

        </nav>
      </div>
    </div>
  );
}
