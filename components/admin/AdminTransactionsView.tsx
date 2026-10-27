'use client';

import React, { useState, useMemo } from 'react';
import { WalletTransaction } from '@/types/trading';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Copy, 
  ReceiptText,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface AdminTransactionsViewProps {
  transactions: WalletTransaction[];
  onUpdateStatus: (txId: string, status: 'completed' | 'processing' | 'pending' | 'rejected') => void;
}

export function AdminTransactionsView({
  transactions,
  onUpdateStatus,
}: AdminTransactionsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'deposit' | 'withdraw' | 'pending'>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedHash(text);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  // Metrics
  const totalDeposits = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalWithdrawals = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'withdraw' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const pendingCount = useMemo(() => {
    return transactions.filter((t) => t.status === 'pending' || t.status === 'processing').length;
  }, [transactions]);

  // Filtered transactions
  const filteredTx = useMemo(() => {
    return transactions.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.id?.toLowerCase().includes(q) ||
        t.txHash?.toLowerCase().includes(q) ||
        t.address?.toLowerCase().includes(q) ||
        t.userName?.toLowerCase().includes(q) ||
        t.userAccountId?.toLowerCase().includes(q) ||
        t.note?.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (filterTab === 'deposit') return t.type === 'deposit';
      if (filterTab === 'withdraw') return t.type === 'withdraw';
      if (filterTab === 'pending') return t.status === 'pending' || t.status === 'processing';
      return true;
    });
  }, [transactions, searchQuery, filterTab]);

  return (
    <div className="space-y-4">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Settled USDT Deposits</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            +${totalDeposits.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 font-medium">
            TRC-20 Network Inflow
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Settled Withdrawals</span>
            <ArrowUpRight className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-1">
            -${totalWithdrawals.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 font-medium">
            TRON Rail Disbursed
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Pending Authorizations</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1 flex items-center gap-2">
            <span>{pendingCount}</span>
            {pendingCount > 0 && <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />}
          </div>
          <div className="text-[11px] text-neutral-400 font-medium">
            Requires Admin Review
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by TxHash, Tron Address, Account ID, or User..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterTab === 'all' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            All Transactions ({transactions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('deposit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterTab === 'deposit' ? 'bg-white text-emerald-700 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Deposits
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('withdraw')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterTab === 'withdraw' ? 'bg-white text-amber-800 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Withdrawals
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterTab === 'pending' ? 'bg-white text-amber-600 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Pending Review ({pendingCount})
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden">
        {filteredTx.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 text-sm">
            No transactions found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200/80 bg-neutral-50/70 text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                  <th className="py-3 px-4">Type & User</th>
                  <th className="py-3 px-4">Amount (USDT)</th>
                  <th className="py-3 px-4">TRON Rail Details</th>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredTx.map((tx) => {
                  const isDep = tx.type === 'deposit';
                  const isPending = tx.status === 'pending' || tx.status === 'processing';

                  return (
                    <tr key={tx.id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* Type & User */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isDep
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isDep ? (
                              <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                              <span>{isDep ? 'Deposit' : 'Withdrawal'}</span>
                              <span className="text-[10px] font-normal text-neutral-400">({tx.network})</span>
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              <span className="font-semibold text-neutral-800">{tx.userName || 'Account User'}</span>
                              {tx.userAccountId && (
                                <span className="font-mono text-[10px] ml-1 text-neutral-400">
                                  ({tx.userAccountId})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4">
                        <div
                          className={`font-mono font-black text-sm ${
                            isDep ? 'text-emerald-600' : 'text-neutral-900'
                          }`}
                        >
                          {isDep ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate max-w-[150px]">
                          {tx.note || 'USDT TRC-20 rail'}
                        </div>
                      </td>

                      {/* TRON Details */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 font-mono text-[11px] text-neutral-700">
                            <span className="text-neutral-400">Addr:</span>
                            <span className="truncate max-w-[120px]">{tx.address}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(tx.address)}
                              className="p-0.5 hover:text-amber-600 cursor-pointer text-neutral-400"
                              title="Copy Address"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1 font-mono text-[10px] text-neutral-500">
                            <span className="text-neutral-400">Hash:</span>
                            <span className="truncate max-w-[120px]">{tx.txHash}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(tx.txHash)}
                              className="p-0.5 hover:text-amber-600 cursor-pointer text-neutral-400"
                              title="Copy Hash"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Date / Time */}
                      <td className="py-3.5 px-4 text-neutral-500 text-[11px]">
                        <div>{new Date(tx.timestamp).toLocaleDateString()}</div>
                        <div className="text-[10px] text-neutral-400">
                          {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {tx.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            COMPLETED
                          </span>
                        )}
                        {(tx.status === 'pending' || tx.status === 'processing') && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 animate-spin" />
                            PENDING
                          </span>
                        )}
                        {tx.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            REJECTED
                          </span>
                        )}
                      </td>

                      {/* Approval Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(tx.id, 'completed')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold shadow-xs cursor-pointer flex items-center gap-1"
                              title="Approve transaction and credit funds"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(tx.id, 'rejected')}
                              className="px-2 py-1 rounded-lg bg-neutral-100 hover:bg-rose-50 hover:text-rose-600 text-neutral-600 text-[11px] font-semibold border border-neutral-200 cursor-pointer flex items-center gap-1"
                              title="Reject transaction"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-neutral-400 font-medium italic">
                            Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
