'use client';

import React from 'react';
import { User, WalletTransaction, BotSymbolConfig, DerivTickData } from '@/types/trading';
import { 
  Users, 
  Wallet, 
  Power, 
  ReceiptText, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Bot, 
  ShieldCheck, 
  ArrowRight,
  Plus,
  Clock,
  Activity,
  Building2
} from 'lucide-react';

interface AdminOverviewProps {
  users: User[];
  transactions: WalletTransaction[];
  availableSymbols: BotSymbolConfig[];
  activeSymbolId: string;
  onSelectSymbol: (symbolId: string) => void;
  derivData: DerivTickData;
  onNavigateTab: (tab: 'users' | 'transactions' | 'bot' | 'master_pool') => void;
  onAddFundsModal: (user: User) => void;
  onStopBot: (userId: string) => void;
  onStopAllBots: () => void;
}


export function AdminOverview({
  users,
  transactions,
  availableSymbols,
  activeSymbolId,
  onSelectSymbol,
  derivData,
  onNavigateTab,
  onAddFundsModal,
  onStopBot,
  onStopAllBots,
}: AdminOverviewProps) {
  const activeBotsCount = users.filter((u) => u.botRunning).length;
  const totalBalance = users.reduce((sum, u) => sum + (u.cashBalance || 0), 0);
  const pendingTxCount = transactions.filter((t) => t.status === 'pending' || t.status === 'processing').length;
  const activeSymbolObj = availableSymbols.find((s) => s.id === activeSymbolId) || availableSymbols[0];

  return (
    <div className="space-y-4">
      {/* Platform KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div 
          onClick={() => onNavigateTab('users')}
          className="p-4 rounded-3xl bg-white border border-neutral-200/90 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Platform Users</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">
            {users.length}
          </div>
          <div className="text-[11px] text-neutral-400 font-medium mt-0.5 flex items-center justify-between">
            <span>Accounts active</span>
            <ArrowRight className="w-3 h-3 text-neutral-300 group-hover:text-amber-500 transition-colors" />
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Managed Capital</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            USDT TRC-20 Liquidity
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('bot')}
          className="p-4 rounded-3xl bg-white border border-neutral-200/90 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Trading Bots</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-600 transition-colors">
              <Power className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2 flex items-center gap-2">
            <span>{activeBotsCount} Live</span>
            {activeBotsCount > 0 && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />}
          </div>
          <div className="text-[11px] text-neutral-400 font-medium mt-0.5 flex items-center justify-between">
            <span>{activeSymbolObj.symbol}</span>
            <ArrowRight className="w-3 h-3 text-neutral-300 group-hover:text-emerald-500 transition-colors" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('transactions')}
          className="p-4 rounded-3xl bg-white border border-neutral-200/90 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Pending Approvals</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">
            {pendingTxCount}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5 flex items-center justify-between">
            <span>Requires action</span>
            <ArrowRight className="w-3 h-3 text-neutral-300 group-hover:text-amber-500 transition-colors" />
          </div>
        </div>
      </div>

      {/* Global Bot Symbol Quick Switcher Card */}
      <div className="p-5 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              System Bot Execution Symbol
            </div>
            <div className="text-base font-black text-white flex items-center gap-2 mt-0.5">
              <span>{activeSymbolObj.name}</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700">
                {activeSymbolObj.symbol}
              </span>
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">
              Live Feed: ${derivData.quote.toLocaleString(undefined, { minimumFractionDigits: 2 })} • Speed: {activeSymbolObj.tickSpeed}
            </div>
          </div>
        </div>

        {/* Quick Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-400 font-semibold whitespace-nowrap">
            Switch Symbol:
          </label>
          <select
            value={activeSymbolId}
            onChange={(e) => onSelectSymbol(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
          >
            {availableSymbols.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Master Deriv PAMM Gateway Quick Access Banner */}
      <div 
        onClick={() => onNavigateTab('master_pool')}
        className="p-4 rounded-3xl bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-amber-500 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-950 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
            <Building2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-black tracking-wider text-neutral-800">
              Institutional Master Deriv Pool
            </div>
            <div className="text-sm font-black text-neutral-950 flex items-center gap-2">
              <span>Single Account PAMM Aggregator &amp; Return Rate Setup</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-xs font-black bg-neutral-950 text-white px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 group-hover:bg-neutral-900 transition-colors">
            <span>Manage Master Pool</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>

      {/* Two Column Layout: User Highlights & Recent Transactions Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* User Highlights */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 tracking-tight flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-500" />
                <span>Managed Accounts</span>
              </h3>
              <p className="text-xs text-neutral-500">Quick money adjustment and bot killswitch</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('users')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-neutral-100 flex-1">
            {users.slice(0, 5).map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-900 font-black text-xs flex items-center justify-center uppercase shrink-0">
                    {u.username.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-neutral-900 flex items-center gap-1">
                      <span>{u.displayName || u.username}</span>
                      <span className="font-mono text-[10px] text-neutral-400">({u.accountId})</span>
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Balance: <span className="font-semibold text-neutral-900 font-mono">${u.cashBalance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {u.botRunning && (
                    <button
                      type="button"
                      onClick={() => onStopBot(u.id)}
                      className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold cursor-pointer"
                    >
                      Halt Bot
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onAddFundsModal(u)}
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold cursor-pointer flex items-center gap-1"
                    title="Add money"
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                    <span className="hidden sm:inline">Add $</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Ledger */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 tracking-tight flex items-center gap-1.5">
                <ReceiptText className="w-4 h-4 text-amber-500" />
                <span>Recent Settlements</span>
              </h3>
              <p className="text-xs text-neutral-500">USDT TRC-20 deposit and withdrawal stream</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('transactions')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-neutral-100 flex-1">
            {transactions.slice(0, 5).map((t) => {
              const isDep = t.type === 'deposit';
              return (
                <div key={t.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isDep ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isDep ? (
                        <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-neutral-900">
                        {isDep ? 'Deposit' : 'Withdrawal'} • {t.userName || 'Account'}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        {t.network} • {new Date(t.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-mono font-bold text-xs ${isDep ? 'text-emerald-600' : 'text-neutral-900'}`}>
                      {isDep ? '+' : '-'}${t.amount.toLocaleString()}
                    </div>
                    <span
                      className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                        t.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : t.status === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
