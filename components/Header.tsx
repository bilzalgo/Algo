'use client';

import React, { useState } from 'react';
import { useTrading } from '@/context/TradingContext';
import { 
  TrendingUp, 
  Bell, 
  X, 
  CheckCheck, 
  Wallet,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export function Header() {
  const { 
    user, 
    notifications, 
    markNotificationsAsRead, 
    openPaymentModal,
    setActiveTab 
  } = useTrading();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-[12px] py-2.5 transition-all">
        <div className="flex items-center justify-between w-full max-w-lg mx-auto">
          {/* Brand Logo & Live Market Badge */}
          <div className="flex items-center gap-2.5">
            <div 
              onClick={() => setActiveTab('home')}
              className="cursor-pointer flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center shadow-sm shadow-amber-400/30 group-hover:bg-amber-300 transition-colors">
                <TrendingUp className="w-4.5 h-4.5 stroke-[2.5]" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-neutral-900 tracking-tight text-sm">
                    Aura<span className="text-amber-500">Trade</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <div className="text-[10px] text-neutral-400 font-medium">
                  Trading Bot Pro
                </div>
              </div>
            </div>
          </div>

          {/* Right Header Actions: Quick Cash Badge, Notifications Bell, Avatar */}
          <div className="flex items-center gap-2">
            {/* Quick Balance Button to Payment */}
            <button
              type="button"
              onClick={() => openPaymentModal('deposit')}
              className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/70 text-neutral-900 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
              title="Deposit / Withdraw Funds"
            >
              <Wallet className="w-3.5 h-3.5 text-amber-600" />
              <span>${(user?.cashBalance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-400" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  if (unreadCount > 0) markNotificationsAsRead();
                }}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200/70 flex items-center justify-center text-neutral-700 transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-400 text-neutral-950 text-[9px] font-black flex items-center justify-center border-2 border-white shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Profile Avatar Pill */}
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-1.5 pl-1 pr-1.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200 transition-colors cursor-pointer"
              title="View Profile"
            >
              <div className="w-6 h-6 rounded-full bg-amber-400 text-neutral-950 font-black text-[11px] flex items-center justify-center uppercase shadow-xs">
                {user?.username?.charAt(0) || 'U'}
              </div>
              <span className="text-xs font-semibold text-neutral-800 max-w-[70px] truncate hidden sm:inline">
                {user?.displayName || user?.username || 'Trader'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Drawer / Dropdown */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 pt-14 bg-neutral-950/20 backdrop-blur-xs">
          <div 
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Notifications & Alerts
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNotifOpen(false)}
                className="w-6 h-6 rounded-full hover:bg-neutral-200 flex items-center justify-center text-neutral-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="max-h-[340px] overflow-y-auto divide-y divide-neutral-100">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-400">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-3.5 text-xs transition-colors ${item.read ? 'bg-white' : 'bg-amber-50/40'}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                        {!item.read && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />}
                        {item.title}
                      </span>
                      <span className="text-[10px] text-neutral-400 shrink-0">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-neutral-600 text-[11px] leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="p-2.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-[11px]">
              <span className="text-neutral-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Realtime Trade Signals
              </span>
              <button
                type="button"
                onClick={() => {
                  markNotificationsAsRead();
                  setIsNotifOpen(false);
                }}
                className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
