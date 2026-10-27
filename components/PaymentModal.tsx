'use client';

import React, { useState } from 'react';
import { useTrading } from '@/context/TradingContext';
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CreditCard, 
  Wallet, 
  Building2, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export function PaymentModal() {
  const { 
    isPaymentModalOpen, 
    closePaymentModal, 
    paymentModalTab, 
    user, 
    depositFunds, 
    withdrawFunds 
  } = useTrading();

  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>(paymentModalTab || 'deposit');
  const [depositAmount, setDepositAmount] = useState('1000');
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [depositMethod, setDepositMethod] = useState<'crypto' | 'card' | 'bank'>('crypto');
  const [withdrawMethod, setWithdrawMethod] = useState<'crypto' | 'bank'>('crypto');
  const [destinationAddress, setDestinationAddress] = useState('TX9zQ...7v8K');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isPaymentModalOpen) return null;

  const currentBalance = user?.cashBalance || 0;

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg('Please specify a deposit amount greater than $0.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      depositFunds(amt);
      setIsProcessing(false);
      closePaymentModal();
    }, 450);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg('Please specify a withdrawal amount greater than $0.');
      return;
    }
    if (amt > currentBalance) {
      setErrorMsg(`Insufficient balance. Available: $${currentBalance.toLocaleString()}`);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const res = withdrawFunds(amt, withdrawMethod === 'crypto' ? destinationAddress : 'Bank Account');
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-950/50 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-neutral-200 animate-in slide-in-from-bottom-8 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center shadow-xs shadow-amber-400/30">
              <CreditCard className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-neutral-900 tracking-tight">
                Payment Center
              </h2>
              <p className="text-[11px] text-neutral-400 font-medium">
                Deposit and Withdraw funds safely
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closePaymentModal}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Deposit / Withdraw Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 my-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab('deposit');
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'deposit'
                ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/25'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Deposit</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('withdraw');
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'withdraw'
                ? 'bg-neutral-900 text-white shadow-md'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            <span>Withdraw</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: DEPOSIT */}
        {activeTab === 'deposit' && (
          <form onSubmit={handleDeposit} className="space-y-4">
            {/* Method Picker */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setDepositMethod('crypto')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    depositMethod === 'crypto'
                      ? 'bg-amber-50 border-amber-400 text-neutral-950 font-bold'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <QrCode className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                  <span className="text-[10px] block">USDT / Crypto</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDepositMethod('card')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    depositMethod === 'card'
                      ? 'bg-amber-50 border-amber-400 text-neutral-950 font-bold'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                  <span className="text-[10px] block">Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDepositMethod('bank')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    depositMethod === 'bank'
                      ? 'bg-amber-50 border-amber-400 text-neutral-950 font-bold'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                  <span className="text-[10px] block">Bank Wire</span>
                </button>
              </div>
            </div>

            {/* Deposit Amount */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Deposit Amount (USD)
                </label>
                <span className="text-[11px] text-neutral-500">
                  Current: ${currentBalance.toLocaleString()}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">$</span>
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 pl-8 pr-3 text-base font-black text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-1.5">
              {[500, 1000, 2500, 5000].map((amt) => (
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

            {/* Breakdown */}
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs space-y-1 text-neutral-600">
              <div className="flex justify-between">
                <span>Network / Processing Fee</span>
                <span className="font-bold text-emerald-600">$0.00 (Free)</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 pt-1 border-t border-neutral-200/60">
                <span>Total Added to Balance</span>
                <span className="text-amber-600">${parseFloat(depositAmount) || 0}</span>
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
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Confirm Deposit</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: WITHDRAW */}
        {activeTab === 'withdraw' && (
          <form onSubmit={handleWithdraw} className="space-y-4">
            {/* Withdrawal Method */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Withdrawal Destination
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setWithdrawMethod('crypto')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    withdrawMethod === 'crypto'
                      ? 'bg-neutral-900 border-neutral-900 text-white font-bold'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <QrCode className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                  <span className="text-[10px] block">USDT (TRC20)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWithdrawMethod('bank')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    withdrawMethod === 'bank'
                      ? 'bg-neutral-900 border-neutral-900 text-white font-bold'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                  <span className="text-[10px] block">Bank Account</span>
                </button>
              </div>
            </div>

            {/* Destination Address Field */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                {withdrawMethod === 'crypto' ? 'USDT TRC20 Wallet Address' : 'Bank IBAN / Account Number'}
              </label>
              <input
                type="text"
                required
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                placeholder={withdrawMethod === 'crypto' ? 'T...' : 'US89370...'}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Withdraw Amount */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Withdrawal Amount (USD)
                </label>
                <span className="text-[11px] text-neutral-500">
                  Available: ${currentBalance.toLocaleString()}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">$</span>
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 pl-8 pr-3 text-base font-black text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Preset percentage buttons */}
            <div className="grid grid-cols-4 gap-1.5">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handlePercentageClick(pct)}
                  className="py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-all cursor-pointer active:scale-95 border border-neutral-200/50"
                >
                  {pct === 100 ? 'MAX' : `${pct}%`}
                </button>
              ))}
            </div>

            {/* Breakdown */}
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs space-y-1 text-neutral-600">
              <div className="flex justify-between">
                <span>Estimated Gas / Bank Fee</span>
                <span className="font-bold text-emerald-600">$0.00 (Instant Wire)</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 pt-1 border-t border-neutral-200/60">
                <span>Net Transfer Amount</span>
                <span className="text-rose-600">${parseFloat(withdrawAmount) || 0}</span>
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
                  <span>Execute Withdrawal</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-3.5 text-center flex items-center justify-center gap-1.5 text-[10px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted 256-bit Instant Settlement Protocol</span>
        </div>
      </div>
    </div>
  );
}
