'use client';

import React from 'react';
import { useTrading } from '@/context/TradingContext';
import { AuthView } from '@/components/AuthView';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { HomeView } from '@/components/HomeView';
import { ConfigureView } from '@/components/ConfigureView';
import { ProfileView } from '@/components/ProfileView';
import { PaymentModal } from '@/components/PaymentModal';

export function TradingDashboard() {
  const { isAuthenticated, activeTab, toastMessage } = useTrading();

  // If user is not logged in, show the Auth login/register view
  if (!isAuthenticated) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-start text-neutral-900 selection:bg-amber-300">
      {/* Main Mobile App Frame */}
      <div className="w-full flex justify-center py-0 sm:py-3 px-0 sm:px-3">
        <div className="w-full max-w-[440px] bg-neutral-50 min-h-screen sm:min-h-[850px] flex flex-col sm:rounded-3xl sm:shadow-2xl sm:border sm:border-neutral-200/90 sm:overflow-hidden relative">
          
          {/* Simulated Mobile Status Bar */}
          <div className="bg-neutral-900 text-white text-[10px] px-[12px] py-2 flex items-center justify-between font-mono select-none hidden sm:flex">
            <span className="font-semibold tracking-wider">09:41</span>
            <div className="w-20 h-3.5 bg-neutral-800 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 opacity-90">
              <span className="text-[9px]">5G</span>
              <div className="w-3.5 h-2 border border-white rounded-[2px] p-[1px]">
                <div className="w-full h-full bg-amber-400 rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* App Header with 12px Padding */}
          <Header />

          {/* Tab Content Body with 12px Left and Right Padding */}
          <main className="flex-1 px-[12px] pt-3 overflow-y-auto">
            {activeTab === 'home' && <HomeView />}
            {activeTab === 'configure' && <ConfigureView />}
            {activeTab === 'profile' && <ProfileView />}
          </main>

          {/* Bottom Navigation with Payment Button */}
          <BottomNav />

          {/* Deposit & Withdraw Payment Modal */}
          <PaymentModal />

          {/* Global Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none max-w-xs w-full px-[12px] animate-in fade-in slide-from-bottom-4 duration-200">
              <div className="bg-neutral-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-neutral-700/60">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                <span className="flex-1">{toastMessage}</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
