'use client';

import React, { useEffect, useRef } from 'react';
import { useTrading } from '@/context/TradingContext';
import { 
  Play, 
  Square, 
  Terminal, 
  Trash2, 
  Wallet,
  Zap,
  Activity
} from 'lucide-react';

export function HomeView() {
  const { 
    user, 
    botRunning, 
    toggleBot, 
    botStats, 
    botLogs, 
    clearBotLogs,
    riskSettings 
  } = useTrading();

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll console to bottom when new logs appear
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [botLogs]);

  const isProfit = botStats.pnl >= 0;

  return (
    <div className="space-y-3.5 pb-[58px] w-full flex flex-col justify-between min-h-[calc(100vh-125px)]">
      
      <div className="space-y-3.5">
        {/* 1. Account Balance Card with P/L, W, L, Rate */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-neutral-200/90 relative overflow-hidden w-full">
          {/* Soft yellow glow */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-amber-500" />
              Account Balance
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
              <span className={`w-1.5 h-1.5 rounded-full ${botRunning ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'}`} />
              {botRunning ? 'BOT ACTIVE' : 'BOT IDLE'}
            </span>
          </div>

          {/* Big Balance Number */}
          <div className="mb-3.5">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
              ${(user?.cashBalance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* P/L, W, L, Rate Metrics Row (All in Same Card) */}
          <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-neutral-100">
            {/* P/L */}
            <div className="bg-neutral-50 p-2 rounded-2xl border border-neutral-200/60 text-center">
              <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">P/L</div>
              <div className={`text-[11px] font-black mt-0.5 truncate flex items-center justify-center ${
                isProfit ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {isProfit ? '+' : ''}${botStats.pnl.toFixed(2)}
              </div>
            </div>

            {/* W (Wins) */}
            <div className="bg-neutral-50 p-2 rounded-2xl border border-neutral-200/60 text-center">
              <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">W</div>
              <div className="text-[11px] font-black text-emerald-600 mt-0.5">
                {botStats.wins}
              </div>
            </div>

            {/* L (Losses) */}
            <div className="bg-neutral-50 p-2 rounded-2xl border border-neutral-200/60 text-center">
              <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">L</div>
              <div className="text-[11px] font-black text-rose-600 mt-0.5">
                {botStats.losses}
              </div>
            </div>

            {/* Rate */}
            <div className="bg-neutral-50 p-2 rounded-2xl border border-neutral-200/60 text-center">
              <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Rate</div>
              <div className="text-[11px] font-black text-neutral-900 mt-0.5">
                {botStats.rate}%
              </div>
            </div>
          </div>
        </div>

        {/* 2. Single Card for Start and Stop Bot Button */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-neutral-200/90 w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                botRunning ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {botRunning ? <Activity className="w-4 h-4 animate-pulse" /> : <Zap className="w-4 h-4" />}
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Automated Bot Switch
                </h2>
                <p className="text-[10px] text-neutral-400 font-medium">
                  Stake: ${riskSettings.stake} • TP: +${riskSettings.profitTarget} • SL: -${riskSettings.lossTarget}
                </p>
              </div>
            </div>

            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
              botRunning 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-neutral-100 text-neutral-500'
            }`}>
              {botRunning ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* Start / Stop Button with Signature Yellow Accent */}
          <button
            type="button"
            onClick={toggleBot}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm tracking-wide transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer ${
              botRunning
                ? 'bg-neutral-900 hover:bg-neutral-800 text-white border-2 border-amber-400 shadow-amber-400/10'
                : 'bg-amber-400 hover:bg-amber-500 text-neutral-950 shadow-amber-400/30'
            }`}
          >
            {botRunning ? (
              <>
                <Square className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>STOP BOT</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-neutral-950 text-neutral-950" />
                <span>START BOT</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Trading Console Card: Full Wide screen page, joins with bottom navigation without space */}
      <div className="-mx-[12px] w-[calc(100%+24px)] bg-white rounded-t-3xl border-t border-x border-b-0 border-neutral-200/90 p-[12px] pb-1 shadow-xs mb-0 mt-4">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Trading Console Log
            </h3>
            {botRunning && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping ml-1" />
            )}
          </div>

          <button
            type="button"
            onClick={clearBotLogs}
            className="text-[10px] font-semibold text-neutral-400 hover:text-neutral-700 flex items-center gap-1 transition-colors cursor-pointer"
            title="Clear logs"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>

        {/* Console Box with Exactly 150px Height */}
        <div 
          className="w-full h-[150px] bg-neutral-950 text-neutral-200 rounded-2xl p-3 font-mono text-[11px] overflow-y-auto space-y-1 select-text scrollbar-thin scrollbar-thumb-neutral-700"
        >
          {botLogs.length === 0 ? (
            <div className="text-neutral-500 italic py-8 text-center text-[10px]">
              No logs yet. Press START BOT to begin streaming execution events.
            </div>
          ) : (
            botLogs.map((log) => {
              let color = 'text-neutral-300';
              if (log.type === 'win') color = 'text-emerald-400 font-bold';
              else if (log.type === 'loss') color = 'text-rose-400 font-bold';
              else if (log.type === 'alert') color = 'text-amber-400 font-bold';
              else if (log.type === 'system') color = 'text-neutral-400';

              return (
                <div key={log.id} className="leading-snug flex items-start gap-1.5">
                  <span className="text-neutral-500 shrink-0 text-[10px]">[{log.time}]</span>
                  <span className={color}>{log.message}</span>
                </div>
              );
            })
          )}
          <div ref={consoleEndRef} />
        </div>
      </div>

    </div>
  );
}
