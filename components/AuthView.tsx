'use client';

import React, { useState } from 'react';
import { useTrading } from '@/context/TradingContext';
import { 
  TrendingUp, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export function AuthView() {
  const { login, register, loginDemo } = useTrading();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (isRegisterMode) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        const res = register(username, email, password);
        if (!res.success) {
          setError(res.error || 'Failed to register account');
        }
      } else {
        const identifier = email || username;
        const res = login(identifier, password);
        if (!res.success) {
          setError(res.error || 'Invalid credentials');
        }
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-[12px] py-3">
      {/* Mobile Phone Mockup Frame / Container */}
      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl border border-neutral-200/80 overflow-hidden flex flex-col min-h-[780px]">
        
        {/* Mobile Top Status Bar Simulation */}
        <div className="bg-neutral-900 text-white text-[11px] px-6 py-2.5 flex items-center justify-between font-mono select-none">
          <span className="font-semibold tracking-wider">09:41</span>
          <div className="w-20 h-4 bg-neutral-800 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 opacity-90">
            <span className="text-[10px]">5G</span>
            <div className="w-4 h-2.5 border border-white rounded-[2px] p-[1px]">
              <div className="w-full h-full bg-amber-400 rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between bg-gradient-to-b from-amber-50/40 via-white to-neutral-50/50">
          
          <div>
            {/* Brand Header */}
            <div className="text-center mt-2 mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/30 mb-3">
                <TrendingUp className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-neutral-900 flex items-center justify-center gap-1.5">
                Aura<span className="text-amber-500">Trade</span>
              </h1>
              <p className="text-xs text-neutral-500 mt-1 font-medium">
                Professional Next-Gen Mobile Trading
              </p>
            </div>

            {/* Auth Mode Switcher Tab */}
            <div className="bg-neutral-100 p-1 rounded-xl flex items-center mb-6 border border-neutral-200/70">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  !isRegisterMode
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(true);
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  isRegisterMode
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2 animate-in fade-in">
                <span className="mt-0.5 font-bold">!</span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Username field (Always for register, optional for login if using username) */}
              {isRegisterMode ? (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. SatoshiTrader"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-xl py-2.5 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              ) : null}

              {/* Email / Username for Login, Email for Register */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                  {isRegisterMode ? 'Email Address' : 'Email or Username'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={isRegisterMode ? 'email' : 'text'}
                    required
                    placeholder={isRegisterMode ? 'name@example.com' : 'email or username'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl py-2.5 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                    Password
                  </label>
                  {!isRegisterMode && (
                    <button
                      type="button"
                      onClick={() => setError('Use demo login or enter any credentials.')}
                      className="text-[11px] text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl py-2.5 pl-10 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Register mode) */}
              {isRegisterMode && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-xl py-2.5 pl-10 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Main Yellow Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold py-3 px-4 rounded-xl shadow-md shadow-amber-400/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-sm"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isRegisterMode ? 'Open Trading Account' : 'Sign In to Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2.5 text-neutral-400 text-[10px] font-semibold tracking-wider">
                  Or instant access
                </span>
              </div>
            </div>

            {/* Quick Demo Button with Yellow Accent Pill */}
            <button
              type="button"
              onClick={loginDemo}
              className="w-full bg-neutral-100 hover:bg-amber-50 hover:border-amber-300 border border-neutral-200 text-neutral-800 font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs group cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
              <span>Explore Demo Account ($50,000 Paper Funds)</span>
            </button>
          </div>

          {/* Bottom Security Highlights */}
          <div className="pt-4 border-t border-neutral-100 mt-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-neutral-400 mb-0.5" />
                <span className="text-[10px] text-neutral-500 font-medium">Bank-Grade 256b</span>
              </div>
              <div className="flex flex-col items-center">
                <Zap className="w-4 h-4 text-amber-500 mb-0.5" />
                <span className="text-[10px] text-neutral-500 font-medium">Instant Fill</span>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-0.5" />
                <span className="text-[10px] text-neutral-500 font-medium">Zero Commission</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
