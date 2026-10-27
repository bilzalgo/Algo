'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Asset, 
  Position, 
  TradeOrder, 
  User, 
  UserSettings, 
  NotificationItem, 
  RiskSettings, 
  BotLog 
} from '@/types/trading';
import { INITIAL_ASSETS, DEFAULT_USER_SETTINGS, INITIAL_NOTIFICATIONS } from '@/lib/mockData';

interface TradingContextType {
  user: User | null;
  isAuthenticated: boolean;
  activeTab: 'home' | 'configure' | 'profile';
  setActiveTab: (tab: 'home' | 'configure' | 'profile') => void;
  assets: Asset[];
  selectedAsset: Asset;
  setSelectedAsset: (asset: Asset) => void;
  positions: Position[];
  orders: TradeOrder[];
  notifications: NotificationItem[];
  settings: UserSettings;
  isTradeModalOpen: boolean;
  tradeModalAsset: Asset | null;
  openTradeModal: (asset?: Asset, defaultSide?: 'buy' | 'sell') => void;
  closeTradeModal: () => void;
  initialTradeSide: 'buy' | 'sell';
  // Auth methods
  login: (identifier: string, password: string) => { success: boolean; error?: string };
  register: (username: string, email: string, password: string) => { success: boolean; error?: string };
  loginDemo: () => void;
  logout: () => void;
  // Trading methods
  executeOrder: (params: {
    assetId: string;
    side: 'buy' | 'sell';
    type: 'market' | 'limit';
    amount: number;
    price: number;
  }) => { success: boolean; message: string };
  closePosition: (positionId: string) => { success: boolean; message: string };
  depositFunds: (amount: number) => void;
  resetAccountCapital: () => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  markNotificationsAsRead: () => void;
  // Risk Management
  riskSettings: RiskSettings;
  updateRiskSettings: (newRisk: RiskSettings) => void;
  // Bot Engine
  botRunning: boolean;
  toggleBot: () => void;
  botStats: {
    pnl: number;
    wins: number;
    losses: number;
    rate: number;
  };
  botLogs: BotLog[];
  clearBotLogs: () => void;
  // Payment / Deposit & Withdraw Modal
  isPaymentModalOpen: boolean;
  paymentModalTab: 'deposit' | 'withdraw';
  openPaymentModal: (tab?: 'deposit' | 'withdraw') => void;
  closePaymentModal: () => void;
  withdrawFunds: (amount: number, destination?: string) => { success: boolean; message: string };
  // Portfolio Stats
  portfolioValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  todayPnl: number;
  todayPnlPercent: number;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'auratrade_auth_user_v1';
const USERS_DB_KEY = 'auratrade_registered_accounts_v1';
const POSITIONS_KEY = 'auratrade_positions_v1';
const ORDERS_KEY = 'auratrade_orders_v1';
const SETTINGS_KEY = 'auratrade_settings_v1';
const RISK_STORAGE_KEY = 'auratrade_risk_settings_v1';

const DEFAULT_RISK_SETTINGS: RiskSettings = {
  stake: 500,
  profitTarget: 1000,
  lossTarget: 500,
};

export function TradingProvider({ children }: { children: React.ReactNode }) {
  // Lazy state initializers from localStorage
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<'home' | 'configure' | 'profile'>('home');
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState<string>(INITIAL_ASSETS[0].id);

  const [positions, setPositions] = useState<Position[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(POSITIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<TradeOrder[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [settings, setSettings] = useState<UserSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_USER_SETTINGS;
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_USER_SETTINGS;
    } catch {
      return DEFAULT_USER_SETTINGS;
    }
  });

  // Risk Management Settings
  const [riskSettings, setRiskSettings] = useState<RiskSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_RISK_SETTINGS;
    try {
      const stored = localStorage.getItem(RISK_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_RISK_SETTINGS;
    } catch {
      return DEFAULT_RISK_SETTINGS;
    }
  });

