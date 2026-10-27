'use client';

import React, { useState } from 'react';
import { useTrading } from '@/context/TradingContext';
import { 
  Building2, 
  Layers, 
  Percent, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Square, 
  Zap, 
  RefreshCw, 
  Key, 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  EyeOff,
  Sliders,
  Check
} from 'lucide-react';

export function AdminMasterPoolView() {
  const {
    masterDerivAccount,
    updateMasterDerivAccount,
    userProfitReturnRate,
    setUserProfitReturnRate,
    activePoolParticipants,
    totalPoolStake,
    masterTrades,
    executeMasterTrade,
    derivData,
    adminSelectedSymbol,
    availableBotSymbols,
    adminStopUserBot,
  } = useTrading();

  // Local state for Master Deriv Account modal/editor
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);
  const [editAccountId, setEditAccountId] = useState(masterDerivAccount.accountId);
  const [editToken, setEditToken] = useState(masterDerivAccount.token);
  const [editServer, setEditServer] = useState(masterDerivAccount.server);
  const [editBalance, setEditBalance] = useState(masterDerivAccount.balance.toString());
  const [showToken, setShowToken] = useState(false);

  // Return rate slider/input state
  const [selectedRate, setSelectedRate] = useState<number>(userProfitReturnRate);
  const [isRateSaved, setIsRateSaved] = useState(false);

  // Active symbol object
  const activeSymbolObj = availableBotSymbols.find((s) => s.id === adminSelectedSymbol) || availableBotSymbols[0];

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const balNum = parseFloat(editBalance);
    updateMasterDerivAccount({
      accountId: editAccountId.trim(),
      token: editToken.trim(),
      server: editServer.trim(),
      balance: isNaN(balNum) ? masterDerivAccount.balance : balNum,
      isConnected: true,
    });
    setIsEditAccountOpen(false);
  };

  const handleApplyReturnRate = (rate: number) => {
    setSelectedRate(rate);
    setUserProfitReturnRate(rate);
    setIsRateSaved(true);
    setTimeout(() => setIsRateSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Mechanism Overview */}
      <div className="bg-neutral-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-neutral-800 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-md shadow-amber-400/20 shrink-0">
              <Building2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">
                  Master Deriv PAMM Account &amp; Copy-Pool
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SINGLE GATEWAY ACTIVE
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
                The platform operates strictly through your single admin Deriv account. When any user starts their bot, their stake is pooled. Signals place a single consolidated trade. On WIN, users receive <strong>{userProfitReturnRate}% return</strong>; on LOSS, their stake is deducted from balance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsEditAccountOpen(true)}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Configure Deriv Gateway</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Institutional Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Master Deriv Account */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Main Admin Deriv
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </span>
          </div>
          <div className="text-xl font-black text-neutral-900 font-mono tracking-tight">
            {masterDerivAccount.accountId}
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-500 mt-1">
            <span>Server: {masterDerivAccount.server}</span>
            <span className="font-bold text-neutral-800 font-mono">${masterDerivAccount.balance.toLocaleString()}</span>
          </div>
        </div>

        {/* Card 2: Total Pooled Stake */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Aggregated Stake
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {activePoolParticipants.length} Running Bots
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 tracking-tight">
            ${totalPoolStake.toLocaleString()} <span className="text-xs text-neutral-400 font-normal">USDT</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            Placed as single Deriv trade
          </p>
        </div>

        {/* Card 3: User Profit Return Rate */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              User Profit Return
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Win Rate Payout
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 tracking-tight">
            {userProfitReturnRate}% <span className="text-xs text-neutral-400 font-normal">of stake</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            Loss deducts 100% of user stake
          </p>
        </div>

        {/* Card 4: Target Bot Asset */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Deriv Stream Asset
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-mono">
              {activeSymbolObj.symbol}
            </span>
          </div>
          <div className="text-base font-black text-neutral-900 truncate tracking-tight">
            {activeSymbolObj.name}
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-500 mt-1 font-mono">
            <span>Price: ${derivData.quote.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className="text-emerald-600 font-bold">1s Ticks</span>
          </div>
        </div>
      </div>

      {/* 3. Admin Profit Return Percentage Setup Control */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">
                User Profit Return Percentage (%) Setup
              </h3>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Configure the exact return percentage credited to participating users when the master Deriv trade wins.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isRateSaved && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                Updated &amp; Active!
              </span>
            )}
            <div className="text-xl font-black text-neutral-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
              {selectedRate}%
            </div>
          </div>
        </div>

        {/* Quick Percentage Presets */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[65, 70, 75, 80, 85, 90, 95, 100].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => handleApplyReturnRate(rate)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedRate === rate
                    ? 'bg-amber-400 text-neutral-950 shadow-sm shadow-amber-400/20 scale-105'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
                }`}
              >
                {rate}% Return
              </button>
            ))}
          </div>

          {/* Interactive Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              <span>Conservative (50%)</span>
              <span>Standard (85%)</span>
              <span>Maximum (100%)</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="1"
              value={selectedRate}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setSelectedRate(val);
                setUserProfitReturnRate(val);
              }}
              className="w-full h-2.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Transparent Live Calculation Scenario Box */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-700 space-y-1.5">
            <div className="font-bold text-neutral-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Realtime Settlement Rule with {selectedRate}% Return Rate:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-emerald-800">
                <span className="font-bold block text-emerald-700 uppercase text-[10px]">On Trade WIN:</span>
                User with $500 stake earns: +${(500 * (selectedRate / 100)).toFixed(2)} profit (+{selectedRate}%)
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-rose-200 text-rose-800">
                <span className="font-bold block text-rose-700 uppercase text-[10px]">On Trade LOSS:</span>
                User with $500 stake loses: -$500.00 stake deducted from balance (-100%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Instant Master Execution Controls & Manual Triggers */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-neutral-100">
          <div>
            <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Master Signal Dispatches &amp; Test Execution
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              The automated bot engine executes trades continuously when bots are running. You can also force execute a trade immediately below.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-medium">Pooled Capital:</span>
            <span className="text-sm font-black text-neutral-900 font-mono">${totalPoolStake.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => executeMasterTrade()}
            disabled={activePoolParticipants.length === 0}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-amber-400/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-3.5 h-3.5 fill-neutral-950" />
            <span>⚡ Trigger Master Signal (Consolidated Fill)</span>
          </button>

          <button
            type="button"
            onClick={() => executeMasterTrade('win')}
            disabled={activePoolParticipants.length === 0}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Force WIN (+{userProfitReturnRate}% Profit Distribution)</span>
          </button>

          <button
            type="button"
            onClick={() => executeMasterTrade('loss')}
            disabled={activePoolParticipants.length === 0}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Force LOSS (Stake Deduction)</span>
          </button>
        </div>

        {activePoolParticipants.length === 0 && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>No user trading bots are currently active. Turn ON a user bot from the user app or user list to start pooling stakes.</span>
          </div>
        )}
      </div>

      {/* 5. Live Active Pool Participants Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">
              Active Pool Participants ({activePoolParticipants.length})
            </h3>
          </div>
          <span className="text-xs text-neutral-400 font-medium">
            Aggregated Total: <strong className="text-neutral-900 font-mono">${totalPoolStake.toLocaleString()}</strong>
          </span>
        </div>

        {activePoolParticipants.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400 italic bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            No active participants in the pool right now.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200/80 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  <th className="pb-2.5 font-bold">Trader / Account ID</th>
                  <th className="pb-2.5 font-bold">Individual Stake</th>
                  <th className="pb-2.5 font-bold">Pool Share %</th>
                  <th className="pb-2.5 font-bold">Expected Win (+{userProfitReturnRate}%)</th>
                  <th className="pb-2.5 font-bold">Risk on Loss</th>
                  <th className="pb-2.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {activePoolParticipants.map((p) => {
                  const winProfit = (p.stake * (userProfitReturnRate / 100)).toFixed(2);
                  return (
                    <tr key={p.userId} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-neutral-900">{p.userName}</div>
                        <div className="font-mono text-[10px] text-amber-600 font-bold">{p.userAccountId}</div>
                      </td>
                      <td className="py-3 font-mono font-bold text-neutral-900">
                        ${p.stake.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700">
                          {p.sharePercent}%
                        </span>
                      </td>
                      <td className="py-3 font-mono font-bold text-emerald-600">
                        +${winProfit}
                      </td>
                      <td className="py-3 font-mono font-bold text-rose-600">
                        -${p.stake.toLocaleString()}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => adminStopUserBot(p.userId)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Stop Bot
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. Master Pooled Trades Audit History */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">
              Master Deriv Account Executed Trades History
            </h3>
          </div>
          <span className="text-xs text-neutral-400 font-medium">
            Total Logged: <strong>{masterTrades.length}</strong>
          </span>
        </div>

        {masterTrades.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400 italic bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            No master trades executed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200/80 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  <th className="pb-2.5 font-bold">Contract / Time</th>
                  <th className="pb-2.5 font-bold">Symbol</th>
                  <th className="pb-2.5 font-bold">Direction</th>
                  <th className="pb-2.5 font-bold">Aggregated Stake</th>
                  <th className="pb-2.5 font-bold">Outcome</th>
                  <th className="pb-2.5 font-bold">Return Rate</th>
                  <th className="pb-2.5 font-bold text-right">Total User Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {masterTrades.map((t) => {
                  const isWin = t.outcome === 'win';
                  const formattedTime = new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  return (
                    <tr key={t.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3">
                        <div className="font-mono font-bold text-neutral-900">{t.contractId}</div>
                        <div className="text-[10px] text-neutral-400">{formattedTime}</div>
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-neutral-900">{t.symbol}</span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          t.side === 'buy' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {t.side}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-bold text-neutral-900">
                        ${t.totalStake.toLocaleString()} <span className="text-[10px] text-neutral-400">({t.participantCount} bots)</span>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isWin 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {isWin ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {t.outcome}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-neutral-700">
                        {t.returnPercent}%
                      </td>
                      <td className={`py-3 text-right font-mono font-bold ${
                        isWin ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {isWin ? '+' : ''}${t.userPayoutTotal.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 7. Edit Master Deriv Account Modal */}
      {isEditAccountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">
                  Master Deriv Gateway Settings
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditAccountOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Deriv Master Login ID
                </label>
                <input
                  type="text"
                  required
                  value={editAccountId}
                  onChange={(e) => setEditAccountId(e.target.value)}
                  placeholder="CR-5892341"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Deriv Master API Token
                </label>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    required
                    value={editToken}
                    onChange={(e) => setEditToken(e.target.value)}
                    placeholder="d19..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 pr-10 font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Deriv WebSocket Gateway Server
                </label>
                <input
                  type="text"
                  required
                  value={editServer}
                  onChange={(e) => setEditServer(e.target.value)}
                  placeholder="Deriv-Server-01"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Admin Deriv Account Balance ($)
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={editBalance}
                  onChange={(e) => setEditBalance(e.target.value)}
                  placeholder="54820.00"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditAccountOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black transition-all cursor-pointer shadow-sm shadow-amber-400/20"
                >
                  Save Gateway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
