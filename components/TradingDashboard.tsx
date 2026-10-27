'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { useTrading } from '@/context/TradingContext';
import { SplashScreen } from '@/components/SplashScreen';
import { AuthView } from '@/components/AuthView';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { HomeView } from '@/components/HomeView';
import { ConfigureView } from '@/components/ConfigureView';
import { ProfileView } from '@/components/ProfileView';
import { PaymentModal } from '@/components/PaymentModal';
import { TransactionModal } from '@/components/TransactionModal';
import { AdvancedNotification } from '@/components/AdvancedNotification';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function TradingDashboard() {
  const { 
    isAuthenticated, 
    activeTab, 
    toastMessage, 
    setToastMessage,
    isAdminMode,
    setIsAdminMode
  } = useTrading();
  const [showSplash, setShowSplash] = useState(true);
  const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <>
      {/* 8-Second Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {!isMounted ? (
        <div className="min-h-screen bg-neutral-50" />
      ) : !isAuthenticated ? (
        <AuthView />
      ) : isAdminMode ? (
        /* Separate Dedicated Admin Dashboard Layout */
        <AdminDashboard onExit={() => setIsAdminMode(false)} />
      ) : (
        <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-start text-neutral-900 selection:bg-amber-300">
          {/* Main Mobile App Frame */}
          <div className="w-full flex justify-center py-0 sm:py-3 px-0 sm:px-3">
            <div className="w-full max-w-[440px] bg-neutral-50 min-h-screen sm:min-h-[850px] flex flex-col sm:rounded-3xl sm:shadow-2xl sm:border sm:border-neutral-200/90 sm:overflow-hidden relative">

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

          {/* Transaction History Bottom Drawer Modal */}
          <TransactionModal />

          {/* Advanced Top Popup Notification Alert */}
          <AdvancedNotification
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />

        </div>
      </div>
    </div>
      )}
    </>
  );
}
