'use client';

import React, { useState } from 'react';
import { User } from '@/types/trading';
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  Wallet, 
  Power, 
  AlertTriangle,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Copy
} from 'lucide-react';

export type AdminModalMode = 'view' | 'add_funds' | 'deduct_funds' | 'edit' | 'delete';

interface AdminUserModalProps {
  user: User | null;
  mode: AdminModalMode;
  onClose: () => void;
  onAddFunds: (userId: string, amount: number, note?: string) => void;
  onDeductFunds: (userId: string, amount: number, note?: string) => { success: boolean; message: string };
  onEditUser: (userId: string, updates: Partial<User>) => void;
  onDeleteUser: (userId: string) => { success: boolean; message: string };
  onStopBot: (userId: string) => void;
}

export function AdminUserModal({
  user,
  mode: initialMode,
  onClose,
  onAddFunds,
  onDeductFunds,
  onEditUser,
  onDeleteUser,
  onStopBot,
}: AdminUserModalProps) {
  const [currentMode, setCurrentMode] = useState<AdminModalMode>(initialMode);

  // Add / Deduct funds state
  const [amountInput, setAmountInput] = useState<string>('500');
  const [noteInput, setNoteInput] = useState<string>('');
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Edit user state
  const [editName, setEditName] = useState<string>(user?.displayName || user?.username || '');
  const [editEmail, setEditEmail] = useState<string>(user?.email || '');
  const [editPhone, setEditPhone] = useState<string>(user?.phone || '+1 (555) 000-0000');
  const [editTier, setEditTier] = useState<string>(user?.tier || 'VIP Pro Tier');
  const [editVerified, setEditVerified] = useState<boolean>(user?.isVerified ?? true);
  const [editCash, setEditCash] = useState<string>(user?.cashBalance ? String(user.cashBalance) : '0');

  if (!user) return null;

  const handleAddFundsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    const amt = parseFloat(amountInput);
    if (isNaN(amt) || amt <= 0) {
      setFeedbackError('Please enter a valid positive amount.');
      return;
    }
    onAddFunds(user.id, amt, noteInput || 'Manual credit by administrator');
    onClose();
  };

  const handleDeductFundsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    const amt = parseFloat(amountInput);
    if (isNaN(amt) || amt <= 0) {
      setFeedbackError('Please enter a valid positive amount.');
      return;
    }
    const res = onDeductFunds(user.id, amt, noteInput || 'Manual debit by administrator');
    if (!res.success) {
      setFeedbackError(res.message);
      return;
    }
    onClose();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    const cashVal = parseFloat(editCash);
    if (isNaN(cashVal) || cashVal < 0) {
      setFeedbackError('Please enter a valid cash balance.');
      return;
    }

    onEditUser(user.id, {
      displayName: editName.trim() || user.displayName,
      email: editEmail.trim() || user.email,
      phone: editPhone.trim(),
      tier: editTier,
      isVerified: editVerified,
      cashBalance: Number(cashVal.toFixed(2)),
    });
    onClose();
  };

  const handleDeleteSubmit = () => {
    onDeleteUser(user.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-neutral-950 font-black flex items-center justify-center uppercase shadow-xs">
              {user.username.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {user.displayName || user.username}
                </h3>
                <span className="font-mono text-[10px] bg-neutral-800 text-amber-400 px-2 py-0.5 rounded-md font-semibold border border-neutral-700">
                  {user.accountId}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {user.email} • {user.tier}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Mode Navigation Pill Bar */}
        <div className="flex items-center border-b border-neutral-200 bg-neutral-50 px-3 py-2 gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => { setCurrentMode('view'); setFeedbackError(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              currentMode === 'view' ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            User Details
          </button>
          <button
            type="button"
            onClick={() => { setCurrentMode('add_funds'); setFeedbackError(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              currentMode === 'add_funds' ? 'bg-emerald-500 text-white shadow-xs' : 'text-neutral-500 hover:text-emerald-600'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Funds
          </button>
          <button
            type="button"
            onClick={() => { setCurrentMode('deduct_funds'); setFeedbackError(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              currentMode === 'deduct_funds' ? 'bg-amber-500 text-white shadow-xs' : 'text-neutral-500 hover:text-amber-600'
            }`}
          >
            <Minus className="w-3.5 h-3.5" />
            Deduct Funds
          </button>
          <button
            type="button"
            onClick={() => { setCurrentMode('edit'); setFeedbackError(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              currentMode === 'edit' ? 'bg-blue-600 text-white shadow-xs' : 'text-neutral-500 hover:text-blue-600'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Info
          </button>
          <button
            type="button"
            onClick={() => { setCurrentMode('delete'); setFeedbackError(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              currentMode === 'delete' ? 'bg-rose-600 text-white shadow-xs' : 'text-neutral-500 hover:text-rose-600'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {feedbackError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{feedbackError}</span>
            </div>
          )}

          {/* MODE: VIEW DETAILS */}
          {currentMode === 'view' && (
            <div className="space-y-4">
              {/* Balance & Status Banner */}
              <div className="p-4 rounded-2xl bg-neutral-900 text-white flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                    Current Cash Balance
                  </div>
                  <div className="text-2xl font-black text-amber-400 mt-0.5">
                    ${user.cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Network: USDT (TRC-20 TRON Rail)
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                    Trading Bot
                  </div>
                  {user.botRunning ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      BOT ACTIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">
                      BOT STOPPED
                    </span>
                  )}
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">Account ID</span>
                  <div className="font-mono text-xs font-bold text-neutral-900 flex items-center justify-between">
                    <span>{user.accountId}</span>
                    <button
                      type="button"
                      onClick={() => navigator?.clipboard?.writeText(user.accountId)}
                      className="p-1 hover:bg-neutral-200 rounded text-neutral-400 hover:text-neutral-700 cursor-pointer"
                      title="Copy ID"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">Membership Tier</span>
                  <div className="text-xs font-bold text-neutral-900 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>{user.tier}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">Email Address</span>
                  <div className="text-xs font-medium text-neutral-900 truncate flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">Phone Number</span>
                  <div className="text-xs font-medium text-neutral-900 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{user.phone || 'Not provided'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">KYC Verification</span>
                  <div className="text-xs font-semibold flex items-center gap-1 text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{user.isVerified ? 'Level 2 Verified' : 'Pending Verification'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">Lifetime Trades</span>
                  <div className="text-xs font-bold text-neutral-900">
                    {user.totalTrades || 0} executed
                  </div>
                </div>
              </div>

              {/* Bot Stop Remote Override Button */}
              {user.botRunning ? (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-rose-900">Active Trading Bot Detected</div>
                    <div className="text-[11px] text-rose-700">Admin can stop this user&apos;s bot immediately.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onStopBot(user.id);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Power className="w-3.5 h-3.5" />
                    Stop Bot
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-neutral-100 text-neutral-600 text-xs flex items-center gap-2">
                  <Power className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Trading bot is currently inactive for this user.</span>
                </div>
              )}
            </div>
          )}

          {/* MODE: ADD FUNDS */}
          {currentMode === 'add_funds' && (
            <form onSubmit={handleAddFundsSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs">
                <span className="font-bold">Add Money (USDT):</span> Funds will be directly credited to{' '}
                <span className="font-semibold">{user.displayName || user.username}</span>&apos;s cash balance.
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-1.5">
                  Amount to Credit (USD / USDT)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-neutral-500">$</span>
                  <input
                    type="number"
                    step="any"
                    required
                    min="1"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl py-2.5 pl-8 pr-3 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="500"
                  />
                </div>
              </div>

              {/* Quick Amount Pills */}
              <div className="flex items-center gap-2">
                {[100, 500, 1000, 5000, 10000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmountInput(String(preset))}
                    className="flex-1 py-1 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-emerald-100 hover:text-emerald-800 text-neutral-700 transition-colors cursor-pointer border border-neutral-200"
                  >
                    +${preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-1.5">
                  Administrative Note (Optional)
                </label>
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl py-2 px-3 text-xs text-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="e.g. VIP deposit bonus, customer wire reconciliation"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentMode('view')}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Confirm Credit (+${amountInput})</span>
                </button>
              </div>
            </form>
          )}

          {/* MODE: DEDUCT FUNDS */}
          {currentMode === 'deduct_funds' && (
            <form onSubmit={handleDeductFundsSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs">
                <span className="font-bold">Deduct Money:</span> This will debit funds from{' '}
                <span className="font-semibold">{user.displayName || user.username}</span>&apos;s available cash balance (${user.cashBalance.toLocaleString()}).
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-1.5">
                  Amount to Deduct (USD / USDT)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-neutral-500">$</span>
                  <input
                    type="number"
                    step="any"
                    required
                    min="1"
                    max={user.cashBalance}
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl py-2.5 pl-8 pr-3 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="250"
                  />
                </div>
              </div>

              {/* Quick Amount Pills */}
              <div className="flex items-center gap-2">
                {[50, 100, 250, 500, 1000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmountInput(String(Math.min(preset, user.cashBalance)))}
                    className="flex-1 py-1 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-amber-100 hover:text-amber-800 text-neutral-700 transition-colors cursor-pointer border border-neutral-200"
                  >
                    -${preset}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-1.5">
                  Reason for Deduction
                </label>
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl py-2 px-3 text-xs text-neutral-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="e.g. Manual withdrawal adjustment, fee settlement"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentMode('view')}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Minus className="w-4 h-4 stroke-[2.5]" />
                  <span>Confirm Debit (-${amountInput})</span>
                </button>
              </div>
            </form>
          )}

          {/* MODE: EDIT USER */}
          {currentMode === 'edit' && (
            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl py-2 px-3 text-xs text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl py-2 px-3 text-xs text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl py-2 px-3 text-xs text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                    Membership Tier
                  </label>
                  <select
                    value={editTier}
                    onChange={(e) => setEditTier(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl py-2 px-3 text-xs text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Standard">Standard</option>
                    <option value="VIP Trader">VIP Trader</option>
                    <option value="VIP Pro Tier">VIP Pro Tier</option>
                    <option value="Institutional">Institutional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                    Direct Balance Override ($)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={editCash}
                    onChange={(e) => setEditCash(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl py-2 px-3 text-xs font-mono font-bold text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                    KYC Status
                  </label>
                  <div className="flex items-center gap-2 pt-1.5">
                    <label className="inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editVerified}
                        onChange={(e) => setEditVerified(e.target.checked)}
                        className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Verified (Level 2)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setCurrentMode('view')}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* MODE: DELETE USER */}
          {currentMode === 'delete' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-1">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>Confirm Account Deletion</span>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed">
                  Are you sure you want to permanently delete user{' '}
                  <span className="font-bold font-mono text-neutral-900">{user.displayName || user.username} ({user.accountId})</span>?
                  This will wipe their account, active positions, and credentials. This action cannot be reversed.
                </p>
              </div>

              <div className="p-3 bg-neutral-100 rounded-xl text-neutral-700 text-xs">
                <div>User Email: <span className="font-semibold text-neutral-900">{user.email}</span></div>
                <div>Account Balance: <span className="font-semibold text-neutral-900">${user.cashBalance.toLocaleString()}</span></div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentMode('view')}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSubmit}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Permanently Delete User</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
