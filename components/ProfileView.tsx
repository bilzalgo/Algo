'use client';

import React, { useState } from 'react';
import { useTrading } from '@/context/TradingContext';
import { 
  ShieldCheck, 
  Award, 
  LogOut, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Mail,
  Wallet,
  Zap,
  CheckCircle2,
  Copy
} from 'lucide-react';

export function ProfileView() {
  const { 
    user, 
    logout, 
    totalPnl, 
    totalPnlPercent, 
    openPaymentModal,
    setToastMessage,
    setIsAdminMode
  } = useTrading();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const winRate = 68.4;

  return (
    <div className="space-y-4 pb-24">
      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-200/90 relative overflow-hidden">
        {/* Soft yellow glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 mb-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-neutral-950 font-black text-2xl flex items-center justify-center shadow-md shadow-amber-400/30 uppercase">
              {user?.username?.charAt(0) || 'U'}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold text-neutral-900 tracking-tight">
                {user?.displayName || user?.username}
              </h1>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                <Award className="w-2.5 h-2.5" />
                VIP
              </span>
            </div>
            
            <div className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3 text-neutral-400" />
              <span>{user?.email}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                KYC Level 2
              </span>
              <span className="text-[10px] text-neutral-400 font-semibold">
                Tier: {user?.tier || 'VIP Pro'}
              </span>
            </div>

            {/* Generated Account ID */}
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Account ID:</span>
              <button
                type="button"
                onClick={() => {
                  const idToCopy = user?.accountId || 'GSQ-73835838';
                  if (navigator?.clipboard?.writeText) {
                    navigator.clipboard.writeText(idToCopy);
                    setToastMessage(`Account ID ${idToCopy} copied!`);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-neutral-100 hover:bg-amber-100 border border-neutral-200 text-neutral-900 text-xs font-mono font-bold transition-colors cursor-pointer group"
                title="Click to copy Account ID"
              >
                <span>{user?.accountId || 'GSQ-73835838'}</span>
                <Copy className="w-3 h-3 text-neutral-400 group-hover:text-amber-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons: Clean Deposit & Withdraw (USDT TRC-20) */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => openPaymentModal('deposit')}
            className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-xs shadow-xs shadow-amber-400/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Deposit USDT</span>
          </button>

          <button
            type="button"
            onClick={() => openPaymentModal('withdraw')}
            className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 text-amber-400 stroke-[2.5]" />
            <span>Withdraw USDT</span>
          </button>
        </div>
      </div>

      {/* 2. Trader Performance Stats */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-neutral-200/90">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Account Overview
            </h2>
          </div>
          <span className="text-[10px] font-semibold text-neutral-400">
            Realtime Analytics
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70">
            <div className="text-[11px] font-semibold text-neutral-500 flex items-center gap-1">
              <Wallet className="w-3 h-3 text-amber-500" />
              <span>Available Cash</span>
            </div>
            <div className="text-base font-black text-neutral-900 mt-0.5">
              ${(user?.cashBalance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] font-semibold text-emerald-600">
              USDT Equivalent
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70">
            <div className="text-[11px] font-semibold text-neutral-500 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Net Return</span>
            </div>
            <div className={`text-base font-black mt-0.5 ${totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString()}
            </div>
            <div className={`text-[10px] font-bold ${totalPnlPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {totalPnlPercent >= 0 ? '+' : ''}{totalPnlPercent}% Total ROI
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70">
            <div className="text-[11px] font-semibold text-neutral-500 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Win Rate</span>
            </div>
            <div className="text-base font-black text-neutral-900 mt-0.5">
              {winRate}%
            </div>
            <div className="text-[10px] font-semibold text-neutral-400">
              Institutional Algorithm
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70">
            <div className="text-[11px] font-semibold text-neutral-500 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Settlement Network</span>
            </div>
            <div className="text-base font-black text-neutral-900 mt-0.5">
              TRC-20
            </div>
            <div className="text-[10px] font-semibold text-emerald-600">
              Instant TRX Rail
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 Administrator Console Access Card */}
      <div className="bg-neutral-900 rounded-3xl p-4 sm:p-5 shadow-sm border border-neutral-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shrink-0">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Admin Dashboard</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-400 text-neutral-950">CONSOLE</span>
            </div>
            <div className="text-[11px] text-neutral-400">
              Users, money adjustments, bot symbol &amp; ledger
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdminMode(true)}
          className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>Open</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* 3. Logout / Session Security Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-neutral-200/90">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-neutral-900">Sign Out of Session</div>
            <div className="text-[11px] text-neutral-500">Logged in as {user?.email}</div>
          </div>

          {showLogoutConfirm ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={logout}
                className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-100 text-neutral-600 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-rose-50 hover:text-rose-600 border border-neutral-200 text-neutral-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
