'use client';

import React, { useState, useMemo } from 'react';
import { User } from '@/types/trading';
import { 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  Power, 
  Edit3, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  Wallet, 
  Copy,
  Users,
  CheckCircle2,
  Clock,
  UserPlus
} from 'lucide-react';
import { AdminUserModal, AdminModalMode } from './AdminUserModal';

interface AdminUsersViewProps {
  users: User[];
  onAddFunds: (userId: string, amount: number, note?: string) => void;
  onDeductFunds: (userId: string, amount: number, note?: string) => { success: boolean; message: string };
  onEditUser: (userId: string, updates: Partial<User>) => void;
  onDeleteUser: (userId: string) => { success: boolean; message: string };
  onStopBot: (userId: string) => void;
  onStopAllBots: () => void;
}

export function AdminUsersView({
  users,
  onAddFunds,
  onDeductFunds,
  onEditUser,
  onDeleteUser,
  onStopBot,
  onStopAllBots,
}: AdminUsersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'running' | 'stopped' | 'vip'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<AdminModalMode>('view');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        u.displayName?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.accountId?.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (filterTab === 'running') return !!u.botRunning;
      if (filterTab === 'stopped') return !u.botRunning;
      if (filterTab === 'vip') return u.tier.includes('VIP') || u.tier.includes('Institutional');
      return true;
    });
  }, [users, searchQuery, filterTab]);

  const activeBotsCount = users.filter((u) => u.botRunning).length;
  const totalUsersCapital = users.reduce((sum, u) => sum + (u.cashBalance || 0), 0);

  const openActionModal = (user: User, mode: AdminModalMode) => {
    setSelectedUser(user);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Registered Accounts</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-1">
            {users.length}
          </div>
          <div className="text-[11px] text-neutral-400 font-medium">
            100% KYC & Session Verified
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Active Trading Bots</span>
            <Power className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1 flex items-center gap-2">
            <span>{activeBotsCount}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-[11px] text-neutral-400 font-medium">
            Live Algorithmic Execution
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Total Managed Capital</span>
            <Wallet className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-1">
            ${totalUsersCapital.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-neutral-400 font-medium">
            USDT (TRC-20) Liquidity
          </div>
        </div>
      </div>

      {/* Search, Filters, and Bulk Actions Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Name, Email, or Account ID (e.g. GSQ-73835838)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterTab === 'all' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            All ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('running')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterTab === 'running' ? 'bg-white text-emerald-700 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Bot Running ({activeBotsCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('stopped')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterTab === 'stopped' ? 'bg-white text-neutral-800 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Bot Idle ({users.length - activeBotsCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('vip')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterTab === 'vip' ? 'bg-white text-amber-700 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            VIP Tiers
          </button>
        </div>

        {/* Emergency Stop All Bots */}
        {activeBotsCount > 0 && (
          <button
            type="button"
            onClick={onStopAllBots}
            className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
            title="Emergency halt all running bots"
          >
            <Power className="w-3.5 h-3.5" />
            <span>Halt All Bots</span>
          </button>
        )}
      </div>

      {/* Users Table / Card List */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 text-sm">
            No accounts found matching &quot;{searchQuery}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200/80 bg-neutral-50/70 text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                  <th className="py-3 px-4">User & Account ID</th>
                  <th className="py-3 px-4">Tier & KYC</th>
                  <th className="py-3 px-4">Cash Balance (USDT)</th>
                  <th className="py-3 px-4">Bot Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50/60 transition-colors">
                    {/* User & Account ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-400 text-neutral-950 font-black flex items-center justify-center uppercase shrink-0 shadow-xs">
                          {u.username.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                            <span>{u.displayName || u.username}</span>
                            {u.role === 'admin' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-neutral-900 text-amber-400">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                            <span className="font-mono font-semibold text-neutral-700">{u.accountId}</span>
                            <span>•</span>
                            <span className="truncate max-w-[140px]">{u.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Tier & KYC */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/70">
                          <ShieldCheck className="w-3 h-3 text-amber-600" />
                          {u.tier}
                        </span>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Level 2 KYC</span>
                        </div>
                      </div>
                    </td>

                    {/* Cash Balance */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-black text-neutral-900 text-sm">
                        ${u.cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {u.totalTrades || 0} total trades
                      </div>
                    </td>

                    {/* Bot Status & Toggle */}
                    <td className="py-3.5 px-4">
                      {u.botRunning ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            ACTIVE
                          </span>
                          <button
                            type="button"
                            onClick={() => onStopBot(u.id)}
                            className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold transition-colors cursor-pointer"
                            title="Stop this user's trading bot"
                          >
                            Stop Bot
                          </button>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-500 border border-neutral-200">
                          STOPPED
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Add Funds */}
                        <button
                          type="button"
                          onClick={() => openActionModal(u, 'add_funds')}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Add money to account"
                        >
                          <Plus className="w-3 h-3 stroke-[2.5]" />
                          <span>Add</span>
                        </button>

                        {/* Quick Deduct Funds */}
                        <button
                          type="button"
                          onClick={() => openActionModal(u, 'deduct_funds')}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Deduct money from account"
                        >
                          <Minus className="w-3 h-3 stroke-[2.5]" />
                          <span>Deduct</span>
                        </button>

                        {/* View Details Inspector */}
                        <button
                          type="button"
                          onClick={() => openActionModal(u, 'view')}
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 transition-colors cursor-pointer"
                          title="View user details & history"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit User Info */}
                        <button
                          type="button"
                          onClick={() => openActionModal(u, 'edit')}
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-blue-50 hover:text-blue-600 border border-neutral-200 transition-colors cursor-pointer"
                          title="Edit user details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete User */}
                        <button
                          type="button"
                          onClick={() => openActionModal(u, 'delete')}
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-rose-50 hover:text-rose-600 border border-neutral-200 transition-colors cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Action Modal for User */}
      {isModalOpen && selectedUser && (
        <AdminUserModal
          user={selectedUser}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          onAddFunds={onAddFunds}
          onDeductFunds={onDeductFunds}
          onEditUser={onEditUser}
          onDeleteUser={onDeleteUser}
          onStopBot={onStopBot}
        />
      )}
    </div>
  );
}
