'use client';

import React, { useState } from 'react';
import { BotSymbolConfig, DerivTickData } from '@/types/trading';
import { 
  Bot, 
  CheckCircle2, 
  Activity, 
  Zap, 
  Power, 
  TrendingUp, 
  Clock, 
  Layers, 
  Radio, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AdminBotViewProps {
  availableSymbols: BotSymbolConfig[];
  activeSymbolId: string;
  onSelectSymbol: (symbolId: string) => void;
  derivData: DerivTickData;
  activeBotsCount: number;
  onStopAllBots: () => void;
}

export function AdminBotView({
  availableSymbols,
  activeSymbolId,
  onSelectSymbol,
  derivData,
  activeBotsCount,
  onStopAllBots,
}: AdminBotViewProps) {
  const [filterCategory, setFilterCategory] = useState<'all' | 'volatility' | 'crash_boom' | 'step' | 'jump'>('all');

  const activeSymbolObj = availableSymbols.find((s) => s.id === activeSymbolId) || availableSymbols[0];

  const filteredSymbols = availableSymbols.filter((s) => {
    if (filterCategory === 'all') return true;
    return s.category === filterCategory;
  });

  return (
    <div className="space-y-4">
      {/* Active Symbol Command Card */}
      <div className="bg-neutral-900 text-white rounded-3xl p-5 sm:p-6 border border-neutral-800 shadow-md relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-lg shadow-amber-400/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                  Global Bot Trading Symbol
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE DERIV STREAM
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                {activeSymbolObj.name}
              </h2>
              <div className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                <span className="font-mono font-bold text-amber-400">{activeSymbolObj.symbol}</span>
                <span>•</span>
                <span>Tick: {activeSymbolObj.tickSpeed}</span>
                <span>•</span>
                <span>Category: {activeSymbolObj.category.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeBotsCount > 0 ? (
              <button
                type="button"
                onClick={onStopAllBots}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Power className="w-4 h-4" />
                <span>Halt Active Bots ({activeBotsCount})</span>
              </button>
            ) : (
              <div className="px-3.5 py-1.5 rounded-xl bg-neutral-800 text-neutral-400 text-xs font-medium border border-neutral-700 flex items-center gap-1.5">
                <Power className="w-3.5 h-3.5 text-neutral-500" />
                <span>No user bots running</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Market Bar for Selected Symbol */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/90 backdrop-blur-xs">
          <div>
            <div className="text-[10px] uppercase font-semibold text-neutral-400">Live Quote</div>
            <div className="text-lg font-mono font-black text-amber-400 mt-0.5">
              ${derivData.quote.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-emerald-400">Deriv Feed Active</div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-semibold text-neutral-400">Bid / Ask</div>
            <div className="text-xs font-mono font-bold text-neutral-300 mt-1">
              ${derivData.bid.toLocaleString()} / ${derivData.ask.toLocaleString()}
            </div>
            <div className="text-[10px] text-neutral-500">Spread: ${derivData.spread}</div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-semibold text-neutral-400">Engine Interval</div>
            <div className="text-sm font-bold text-neutral-200 mt-0.5">
              {activeSymbolObj.tickSpeed}
            </div>
            <div className="text-[10px] text-neutral-400">Real-time simulation</div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-semibold text-neutral-400">Platform Deployment</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Broadcast to all bots</span>
            </div>
            <div className="text-[10px] text-neutral-500">Global setting</div>
          </div>
        </div>
      </div>

      {/* Symbol Selection Section */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 tracking-tight flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Deriv Trading Symbols Catalog</span>
            </h3>
            <p className="text-xs text-neutral-500">
              Select the active symbol that automated trading bots execute orders on.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                filterCategory === 'all' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              All ({availableSymbols.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('volatility')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                filterCategory === 'volatility' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Volatility
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('crash_boom')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                filterCategory === 'crash_boom' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Crash / Boom
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('step')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                filterCategory === 'step' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Step Index
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('jump')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                filterCategory === 'jump' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Jump Index
            </button>
          </div>
        </div>

        {/* Symbol Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSymbols.map((sym) => {
            const isCurrent = sym.id === activeSymbolId;

            return (
              <div
                key={sym.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-amber-50/50 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                    : 'bg-white border-neutral-200/80 hover:border-neutral-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-black text-neutral-900">
                        {sym.symbol}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600">
                        {sym.category}
                      </span>
                    </div>
                    <div className="font-bold text-neutral-900 text-xs mt-0.5">
                      {sym.name}
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-neutral-950 shadow-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      ACTIVE
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-neutral-500 line-clamp-2 mb-3">
                  {sym.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Base Price</span>
                    <span className="font-mono font-bold text-neutral-900">
                      ${sym.basePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div>
                    {isCurrent ? (
                      <span className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-amber-500" />
                        In Use
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectSymbol(sym.id)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Select</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
