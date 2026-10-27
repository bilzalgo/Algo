'use client';

import React, { useState } from 'react';
import { useTrading } from '@/context/TradingContext';
import { 
  ShieldCheck, 
  DollarSign, 
  Target, 
  AlertTriangle, 
  Save, 
  CheckCircle2,
  Sparkles,
  Lock,
  Activity,
  Building2,
  Users
} from 'lucide-react';

export function ConfigureView() {
  const { 
    riskSettings, 
    updateRiskSettings,
    userProfitReturnRate,
    masterDerivAccount,
    totalPoolStake,
    activePoolParticipants,
    adminSelectedSymbol,
    availableBotSymbols
  } = useTrading();

  const [stake, setStake] = useState<string>(riskSettings.stake.toString());
  const [profitTarget, setProfitTarget] = useState<string>(riskSettings.profitTarget.toString());
  const [lossTarget, setLossTarget] = useState<string>(riskSettings.lossTarget.toString());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeSymbolObj = availableBotSymbols.find((s) => s.id === adminSelectedSymbol) || availableBotSymbols[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const stakeNum = parseFloat(stake);
    const profitNum = parseFloat(profitTarget);
    const lossNum = parseFloat(lossTarget);

    if (isNaN(stakeNum) || stakeNum <= 0) {
      setErrorMsg('Please enter a valid stake amount greater than $0.');
      return;
    }
    if (isNaN(profitNum) || profitNum <= 0) {
      setErrorMsg('Please enter a valid profit target value greater than $0.');
      return;
    }
    if (isNaN(lossNum) || lossNum <= 0) {
      setErrorMsg('Please enter a valid loss target value greater than $0.');
      return;
    }

    updateRiskSettings({
      stake: stakeNum,
      profitTarget: profitNum,
      lossTarget: lossNum,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Configure Header Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-200/90 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-xs shadow-amber-400/30">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-black text-neutral-900 tracking-tight">
              Risk Management
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Configure personal stake and automated limits
            </p>
          </div>
        </div>
      </div>

      {/* Institutional Master Deriv Copy-Pool Status Card */}
      <div className="bg-neutral-950 text-white rounded-3xl p-4 sm:p-5 shadow-md border border-neutral-800 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block leading-none">
                Execution Gateway
              </span>
              <span className="text-xs font-black text-white mt-0.5 block">
                Admin Master Deriv PAMM Pool
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>CONNECTED</span>
          </div>
        </div>

        {/* Master Account Specs Grid */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-[11px] mb-3">
          <div>
            <span className="text-[10px] text-neutral-400 block">Master Deriv Account</span>
            <span className="font-mono font-bold text-white">{masterDerivAccount.accountId}</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 block">Admin Profit Return</span>
            <span className="font-bold text-emerald-400">+{userProfitReturnRate}% on Win</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 block">Trading Asset</span>
            <span className="font-mono font-bold text-amber-300">{activeSymbolObj.symbol}</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 block">Active Pool Bots</span>
            <span className="font-bold text-neutral-200">{activePoolParticipants.length} Traders (${totalPoolStake.toLocaleString()})</span>
          </div>
        </div>

        <p className="text-[11px] text-neutral-300 leading-snug">
          You do not need a personal Deriv account. When your bot is started, your stake automatically pools into the Admin Deriv trade. On WIN, you receive <strong>+{userProfitReturnRate}%</strong> profit; on LOSS, your stake is deducted.
        </p>
      </div>


      {/* Risk Management Setup Form */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-200/90">
        <form onSubmit={handleSave} className="space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Stake Amount */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                Stake Amount
              </label>
              <span className="text-[10px] text-neutral-400 font-medium">Per Trade</span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">$</span>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder="500"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3 pl-8 pr-3 text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
              />
            </div>
            <div className="flex gap-1.5 mt-2">
              {[100, 250, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setStake(amt.toString())}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                    stake === amt.toString()
                      ? 'bg-amber-100 border-amber-400 text-neutral-950 font-black'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Profit Target Value */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-500" />
                Profit Target Value
              </label>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                Auto-Stop Gain
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">$</span>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={profitTarget}
                onChange={(e) => setProfitTarget(e.target.value)}
                placeholder="1000"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3 pl-8 pr-3 text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
              />
            </div>
            <div className="flex gap-1.5 mt-2">
              {[500, 1000, 2500, 5000].map((tgt) => (
                <button
                  key={tgt}
                  type="button"
                  onClick={() => setProfitTarget(tgt.toString())}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                    profitTarget === tgt.toString()
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-black'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  ${tgt}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Loss Target Value */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                Loss Target Value
              </label>
              <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md">
                Max Capital Loss
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">$</span>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={lossTarget}
                onChange={(e) => setLossTarget(e.target.value)}
                placeholder="500"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3 pl-8 pr-3 text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
              />
            </div>
            <div className="flex gap-1.5 mt-2">
              {[250, 500, 1000, 2000].map((loss) => (
                <button
                  key={loss}
                  type="button"
                  onClick={() => setLossTarget(loss.toString())}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                    lossTarget === loss.toString()
                      ? 'bg-rose-50 border-rose-400 text-rose-800 font-black'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  ${loss}
                </button>
              ))}
            </div>
          </div>

          {/* Risk/Reward Quick Ratio Card */}
          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex items-center justify-between text-xs">
            <span className="text-neutral-500 font-medium">Risk to Reward Ratio</span>
            <span className="font-extrabold text-neutral-900">
              1 : {(parseFloat(profitTarget) / (parseFloat(lossTarget) || 1)).toFixed(2)}
            </span>
          </div>

          {/* Yellow Accent Save Button */}
          <button
            type="submit"
            className="w-full mt-2 bg-amber-400 hover:bg-amber-500 active:scale-98 text-neutral-950 font-black py-3.5 px-4 rounded-xl shadow-md shadow-amber-400/25 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-900" />
                <span>Risk Settings Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Active Rules Info Box */}
      <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-xs text-neutral-700 space-y-1.5">
        <div className="font-bold text-neutral-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Automated Protection Rules</span>
        </div>
        <p className="text-[11px] text-neutral-600 leading-relaxed">
          When the trading bot is turned ON, it will deploy <strong>${parseFloat(stake) || 0}</strong> per trade and automatically shut off when cumulative profit reaches <strong>+${parseFloat(profitTarget) || 0}</strong> or cumulative loss hits <strong>-${parseFloat(lossTarget) || 0}</strong>.
        </p>
      </div>
    </div>
  );
}
