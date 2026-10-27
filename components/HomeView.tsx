'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useTrading } from '@/context/TradingContext';
import { 
  Play, 
  Square, 
  Terminal, 
  Trash2, 
  Wallet,
  Zap,
  Activity,
  Copy,
  Sparkles
} from 'lucide-react';

export function HomeView() {
  const { 
    user, 
    botRunning, 
    toggleBot, 
    botStats, 
    botLogs, 
    clearBotLogs,
    riskSettings,
    setToastMessage,
    userProfitReturnRate,
    totalPoolStake,
    activePoolParticipants
  } = useTrading();

  const isProfit = botStats.pnl >= 0;


  return (
    <div className="space-y-3.5 pb-[58px] w-full flex flex-col justify-between min-h-[calc(100vh-125px)]">
      
      <div className="space-y-3.5">
        {/* 1. Account Balance Card with Enhanced Background Style & Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl p-5 w-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white shadow-xl border border-neutral-800/80 group"
        >
          {/* Animated Glowing Radial Ambient Mesh Backgrounds */}
          <motion.div 
            animate={{ 
              scale: [1, 1.25, 1],
              x: [0, 15, 0],
              y: [0, -10, 0]
            }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, -20, 0],
              y: [0, 15, 0]
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="absolute -bottom-16 -left-16 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" 
          />
          
          {/* Subtle Dynamic Scanline / Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

          {/* Shimmer Light Bar Beam sweeping across card */}
          <motion.div
            className="absolute -inset-full w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'linear', repeatDelay: 2 }}
          />

          {/* Header Row */}
          <div className="relative z-10 flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-400/10">
                <Wallet className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block leading-none">
                  Total Cash Balance
                </span>
                <span className="text-[11px] font-mono font-semibold text-amber-400 flex items-center gap-1 mt-0.5">
                  <span>{user?.accountId || 'GSQ-73835838'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const id = user?.accountId || 'GSQ-73835838';
                      if (navigator?.clipboard?.writeText) {
                        navigator.clipboard.writeText(id);
                        setToastMessage(`Account ID ${id} copied!`);
                      }
                    }}
                    className="hover:text-amber-300 transition-colors p-0.5 cursor-pointer"
                    title="Copy Account ID"
                  >
                    <Copy className="w-2.5 h-2.5" />
                  </button>
                </span>
              </div>
            </div>

            {/* Pulsing Bot Status Pill */}
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-neutral-900/90 border border-neutral-700/80 shadow-inner">
              <span className="relative flex h-2 w-2">
                {botRunning && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${botRunning ? 'bg-emerald-400' : 'bg-neutral-500'}`} />
              </span>
              <span className={botRunning ? 'text-emerald-400 tracking-wide font-black' : 'text-neutral-400'}>
                {botRunning ? 'BOT ACTIVE' : 'BOT IDLE'}
              </span>
            </div>
          </div>

          {/* Big Balance Number with Animated Pulse */}
          <div className="relative z-10 my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                ${(user?.cashBalance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                USDT TRX
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-0.5 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Realtime Settled Trading Capital</span>
            </p>
          </div>

          {/* Metrics Grid Row with Translucent Glass Pills */}
          <div className="relative z-10 grid grid-cols-4 gap-1.5 pt-3 border-t border-neutral-800/80">
            {/* P/L */}
            <div className="bg-neutral-900/80 backdrop-blur-md p-2 rounded-2xl border border-neutral-800 text-center hover:border-neutral-700 transition-colors">
              <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">P/L</div>
              <div className={`text-[11px] font-black mt-0.5 truncate flex items-center justify-center ${
                isProfit ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {isProfit ? '+' : ''}${botStats.pnl.toFixed(2)}
              </div>
            </div>

            {/* W (Wins) */}
            <div className="bg-neutral-900/80 backdrop-blur-md p-2 rounded-2xl border border-neutral-800 text-center hover:border-neutral-700 transition-colors">
              <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Wins</div>
              <div className="text-[11px] font-black text-emerald-400 mt-0.5">
                {botStats.wins}
              </div>
            </div>

            {/* L (Losses) */}
            <div className="bg-neutral-900/80 backdrop-blur-md p-2 rounded-2xl border border-neutral-800 text-center hover:border-neutral-700 transition-colors">
              <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Losses</div>
              <div className="text-[11px] font-black text-rose-400 mt-0.5">
                {botStats.losses}
              </div>
            </div>

            {/* Rate */}
            <div className="bg-neutral-900/80 backdrop-blur-md p-2 rounded-2xl border border-neutral-800 text-center hover:border-neutral-700 transition-colors">
              <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Win%</div>
              <div className="text-[11px] font-black text-amber-400 mt-0.5">
                {botStats.rate}%
              </div>
            </div>
          </div>
        </motion.div>

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
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Automated Bot Switch
                  </h2>
                  <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[9px] font-black uppercase">
                    Master Pool
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 font-medium mt-0.5">
                  {botRunning 
                    ? `Enrolled in Admin Deriv trade • +${userProfitReturnRate}% profit on win (Stake: $${riskSettings.stake})`
                    : `Pools into Admin Deriv trade • +${userProfitReturnRate}% profit on win (Stake: $${riskSettings.stake})`}
                </p>
              </div>
            </div>

            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
              botRunning 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-neutral-100 text-neutral-500'
            }`}>
              {botRunning ? 'ACTIVE' : 'IDLE'}
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

      {/* 3. Trading Console Flat Card (Using Same App Background Color) */}
      <div className="-mx-[12px] w-[calc(100%+24px)] bg-neutral-50 border-t border-neutral-200/80 p-[12px] pb-2 mb-0 mt-4">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-200/70">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
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

        {/* Flat Console Container - Same App Background, Values Appear from Top */}
        <div 
          className="w-full h-[160px] bg-neutral-50 border border-neutral-200/80 rounded-2xl p-3 font-mono text-[11px] overflow-y-auto space-y-1.5 select-text scrollbar-thin scrollbar-thumb-neutral-300"
        >
          {botLogs.length === 0 ? (
            <div className="text-neutral-400 italic py-8 text-center text-[10px]">
              No logs yet. Press START BOT to begin streaming execution events.
            </div>
          ) : (
            botLogs.map((log) => {
              let color = 'text-neutral-700';
              if (log.type === 'win') {
                color = 'text-emerald-700 font-bold';
              } else if (log.type === 'loss') {
                color = 'text-rose-700 font-bold';
              } else if (log.type === 'alert') {
                color = 'text-amber-800 font-bold';
              } else if (log.type === 'system') {
                color = 'text-neutral-500 font-medium';
              }

              return (
                <div key={log.id} className="leading-snug flex items-start gap-1.5 py-0.5 border-b border-neutral-200/40 last:border-0 animate-in fade-in duration-150">
                  <span className="text-neutral-400 shrink-0 text-[10px] font-medium">[{log.time}]</span>
                  <span className={color}>{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