  // Bot Trading State
  const [botRunning, setBotRunning] = useState(false);
  const [botStats, setBotStats] = useState({
    pnl: 0,
    wins: 0,
    losses: 0,
    rate: 0,
  });
  const [botLogs, setBotLogs] = useState<BotLog[]>([
    {
      id: 'init-1',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message: 'System ready. Configure risk settings & press START BOT to begin.',
      type: 'system',
    },
  ]);

  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [tradeModalAssetId, setTradeModalAssetId] = useState<string | null>(null);
  const [initialTradeSide, setInitialTradeSide] = useState<'buy' | 'sell'>('buy');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalTab, setPaymentModalTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Derived current selected asset
  const selectedAsset = useMemo(() => {
    return assets.find((a) => a.id === selectedAssetId) || assets[0];
  }, [assets, selectedAssetId]);

  const setSelectedAsset = useCallback((asset: Asset) => {
    setSelectedAssetId(asset.id);
  }, []);

  const tradeModalAsset = useMemo(() => {
    if (!tradeModalAssetId) return selectedAsset;
    return assets.find((a) => a.id === tradeModalAssetId) || selectedAsset;
  }, [assets, tradeModalAssetId, selectedAsset]);

  // Derived live positions with accurate current prices and P&L
  const livePositions = useMemo(() => {
    return positions.map((pos) => {
      const curAsset = assets.find((a) => a.id === pos.assetId);
      const curPrice = curAsset ? curAsset.price : pos.currentPrice;
      const curVal = pos.amount * curPrice;
      const pnl = pos.side === 'buy' ? curVal - pos.totalInvested : pos.totalInvested - curVal;
      const pnlPercent = pos.totalInvested > 0 ? (pnl / pos.totalInvested) * 100 : 0;
      return {
        ...pos,
        currentPrice: curPrice,
        pnl: Number(pnl.toFixed(2)),
        pnlPercent: Number(pnlPercent.toFixed(2)),
      };
    });
  }, [positions, assets]);

  // Show transient toast
  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  // Save risk settings
  const updateRiskSettings = useCallback((newRisk: RiskSettings) => {
    setRiskSettings(newRisk);
    try {
      localStorage.setItem(RISK_STORAGE_KEY, JSON.stringify(newRisk));
    } catch {
      // ignore
    }
    triggerToast('Risk management settings saved!');
  }, [triggerToast]);

