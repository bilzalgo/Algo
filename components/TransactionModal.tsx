'use client';

import React, { useState } from 'react';
import { useTrading } from '@/context/TradingContext';
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Copy, 
  Check, 
  ReceiptText, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export function TransactionModal() {
  const { 
    isTransactionModalOpen, 
    closeTransactionModal, 
    transactions, 
    setToastMessage 
  } = useTrading();

  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdraw'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isTransactionModalOpen) return null;

  const handleCopy = (text: string, id: string, label: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(id);
    setToastMessage(`${label} copied to clipboard!`);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filtered = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-950/50 backdrop-blur-xs transition-opacity duration-200"
      onClick={closeTransactionModal}
    >
      <div 
        className="w-full max-w-[440px] bg-white rounded-t-3xl shadow-2xl border-t border-neutral-200/90 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle bar indicator */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center shadow-xs shadow-amber-400/30">
              <ReceiptText className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-neutral-900 tracking-tight">
                  Transaction History
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  TRC-20
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-medium">
                USDT (TRX Network) Transfers
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeTransactionModal}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-3 bg-neutral-50/60 border-b border-neutral-100 flex items-center justify-between gap-2 shrink-0">
          <div className="flex bg-neutral-100 p-0.5 rounded-xl border border-neutral-200/70">
            {(['all', 'deposit', 'withdraw'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setFilter(mode)}
                className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${
                  filter === mode
                    ? 'bg-amber-400 text-neutral-950 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {mode === 'all' ? 'All Transactions' : `${mode}s`}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-semibold text-neutral-400">
            {filtered.length} total
          </span>
        </div>

        {/* Transaction Items List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y-0">
          {filtered.length === 0 ? (
            <div className="text-center py-12 px-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 my-4">
              <ReceiptText className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
              <p className="text-xs font-bold text-neutral-700">No transactions recorded</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Your completed USDT TRC-20 deposits and withdrawals will appear here.
              </p>
            </div>
          ) : (
            filtered.map((tx) => {
              const isDeposit = tx.type === 'deposit';
              return (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-all space-y-2.5"
                >
                  {/* Top row: Type, Amount, Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                          isDeposit
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {isDeposit ? (
                          <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-neutral-900 uppercase">
                            {isDeposit ? 'Deposit' : 'Withdrawal'}
                          </span>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60">
                            {tx.network}
                          </span>
                        </div>
                        <div className="text-[10px] text-neutral-400 font-medium">
                          {new Date(tx.timestamp).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-sm font-black ${
                          isDeposit ? 'text-emerald-600' : 'text-neutral-900'
                        }`}
                      >
                        {isDeposit ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                      </div>
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Details row: Address & TxHash */}
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-[11px] space-y-1.5 font-mono text-neutral-600">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 font-sans text-[10px] font-bold uppercase tracking-wider">
                        {isDeposit ? 'Deposit Address' : 'To Address'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(tx.address, `addr_${tx.id}`, 'Address')}
                        className="flex items-center gap-1 text-neutral-700 hover:text-neutral-950 font-bold transition-colors cursor-pointer"
                        title="Copy Address"
                      >
                        <span>
                          {tx.address.slice(0, 8)}...{tx.address.slice(-6)}
                        </span>
                        {copiedId === `addr_${tx.id}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-neutral-400" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-neutral-200/50">
                      <span className="text-neutral-400 font-sans text-[10px] font-bold uppercase tracking-wider">
                        Tx Hash
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(tx.txHash, `hash_${tx.id}`, 'Tx Hash')}
                        className="flex items-center gap-1 text-neutral-700 hover:text-neutral-950 font-bold transition-colors cursor-pointer"
                        title="Copy Tx Hash"
                      >
                        <span>
                          {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}
                        </span>
                        {copiedId === `hash_${tx.id}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-neutral-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info banner */}
        <div className="p-3 bg-neutral-50 border-t border-neutral-200/80 px-5 flex items-center justify-between text-[11px] text-neutral-500 shrink-0">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>TRON Blockchain Verified</span>
          </div>
          <span className="font-semibold text-neutral-600">TRC-20 Standard</span>
        </div>
      </div>
    </div>
  );
}
