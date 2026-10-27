'use client';

import React, { useState } from 'react';
import { useTrading } from '@/context/TradingContext';
import { Asset } from '@/types/trading';
import { 
  X, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Zap, 
  Wallet,
  AlertCircle
} from 'lucide-react';

interface TradeModalDialogProps {
  asset: Asset;
  initialSide: 'buy' | 'sell';
}

function TradeModalDialog({ asset, initialSide }: TradeModalDialogProps) {
  const { 
    closeTradeModal, 
    user, 
    executeOrder, 
    positions 
  } = useTrading();

  const [side, setSide] = useState<'buy' | 'sell'>(initialSide);
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [amountUsd, setAmountUsd] = useState<string>('5000');
  const [limitPrice, setLimitPrice] = useState<string>(asset.price.toString());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const currentPrice = asset.price;
  const executionPrice = orderType === 'limit' && parseFloat(limitPrice) > 0 ? parseFloat(limitPrice) : currentPrice;
  const parsedUsd = parseFloat(amountUsd) || 0;
  const assetUnits = executionPrice > 0 ? parsedUsd / executionPrice : 0;

  // Available holdings for sell
  const existingHolding = positions.find((p) => p.assetId === asset.id && p.side === 'buy');
  const availableUnitsToSell = existingHolding ? existingHolding.amount : 0;
  const availableUsdBalance = user?.cashBalance || 0;

  const handlePercentageClick = (pct: number) => {
    if (side === 'buy') {
      const budget = (availableUsdBalance * pct) / 100;
      setAmountUsd(Math.floor(budget).toString());
    } else {
      const units = (availableUnitsToSell * pct) / 100;
      const usdVal = units * executionPrice;
      setAmountUsd(Math.floor(usdVal).toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (parsedUsd <= 0) {
      setErrorMsg('Please specify an amount greater than 0');
      return;
    }

    if (side === 'buy' && parsedUsd > availableUsdBalance) {
      setErrorMsg(`Insufficient balance. Available: $${availableUsdBalance.toLocaleString()}`);
      return;
    }

    if (side === 'sell' && assetUnits > availableUnitsToSell) {
      setErrorMsg(`Insufficient holdings. Available: ${availableUnitsToSell.toFixed(4)} ${asset.symbol}`);
      return;
    }

    setIsExecuting(true);

    setTimeout(() => {
      const result = executeOrder({
        assetId: asset.id,
        side,
        type: orderType,
        amount: Number(assetUnits.toFixed(4)),
        price: executionPrice,
      });

      setIsExecuting(false);

      if (result.success) {
        closeTradeModal();
      } else {
        setErrorMsg(result.message);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-950/50 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-neutral-200 animate-in slide-in-from-bottom-8 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Asset & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs text-white shadow-xs"
              style={{ backgroundColor: asset.color }}
            >
              {asset.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-neutral-900">{asset.symbol}</span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase bg-neutral-100 px-1.5 py-0.5 rounded">
                  {asset.category}
                </span>
              </div>
              <div className="text-xs text-neutral-500 font-semibold">
                ${currentPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: currentPrice > 10 ? 2 : 4,
                })}
                <span className={`ml-1.5 font-bold ${asset.change24h >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={closeTradeModal}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Side Tabs: BUY / SELL */}
        <div className="grid grid-cols-2 gap-2 my-4">
          <button
            type="button"
            onClick={() => {
              setSide('buy');
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              side === 'buy'
                ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/25'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>BUY (Long)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSide('sell');
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              side === 'sell'
                ? 'bg-neutral-900 text-white shadow-md'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>SELL (Short)</span>
          </button>
        </div>

        {/* Order Type: Market / Limit */}
        <div className="flex items-center justify-between p-1 bg-neutral-100 rounded-xl mb-4 border border-neutral-200/60">
          <button
            type="button"
            onClick={() => setOrderType('market')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              orderType === 'market'
                ? 'bg-white text-neutral-950 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Market Order (Instant)
          </button>
          <button
            type="button"
            onClick={() => setOrderType('limit')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              orderType === 'limit'
                ? 'bg-white text-neutral-950 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Limit Order
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Limit Price Input if Limit Order */}
          {orderType === 'limit' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Limit Target Price (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">$</span>
                <input
                  type="number"
                  step="any"
                  required
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-8 pr-3 text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
          )}

          {/* Amount in USD */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Order Value (USD)
              </label>
              <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                <Wallet className="w-3 h-3 text-amber-500" />
                {side === 'buy'
                  ? `Avail: $${availableUsdBalance.toLocaleString()}`
                  : `Held: ${availableUnitsToSell.toFixed(4)} ${asset.symbol.split('/')[0]}`}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">$</span>
              <input
                type="number"
                step="any"
                required
                placeholder="5000"
                value={amountUsd}
                onChange={(e) => setAmountUsd(e.target.value)}
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

          {/* Order Summary Breakdown Box */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/70 space-y-1.5 text-xs">
            <div className="flex justify-between text-neutral-500">
              <span>Estimated Quantity</span>
              <span className="font-bold text-neutral-900">
                {assetUnits.toFixed(4)} {asset.symbol.split('/')[0]}
              </span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Execution Price</span>
              <span className="font-semibold text-neutral-800">
                ${executionPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Simulated Fee</span>
              <span className="font-bold text-emerald-600">$0.00 (Zero Fee)</span>
            </div>
            <div className="pt-2 border-t border-neutral-200/60 flex justify-between font-black text-sm text-neutral-900">
              <span>Total Cost</span>
              <span className="text-amber-600">${parsedUsd.toLocaleString()}</span>
            </div>
          </div>

          {/* Primary Execution Yellow Button */}
          <button
            type="submit"
            disabled={isExecuting}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-sm shadow-lg shadow-amber-400/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isExecuting ? (
              <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Zap className="w-4 h-4 stroke-[2.5]" />
                <span>
                  Execute {side.toUpperCase()} {asset.symbol.split('/')[0]}
                </span>
              </>
            )}
          </button>
        </form>

        <div className="mt-3 text-center flex items-center justify-center gap-1.5 text-[10px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Paper Sandbox Mode • Instant Settlement Guaranteed</span>
        </div>
      </div>
    </div>
  );
}

export function TradeModal() {
  const { isTradeModalOpen, tradeModalAsset, initialTradeSide } = useTrading();

  if (!isTradeModalOpen || !tradeModalAsset) return null;

  return (
    <TradeModalDialog
      key={`${tradeModalAsset.id}_${initialTradeSide}_${isTradeModalOpen ? 'open' : 'closed'}`}
      asset={tradeModalAsset}
      initialSide={initialTradeSide}
    />
  );
}
