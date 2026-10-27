'use client';

import React, { useState } from 'react';
import { useTrading } from '@/context/TradingContext';
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Copy, 
  Check, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Wallet
} from 'lucide-react';

const DEPOSIT_TRX_ADDRESS = 'TLvNf7Mqk1R76wJ3r9xY5E8bUqR1yXz2A4';

export function PaymentModal() {
  const { 
    isPaymentModalOpen, 
    closePaymentModal, 
    paymentModalTab, 
    user, 
    depositFunds, 
    withdrawFunds,
    setToastMessage 
  } = useTrading();

  const [selectedTab, setSelectedTab] = useState<'deposit' | 'withdraw' | null>(null);
  const activeTab = selectedTab ?? paymentModalTab ?? 'deposit';
  const [depositAmount, setDepositAmount] = useState('1000');
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isPaymentModalOpen) return null;

  const currentBalance = user?.cashBalance || 0;

  const handleCopyAddress = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(DEPOSIT_TRX_ADDRESS);
    }
    setIsCopied(true);
    setToastMessage('USDT (TRC-20) address copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2200);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg('Please specify a valid deposit amount in USDT.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      depositFunds(amt, undefined, DEPOSIT_TRX_ADDRESS);
      setIsProcessing(false);
      closePaymentModal();
    }, 450);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg('Please enter a valid withdrawal amount in USDT.');
      return;
    }
    if (amt > currentBalance) {
      setErrorMsg(`Insufficient USDT balance. Available: $${currentBalance.toLocaleString()}`);
      return;
    }
    const cleanAddr = destinationAddress.trim();
    if (!cleanAddr) {
      setErrorMsg('Please enter your TRON (TRC-20) recipient address.');
      return;
    }
    if (!cleanAddr.startsWith('T') && cleanAddr.length < 20) {
      setErrorMsg('Invalid TRC-20 address format. TRON addresses typically begin with "T".');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const res = withdrawFunds(amt, cleanAddr);
      setIsProcessing(false);
      if (res.success) {
        closePaymentModal();
      } else {
        setErrorMsg(res.message);
      }
    }, 450);
  };

  const handlePercentageClick = (pct: number) => {
    const calculated = (currentBalance * pct) / 100;
    setWithdrawAmount(Math.floor(calculated).toString());
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-950/50 backdrop-blur-xs"
      onClick={closePaymentModal}
    >
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-neutral-200 animate-in slide-in-from-bottom-8 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center shadow-xs shadow-amber-400/30 font-black">
              <Zap className="w-5 h-5 fill-neutral-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-extrabold text-neutral-900 tracking-tight">
                  USDT (TRX Rail)
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  TRC-20
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-medium">
                Instant Zero-Fee TRON Network Transfers
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closePaymentModal}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Deposit / Withdraw Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 my-4">
          <button
            type="button"
            onClick={() => {
              setSelectedTab('deposit');
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'deposit'
                ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/25'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Deposit USDT (TRX)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedTab('withdraw');
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'withdraw'
                ? 'bg-neutral-900 text-white shadow-md'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            <span>Withdraw USDT (TRX)</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ================= TAB 1: DEPOSIT USDT TRX ================= */}
        {activeTab === 'deposit' && (
          <form onSubmit={handleDeposit} className="space-y-4">
            
            {/* TRON Network Badge */}
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                  Deposit Network
                </span>
                <span className="text-xs font-black text-neutral-900">
                  TRON Blockchain (TRC-20)
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                Active & Monitored
              </span>
            </div>

            {/* QR Code & Address Display */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center space-y-3">
              {/* QR Code visual box */}
              <div className="inline-flex p-3 bg-white rounded-2xl shadow-xs border border-neutral-200/70">
                <div className="w-28 h-28 relative flex items-center justify-center bg-neutral-900 rounded-xl overflow-hidden p-2">
                  {/* Stylized QR Matrix Pattern */}
                  <div className="grid grid-cols-5 gap-1 w-full h-full p-1 opacity-90">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`rounded-[2px] ${
                          (i % 2 === 0 || i % 7 === 0 || i === 0 || i === 4 || i === 20 || i === 24)
                            ? 'bg-amber-400' 
                            : 'bg-neutral-800'
                        }`} 
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="px-1.5 py-0.5 rounded bg-white text-neutral-950 font-black text-[9px] shadow-sm">
                      TRX
                    </span>
                  </div>
                </div>
              </div>

              {/* Deposit Address Box with 1-Click Copy */}
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block mb-1">
                  Your USDT TRC-20 Deposit Address
                </span>
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-neutral-200/90 shadow-2xs">
                  <span className="text-[11px] font-mono text-neutral-800 truncate flex-1 text-left px-1 font-semibold select-all">
                    {DEPOSIT_TRX_ADDRESS}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Deposit Amount Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                  Amount to Credit (USDT)
                </label>
                <span className="text-[11px] text-neutral-400 font-medium">
                  Min: 10 USDT
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-black text-sm">$</span>
                <input
                  type="number"
                  step="any"
                  min="10"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 pl-8 pr-16 text-base font-black text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-neutral-500 bg-neutral-200/60 px-1.5 py-0.5 rounded">
                  USDT
                </span>
              </div>
            </div>

            {/* Quick Amount Selectors */}
            <div className="grid grid-cols-4 gap-1.5">
              {[100, 500, 1000, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDepositAmount(amt.toString())}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    depositAmount === amt.toString()
                      ? 'bg-amber-400 border-amber-400 text-neutral-950'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  +${amt}
                </button>
              ))}
            </div>

            {/* Summary Breakdown */}
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs space-y-1 text-neutral-600">
              <div className="flex justify-between">
                <span>TRON Gas / Handling Fee</span>
                <span className="font-bold text-emerald-600">0.00 USDT (Zero Fee)</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 pt-1 border-t border-neutral-200/60">
                <span>Account Credit</span>
                <span className="text-amber-600 font-black">${parseFloat(depositAmount) || 0} USDT</span>
              </div>
            </div>

            {/* Confirm Deposit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-sm shadow-md shadow-amber-400/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Confirm USDT Deposit</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ================= TAB 2: WITHDRAW USDT TRX ================= */}
        {activeTab === 'withdraw' && (
          <form onSubmit={handleWithdraw} className="space-y-4">
            
            {/* TRON Network Badge */}
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                  Withdrawal Network
                </span>
                <span className="text-xs font-black text-neutral-900">
                  TRON Blockchain (TRC-20)
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/70">
                USDT TRX Rail
              </span>
            </div>

            {/* Recipient TRON Address */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Recipient USDT (TRC-20) Wallet Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  placeholder="e.g. TLvNf7Mqk1R76wJ3r9xY5E8bUqR1yXz2A4"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 px-3 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all font-semibold"
                />
              </div>
              <span className="text-[10px] text-neutral-400 block mt-1">
                Must be a valid TRON address starting with &apos;T&apos;
              </span>
            </div>

            {/* Withdraw Amount */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                  Withdrawal Amount (USDT)
                </label>
                <span className="text-[11px] text-neutral-500 font-semibold flex items-center gap-1">
                  <Wallet className="w-3 h-3 text-amber-500" />
                  Avail: ${currentBalance.toLocaleString()}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-black text-sm">$</span>
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 pl-8 pr-16 text-base font-black text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-neutral-500 bg-neutral-200/60 px-1.5 py-0.5 rounded">
                  USDT
                </span>
              </div>
            </div>

            {/* Preset percentage shortcuts */}
            <div className="grid grid-cols-4 gap-1.5">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handlePercentageClick(pct)}
                  className="py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-all cursor-pointer active:scale-95 border border-neutral-200/60"
                >
                  {pct === 100 ? 'MAX' : `${pct}%`}
                </button>
              ))}
            </div>

            {/* Breakdown */}
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs space-y-1 text-neutral-600">
              <div className="flex justify-between">
                <span>TRON Network Gas Fee</span>
                <span className="font-bold text-emerald-600">0.00 USDT (Subsidized)</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Transfer Time</span>
                <span className="font-semibold text-neutral-700">~1 - 3 Minutes</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 pt-1 border-t border-neutral-200/60">
                <span>You Will Receive</span>
                <span className="text-rose-600 font-black">${parseFloat(withdrawAmount) || 0} USDT</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-sm shadow-md shadow-amber-400/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  <span>Withdraw USDT (TRX)</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-3.5 text-center flex items-center justify-center gap-1.5 text-[10px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>TRC-20 Protocol • Direct TRON Blockchain Settlement</span>
        </div>
      </div>
    </div>
  );
}
