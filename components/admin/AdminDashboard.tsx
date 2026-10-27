'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTrading } from '@/context/TradingContext';
import { User } from '@/types/trading';
import { 
  ShieldCheck, 
  Users, 
  ReceiptText, 
  Bot, 
  ArrowLeft, 
  Power, 
  LayoutDashboard,
  Wallet,
  Activity,
  Layers,
  ChevronRight,
  Sparkles,
  Lock,
  Building2
} from 'lucide-react';
import { AdminOverview } from './AdminOverview';
import { AdminUsersView } from './AdminUsersView';
import { AdminTransactionsView } from './AdminTransactionsView';
import { AdminBotView } from './AdminBotView';
import { AdminUserModal } from './AdminUserModal';
import { AdminMasterPoolView } from './AdminMasterPoolView';
import { AdvancedNotification } from '@/components/AdvancedNotification';

interface AdminDashboardProps {
  onExit: () => void;
}

export function AdminDashboard({ onExit }: AdminDashboardProps) {
  const {
    user,
    users,
    transactions,
    availableBotSymbols,
    adminSelectedSymbol,
    adminSelectBotSymbol,
    derivData,
    adminAddFunds,
    adminDeductFunds,
    adminEditUser,
    adminDeleteUser,
    adminStopUserBot,
    adminStopAllBots,
    adminUpdateTransactionStatus,
    toastMessage,
    setToastMessage,
    userProfitReturnRate,
    totalPoolStake,
  } = useTrading();

  const [activeTab, setActiveTab] = useState<'overview' | 'master_pool' | 'users' | 'transactions' | 'bot'>('master_pool');

  const [selectedUserForAction, setSelectedUserForAction] = useState<User | null>(null);
  const [userModalMode, setUserModalMode] = useState<'view' | 'add_funds' | 'deduct_funds' | 'edit' | 'delete'>('add_funds');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const activeBotsCount = users.filter((u) => u.botRunning).length;
  const activeSymbolObj = availableBotSymbols.find((s) => s.id === adminSelectedSymbol) || availableBotSymbols[0];

  const handleOpenAddFundsModal = (targetUser: User) => {
    setSelectedUserForAction(targetUser);
    setUserModalMode('add_funds');
    setIsUserModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col text-neutral-900 selection:bg-amber-300">
      {/* Top Administrative Header Bar */}
      <header className="sticky top-0 z-40 bg-neutral-950 text-white border-b border-neutral-800 shadow-md px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Brand + Admin Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 p-0.5 flex items-center justify-center shadow-md shadow-amber-400/20 overflow-hidden shrink-0">
              <Image 
                src="/assets/aistudio/6819650_af089a78.png" 
                alt="G-squad Logo" 
                width={36} 
                height={36} 
                className="w-full h-full object-contain"
                priority
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-tight">
                  G-<span className="text-amber-400">squad</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-neutral-950 shadow-xs">
                  <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Institutional Management &amp; Bot Supervisor
              </p>
            </div>
          </div>

          {/* Center Indicators */}
          <div className="hidden lg:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-neutral-400">Bot Symbol:</span>
              <span className="font-mono font-bold text-white">{activeSymbolObj.symbol}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-neutral-400">Active Bots:</span>
              <span className="font-bold text-emerald-400">{activeBotsCount}</span>
            </div>
          </div>

          {/* Right Action: Return to User Dashboard */}
          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onExit}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>User App</span>
            </button>

            {activeBotsCount > 0 && (
              <button
                type="button"
                onClick={adminStopAllBots}
                className="px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Stop all trading bots across the platform"
              >
                <Power className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Halt All Bots</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Navigation Tabs Bar */}
        <div className="bg-white p-1.5 rounded-2xl border border-neutral-200/90 shadow-xs mb-5 flex items-center gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-neutral-900 text-amber-400 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('master_pool')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'master_pool'
                ? 'bg-amber-400 text-neutral-950 shadow-sm shadow-amber-400/20 font-black'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Master Deriv &amp; Copy-Pool</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'master_pool' ? 'bg-neutral-950 text-amber-400' : 'bg-amber-100 text-amber-800'
            }`}>
              {userProfitReturnRate}% Return
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-neutral-900 text-amber-400 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'bg-neutral-900 text-amber-400 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <ReceiptText className="w-4 h-4" />
            <span>Deposit &amp; Withdraw Ledger</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bot')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'bot'
                ? 'bg-neutral-900 text-amber-400 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Bot Symbol &amp; Strategy</span>
          </button>
        </div>

        {/* Tab Views */}
        <main>
          {activeTab === 'overview' && (
            <AdminOverview
              users={users}
              transactions={transactions}
              availableSymbols={availableBotSymbols}
              activeSymbolId={adminSelectedSymbol}
              onSelectSymbol={adminSelectBotSymbol}
              derivData={derivData}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
              onAddFundsModal={handleOpenAddFundsModal}
              onStopBot={adminStopUserBot}
              onStopAllBots={adminStopAllBots}
            />
          )}

          {activeTab === 'master_pool' && (
            <AdminMasterPoolView />
          )}

          {activeTab === 'users' && (
            <AdminUsersView
              users={users}
              onAddFunds={adminAddFunds}
              onDeductFunds={adminDeductFunds}
              onEditUser={adminEditUser}
              onDeleteUser={adminDeleteUser}
              onStopBot={adminStopUserBot}
              onStopAllBots={adminStopAllBots}
            />
          )}

          {activeTab === 'transactions' && (
            <AdminTransactionsView
              transactions={transactions}
              onUpdateStatus={adminUpdateTransactionStatus}
            />
          )}

          {activeTab === 'bot' && (
            <AdminBotView
              availableSymbols={availableBotSymbols}
              activeSymbolId={adminSelectedSymbol}
              onSelectSymbol={adminSelectBotSymbol}
              derivData={derivData}
              activeBotsCount={activeBotsCount}
              onStopAllBots={adminStopAllBots}
            />
          )}
        </main>
      </div>

      {/* Admin Action Modal for quick user actions */}
      {isUserModalOpen && selectedUserForAction && (
        <AdminUserModal
          user={selectedUserForAction}
          mode={userModalMode}
          onClose={() => setIsUserModalOpen(false)}
          onAddFunds={adminAddFunds}
          onDeductFunds={adminDeductFunds}
          onEditUser={adminEditUser}
          onDeleteUser={adminDeleteUser}
          onStopBot={adminStopUserBot}
        />
      )}

      {/* Advanced Notification Banner */}
      <AdvancedNotification
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
