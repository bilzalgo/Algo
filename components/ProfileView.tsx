'use client';

import React, { useState } from 'react';
import { useTrading } from '@/context/TradingContext';
import { 
  User as UserIcon, 
  ShieldCheck, 
  Award, 
  LogOut, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Download, 
  CreditCard,
  Mail
} from 'lucide-react';

export function ProfileView() {
  const { 
    user, 
    logout, 
    orders, 
    totalPnl, 
    totalPnlPercent, 
    openPaymentModal,
    setToastMessage 
  } = useTrading();

  const [orderFilter, setOrderFilter] = useState<'all' | 'buy' | 'sell'>('all');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const filteredOrders = orders.filter((order) => {
    if (orderFilter === 'all') return true;
    return order.side === orderFilter;
  });

  const totalVolume = orders.reduce((sum, o) => sum + o.total, 0);
  const winRate = orders.length > 0 ? 67.5 : 0;

  const handleExport = () => {
    if (orders.length === 0) {
      setToastMessage('No trades to export yet.');
      return;
    }
    const headers = 'Order ID,Symbol,Side,Type,Amount,Price,Total USD,Status,Date\n';
    const rows = orders.map((o) => 
      `${o.id},${o.symbol},${o.side},${o.type},${o.amount},${o.price},${o.total},${o.status},${new Date(o.timestamp).toISOString()}`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AuraTrade_Statement_${user?.username || 'Trader'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMessage('Trading statement exported to CSV!');
  };

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

            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                KYC Level 2 Verified
              </span>
              <span className="text-[10px] text-neutral-400">
                Tier: {user?.tier || 'Pro'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Pills */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => openPaymentModal('deposit')}
            className="py-2 px-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-xs shadow-xs shadow-amber-400/20 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Deposit</span>
          </button>

          <button
            type="button"
            onClick={() => openPaymentModal('withdraw')}
            className="py-2 px-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            <span>Withdraw</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="py-2 px-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs border border-neutral-200 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neutral-600" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 2. Trader Performance Stats */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-neutral-200/90">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Trading Performance
            </h2>
          </div>
          <span className="text-[10px] font-semibold text-neutral-400">
            All-Time Summary
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70">
            <div className="text-[11px] font-semibold text-neutral-500">Net Return</div>
            <div className={`text-base font-black mt-0.5 ${totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString()}
            </div>
            <div className={`text-[10px] font-bold ${totalPnlPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {totalPnlPercent >= 0 ? '+' : ''}{totalPnlPercent}% Total ROI
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70">
            <div className="text-[11px] font-semibold text-neutral-500">Win Rate</div>
            <div className="text-base font-black text-neutral-900 mt-0.5">
              {winRate}%
            </div>
            <div className="text-[10px] font-semibold text-emerald-600">
              Institutional Grade
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70">
            <div className="text-[11px] font-semibold text-neutral-500">Orders Executed</div>
            <div className="text-base font-black text-neutral-900 mt-0.5">
              {orders.length}
            </div>
            <div className="text-[10px] font-semibold text-neutral-400">
              Simulated Fills
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70">
            <div className="text-[11px] font-semibold text-neutral-500">Total Volume</div>
            <div className="text-base font-black text-neutral-900 mt-0.5">
              ${totalVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-[10px] font-semibold text-neutral-400">
              USD Traded
            </div>
          </div>
        </div>
      </div>

      {/* 3. Trade Orders History */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-neutral-200/90">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Execution Ledger ({filteredOrders.length})
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex bg-neutral-100 p-0.5 rounded-xl border border-neutral-200/60">
            {(['all', 'buy', 'sell'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setOrderFilter(filter)}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-lg capitalize transition-all cursor-pointer ${
                  orderFilter === filter
                    ? 'bg-amber-400 text-neutral-950 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-6 px-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            <p className="text-xs text-neutral-500 font-medium">
              No orders found in this category.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {filteredOrders.map((ord) => {
              const isBuy = ord.side === 'buy';
              return (
                <div
                  key={ord.id}
                  className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isBuy ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isBuy ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-neutral-900">{ord.symbol}</span>
                        <span className={`text-[9px] font-black uppercase px-1 rounded ${
                          isBuy ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {ord.side}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {new Date(ord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {ord.type}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-neutral-900">
                      ${ord.total.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      {ord.amount} @ ${ord.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Logout / Session Security Card */}
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
                className="px-2.5 py-1.5 rounded-xl bg-neutral-100 text-neutral-600 text-xs font-semibold"
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