  // Append a bot log helper
  const addBotLog = useCallback((message: string, type: BotLog['type'] = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: BotLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      time,
      message,
      type,
    };
    setBotLogs((prev) => [...prev.slice(-99), newLog]);
  }, []);

  const clearBotLogs = useCallback(() => {
    setBotLogs([]);
    triggerToast('Console logs cleared');
  }, [triggerToast]);

  // Real-time market tick simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prevAssets) =>
        prevAssets.map((asset) => {
          const pct = (Math.random() - 0.48) * 0.008;
          const newPrice = Math.max(0.0001, Number((asset.price * (1 + pct)).toFixed(asset.price > 10 ? 2 : 4)));
          const priceDiff = newPrice - asset.sparkline[0];
          const newChange24h = Number(((priceDiff / asset.sparkline[0]) * 100).toFixed(2));
          const updatedSparkline = [...asset.sparkline.slice(1), newPrice];

          return {
            ...asset,
            price: newPrice,
            change24h: newChange24h,
            high24h: Math.max(asset.high24h, newPrice),
            low24h: Math.min(asset.low24h, newPrice),
            sparkline: updatedSparkline,
          };
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Bot Trading Simulation Engine Loop
  const riskRef = useRef(riskSettings);
  const botStatsRef = useRef(botStats);
  const userRef = useRef(user);
  const assetsRef = useRef(assets);

  useEffect(() => {
    riskRef.current = riskSettings;
    botStatsRef.current = botStats;
    userRef.current = user;
    assetsRef.current = assets;
  });

  // Toggle Bot
  const toggleBot = useCallback(() => {
    setBotRunning((prev) => {
      const next = !prev;
      if (next) {
        addBotLog(`[START] Bot online. Stake: $${riskRef.current.stake} | Target: +$${riskRef.current.profitTarget} | Stop: -$${riskRef.current.lossTarget}`, 'alert');
        triggerToast('Trading bot started!');
      } else {
        addBotLog('[STOP] Bot stopped by user.', 'system');
        triggerToast('Trading bot stopped');
      }
      return next;
    });
  }, [addBotLog, triggerToast]);

  useEffect(() => {
    if (!botRunning) return;

    let step = 0;
    const interval = setInterval(() => {
      const curRisk = riskRef.current;
      const curStats = botStatsRef.current;
      const curUser = userRef.current;
      const curAssets = assetsRef.current;

      // 1. Check if Target Profit or Loss Target hit
      if (curStats.pnl >= curRisk.profitTarget) {
        addBotLog(`🏆 Target Profit of +$${curRisk.profitTarget} reached! Auto-stopping bot.`, 'win');
        setBotRunning(false);
        triggerToast(`Profit target reached! +$${curStats.pnl.toFixed(2)}`);
        return;
      }

      if (curStats.pnl <= -curRisk.lossTarget) {
        addBotLog(`🛑 Loss limit of -$${curRisk.lossTarget} hit! Auto-stopping bot to protect capital.`, 'loss');
        setBotRunning(false);
        triggerToast(`Loss limit reached (-$${curRisk.lossTarget})`);
        return;
      }

      step++;
      const pickAsset = curAssets[Math.floor(Math.random() * curAssets.length)] || curAssets[0];

      // Alternate between scanning, entering position, and taking profit/loss
      if (step % 2 === 1) {
        // Scanning or signal phase
        const indicator = ['EMA Cross', 'RSI Bullish Reversal', 'MACD Breakout', 'Bollinger Rebound'][Math.floor(Math.random() * 4)];
        addBotLog(`Scanning ${pickAsset.symbol} @ $${pickAsset.price.toLocaleString()} | Signal: ${indicator}`, 'info');
      } else {
        // Trade execution phase
        const isWin = Math.random() < 0.68; // 68% win rate
        const stake = Math.min(curRisk.stake, curUser?.cashBalance || curRisk.stake);
        
        if (stake <= 0) {
          addBotLog('Insufficient funds to deploy stake.', 'alert');
          setBotRunning(false);
          return;
        }

        // Return between 2.5% and 8.5% of stake
        const profitFactor = (0.03 + Math.random() * 0.055);
        const tradePnl = Number((isWin ? stake * profitFactor : -stake * (profitFactor * 0.8)).toFixed(2));
        const newCumulativePnl = Number((curStats.pnl + tradePnl).toFixed(2));
        const newWins = isWin ? curStats.wins + 1 : curStats.wins;
        const newLosses = !isWin ? curStats.losses + 1 : curStats.losses;
        const totalTrades = newWins + newLosses;
        const newRate = totalTrades > 0 ? Number(((newWins / totalTrades) * 100).toFixed(1)) : 0;

        // Update user cash balance
        if (curUser) {
          const updatedCash = Number((curUser.cashBalance + tradePnl).toFixed(2));
          setUser((prev) => (prev ? { ...prev, cashBalance: updatedCash } : null));
        }

        // Update stats
        setBotStats({
          pnl: newCumulativePnl,
          wins: newWins,
          losses: newLosses,
          rate: newRate,
        });

        // Add to orders history
        const autoOrder: TradeOrder = {
          id: `bot_ord_${Date.now()}`,
          assetId: pickAsset.id,
          symbol: pickAsset.symbol,
          name: pickAsset.name,
          side: 'buy',
          type: 'market',
          price: pickAsset.price,
          amount: Number((stake / pickAsset.price).toFixed(4)),
          total: stake,
          status: 'filled',
          timestamp: Date.now(),
        };
        setOrders((prev) => [autoOrder, ...prev]);

        // Log trade result
        if (isWin) {
          addBotLog(
            `WIN: ${pickAsset.symbol} Stake $${stake} -> TP Closed +$${tradePnl} (Cum: ${newCumulativePnl >= 0 ? '+' : ''}$${newCumulativePnl})`,
            'win'
          );
        } else {
          addBotLog(
            `LOSS: ${pickAsset.symbol} Stake $${stake} -> SL Closed -$${Math.abs(tradePnl)} (Cum: ${newCumulativePnl >= 0 ? '+' : ''}$${newCumulativePnl})`,
            'loss'
          );
        }
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [botRunning, addBotLog, triggerToast]);

  // Save changes to localStorage on state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
  }, [positions]);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Auth: Login
  const login = useCallback((identifier: string, pass: string) => {
    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId || !pass) {
      return { success: false, error: 'Please enter both username/email and password.' };
    }

    try {
      const registeredStr = localStorage.getItem(USERS_DB_KEY);
      const registeredList: Array<User & { passwordHash: string }> = registeredStr ? JSON.parse(registeredStr) : [];

      const found = registeredList.find(
        (u) => u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
      );

      if (found) {
        if (found.passwordHash !== pass) {
          return { success: false, error: 'Incorrect password. Please try again.' };
        }
        const { passwordHash: _, ...authenticatedUser } = found;
        setUser(authenticatedUser);
        triggerToast(`Welcome back, ${authenticatedUser.displayName || authenticatedUser.username}!`);
        return { success: true };
      }

      // If user logs in with default credentials or demo
      if (cleanId === 'demo' || cleanId === 'trader' || cleanId === 'user@auratrade.com') {
        const demoUser: User = {
          id: 'demo-usr-01',
          username: 'DemoTrader',
          email: 'demo@auratrade.com',
          displayName: 'Alex Rivers',
          avatarSeed: 'alex',
          createdAt: Date.now() - 86400000 * 14,
          tier: 'VIP Pro Tier',
          isVerified: true,
          cashBalance: 50000,
          startingBalance: 50000,
        };
        setUser(demoUser);
        triggerToast('Logged in as Alex Rivers (Demo Trader)');
        return { success: true };
      }

      return {
        success: false,
        error: 'No account found with this username or email. Please register first.',
      };
    } catch {
      return { success: false, error: 'Authentication error occurred.' };
    }
  }, [triggerToast]);

  // Auth: Register
  const register = useCallback((username: string, email: string, pass: string) => {
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!pass || pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    try {
      const registeredStr = localStorage.getItem(USERS_DB_KEY);
      const registeredList: Array<User & { passwordHash: string }> = registeredStr ? JSON.parse(registeredStr) : [];

      const exists = registeredList.some(
        (u) => u.username.toLowerCase() === cleanUsername.toLowerCase() || u.email.toLowerCase() === cleanEmail
      );

      if (exists) {
        return { success: false, error: 'An account with this username or email already exists.' };
      }

      const newUser: User = {
        id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        username: cleanUsername,
        email: cleanEmail,
        displayName: cleanUsername,
        avatarSeed: cleanUsername.toLowerCase(),
        createdAt: Date.now(),
        tier: 'VIP Trader',
        isVerified: true,
        cashBalance: 50000,
        startingBalance: 50000,
      };

      const accountToStore = { ...newUser, passwordHash: pass };
      registeredList.push(accountToStore);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(registeredList));

      setUser(newUser);
      triggerToast('Account created! $50,000 trading funds activated.');
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to create account.' };
    }
  }, [triggerToast]);

  // Auth: Quick Demo login
  const loginDemo = useCallback(() => {
    const demoUser: User = {
      id: 'demo-usr-default',
      username: 'GoldTrader99',
      email: 'trader@auratrade.io',
      displayName: 'Morgan Vance',
      avatarSeed: 'morgan',
      createdAt: Date.now() - 86400000 * 22,
      tier: 'VIP Institutional',
      isVerified: true,
      cashBalance: 50000.00,
      startingBalance: 50000,
    };
    setUser(demoUser);
    triggerToast('Logged in as Morgan Vance ($50,000 balance)');
  }, [triggerToast]);

  // Auth: Logout
  const logout = useCallback(() => {
    setBotRunning(false);
    setUser(null);
    triggerToast('Logged out successfully');
  }, [triggerToast]);

  // Modal handlers
  const openTradeModal = useCallback((asset?: Asset, defaultSide: 'buy' | 'sell' = 'buy') => {
    if (asset) {
      setTradeModalAssetId(asset.id);
      setSelectedAssetId(asset.id);
    } else {
      setTradeModalAssetId(selectedAssetId);
    }
    setInitialTradeSide(defaultSide);
    setIsTradeModalOpen(true);
  }, [selectedAssetId]);

  const closeTradeModal = useCallback(() => {
    setIsTradeModalOpen(false);
  }, []);

  // Execute Order
  const executeOrder = useCallback(
    ({
      assetId,
      side,
      type,
      amount,
      price,
    }: {
      assetId: string;
      side: 'buy' | 'sell';
      type: 'market' | 'limit';
      amount: number;
      price: number;
    }) => {
      if (!user) {
        return { success: false, message: 'You must be logged in to trade.' };
      }

      const targetAsset = assets.find((a) => a.id === assetId);
      if (!targetAsset) {
        return { success: false, message: 'Asset not found.' };
      }

      const totalCost = Number((amount * price).toFixed(2));

      if (side === 'buy') {
        if (user.cashBalance < totalCost) {
          return {
            success: false,
            message: `Insufficient cash balance. Required: $${totalCost.toLocaleString()}, Available: $${user.cashBalance.toLocaleString()}`,
          };
        }

        const updatedCash = Number((user.cashBalance - totalCost).toFixed(2));
        setUser((prev) => (prev ? { ...prev, cashBalance: updatedCash } : null));

        setPositions((prev) => {
          const existing = prev.find((p) => p.assetId === assetId && p.side === 'buy');
          if (existing) {
            const combinedAmount = existing.amount + amount;
            const combinedInvested = existing.totalInvested + totalCost;
            const avgEntryPrice = combinedInvested / combinedAmount;
            const curVal = combinedAmount * targetAsset.price;
            const pnl = curVal - combinedInvested;

            return prev.map((p) =>
              p.id === existing.id
                ? {
                    ...p,
                    amount: Number(combinedAmount.toFixed(4)),
                    totalInvested: Number(combinedInvested.toFixed(2)),
                    entryPrice: Number(avgEntryPrice.toFixed(2)),
                    currentPrice: targetAsset.price,
                    pnl: Number(pnl.toFixed(2)),
                    pnlPercent: Number(((pnl / combinedInvested) * 100).toFixed(2)),
                  }
                : p
            );
          } else {
            const newPos: Position = {
              id: `pos_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              assetId: targetAsset.id,
              symbol: targetAsset.symbol,
              name: targetAsset.name,
              side: 'buy',
              amount: Number(amount.toFixed(4)),
              totalInvested: totalCost,
              entryPrice: price,
              currentPrice: targetAsset.price,
              pnl: 0,
              pnlPercent: 0,
              timestamp: Date.now(),
            };
            return [newPos, ...prev];
          }
        });
      } else {
        const existing = positions.find((p) => p.assetId === assetId);
        if (!existing || existing.amount < amount) {
          const availableUnits = existing ? existing.amount : 0;
          return {
            success: false,
            message: `Insufficient asset holdings. You have ${availableUnits} ${targetAsset.symbol.split('/')[0]} available to sell.`,
          };
        }

        const proceeds = totalCost;
        const updatedCash = Number((user.cashBalance + proceeds).toFixed(2));
        setUser((prev) => (prev ? { ...prev, cashBalance: updatedCash } : null));

        setPositions((prev) => {
          return prev
            .map((p) => {
              if (p.id === existing.id) {
                const remaining = p.amount - amount;
                if (remaining <= 0.00001) return null;
                const ratio = remaining / p.amount;
                const newInvested = p.totalInvested * ratio;
                const curVal = remaining * targetAsset.price;
                const pnl = curVal - newInvested;

                return {
                  ...p,
                  amount: Number(remaining.toFixed(4)),
                  totalInvested: Number(newInvested.toFixed(2)),
                  pnl: Number(pnl.toFixed(2)),
                  pnlPercent: Number(((pnl / newInvested) * 100).toFixed(2)),
                };
              }
              return p;
            })
            .filter(Boolean) as Position[];
        });
      }

      const newOrder: TradeOrder = {
        id: `ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        assetId: targetAsset.id,
        symbol: targetAsset.symbol,
        name: targetAsset.name,
        side,
        type,
        price,
        amount,
        total: totalCost,
        status: 'filled',
        timestamp: Date.now(),
      };
      setOrders((prev) => [newOrder, ...prev]);

      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        title: `${side.toUpperCase()} Order Executed`,
        message: `Filled ${amount} ${targetAsset.symbol} at $${price.toLocaleString()} for $${totalCost.toLocaleString()}`,
        timestamp: Date.now(),
        read: false,
        type: 'order',
      };
      setNotifications((prev) => [newNotif, ...prev]);

      triggerToast(`Order filled: ${side.toUpperCase()} ${amount} ${targetAsset.symbol}`);
      return { success: true, message: `Successfully executed ${side.toUpperCase()} order.` };
    },
    [user, assets, positions, triggerToast]
  );

  // Close Position
  const closePosition = useCallback(
    (positionId: string) => {
      const pos = livePositions.find((p) => p.id === positionId);
      if (!pos || !user) return { success: false, message: 'Position not found' };

      const curAsset = assets.find((a) => a.id === pos.assetId);
      const closePrice = curAsset ? curAsset.price : pos.currentPrice;
      const proceeds = Number((pos.amount * closePrice).toFixed(2));
      const realizedPnl = Number((proceeds - pos.totalInvested).toFixed(2));

      setUser((prev) => (prev ? { ...prev, cashBalance: Number((prev.cashBalance + proceeds).toFixed(2)) } : null));
      setPositions((prev) => prev.filter((p) => p.id !== positionId));

      const closeOrder: TradeOrder = {
        id: `ord_close_${Date.now()}`,
        assetId: pos.assetId,
        symbol: pos.symbol,
        name: pos.name,
        side: 'sell',
        type: 'market',
        price: closePrice,
        amount: pos.amount,
        total: proceeds,
        status: 'filled',
        timestamp: Date.now(),
      };
      setOrders((prev) => [closeOrder, ...prev]);

      const sign = realizedPnl >= 0 ? '+' : '';
      triggerToast(`Closed ${pos.symbol}: ${sign}$${realizedPnl.toLocaleString()} P&L`);
      return { success: true, message: `Closed position with ${sign}$${realizedPnl} P&L` };
    },
    [livePositions, user, assets, triggerToast]
  );

  // Deposit funds
  const depositFunds = useCallback(
    (amount: number) => {
      if (!user) return;
      const updated = Number((user.cashBalance + amount).toFixed(2));
      setUser((prev) => (prev ? { ...prev, cashBalance: updated } : null));

      const newNotif: NotificationItem = {
        id: `notif_dep_${Date.now()}`,
        title: 'Demo Deposit Credited',
        message: `+$${amount.toLocaleString()} was successfully added to your trading balance.`,
        timestamp: Date.now(),
        read: false,
        type: 'deposit',
      };
      setNotifications((prev) => [newNotif, ...prev]);
      triggerToast(`Deposited +$${amount.toLocaleString()} funds`);
    },
    [user, triggerToast]
  );

  // Withdraw funds
  const withdrawFunds = useCallback(
    (amount: number, destination = 'USDT Wallet') => {
      if (!user) return { success: false, message: 'You must be logged in.' };
      if (amount <= 0) return { success: false, message: 'Please enter a valid amount.' };
      if (amount > user.cashBalance) {
        return {
          success: false,
          message: `Insufficient balance. Available: $${user.cashBalance.toLocaleString()}`,
        };
      }

      const updated = Number((user.cashBalance - amount).toFixed(2));
      setUser((prev) => (prev ? { ...prev, cashBalance: updated } : null));

      const newNotif: NotificationItem = {
        id: `notif_wth_${Date.now()}`,
        title: 'Withdrawal Processed',
        message: `-$${amount.toLocaleString()} withdrawn to ${destination}.`,
        timestamp: Date.now(),
        read: false,
        type: 'deposit',
      };
      setNotifications((prev) => [newNotif, ...prev]);
      triggerToast(`Withdrawal of -$${amount.toLocaleString()} processed!`);
      return { success: true, message: `Withdrawn $${amount.toLocaleString()} successfully.` };
    },
    [user, triggerToast]
  );

  const openPaymentModal = useCallback((tab: 'deposit' | 'withdraw' = 'deposit') => {
    setPaymentModalTab(tab);
    setIsPaymentModalOpen(true);
  }, []);

  const closePaymentModal = useCallback(() => {
    setIsPaymentModalOpen(false);
  }, []);

  // Reset demo capital
  const resetAccountCapital = useCallback(() => {
    if (!user) return;
    setUser((prev) =>
      prev
        ? {
            ...prev,
            cashBalance: 50000,
            startingBalance: 50000,
          }
        : null
    );
    setPositions([]);
    setOrders([]);
    setBotStats({ pnl: 0, wins: 0, losses: 0, rate: 0 });
    triggerToast('Account reset: $50,000 cash balance restored');
  }, [user, triggerToast]);

  // Update Settings
  const updateSettings = useCallback(
    (newSettings: Partial<UserSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...newSettings };
        return next;
      });
      triggerToast('Settings updated');
    },
    [triggerToast]
  );

  // Mark all notifications read
  const markNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Portfolio calculations
  const { portfolioValue, totalPnl, totalPnlPercent, todayPnl, todayPnlPercent } = useMemo(() => {
    const cash = user?.cashBalance || 0;
    const holdingsVal = livePositions.reduce((sum, p) => sum + p.amount * p.currentPrice, 0);
    const totalVal = cash + holdingsVal;
    const initialBase = user?.startingBalance || 50000;
    const pnl = totalVal - initialBase;
    const pnlPct = initialBase > 0 ? (pnl / initialBase) * 100 : 0;

    const todayChange = livePositions.reduce((sum, p) => sum + p.pnl, 0);
    const todayPct = totalVal > 0 ? (todayChange / totalVal) * 100 : 0;

    return {
      portfolioValue: Number(totalVal.toFixed(2)),
      totalPnl: Number(pnl.toFixed(2)),
      totalPnlPercent: Number(pnlPct.toFixed(2)),
      todayPnl: Number(todayChange.toFixed(2)),
      todayPnlPercent: Number(todayPct.toFixed(2)),
    };
  }, [user, livePositions]);

  return (
    <TradingContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        activeTab,
        setActiveTab,
        assets,
        selectedAsset,
        setSelectedAsset,
        positions: livePositions,
        orders,
        notifications,
        settings,
        isTradeModalOpen,
        tradeModalAsset,
        openTradeModal,
        closeTradeModal,
        initialTradeSide,
        isPaymentModalOpen,
        paymentModalTab,
        openPaymentModal,
        closePaymentModal,
        withdrawFunds,
        login,
        register,
        loginDemo,
        logout,
        executeOrder,
        closePosition,
        depositFunds,
        resetAccountCapital,
        updateSettings,
        markNotificationsAsRead,
        riskSettings,
        updateRiskSettings,
        botRunning,
        toggleBot,
        botStats,
        botLogs,
        clearBotLogs,
        portfolioValue,
        totalPnl,
        totalPnlPercent,
        todayPnl,
        todayPnlPercent,
        toastMessage,
        setToastMessage,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
}
