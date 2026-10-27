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
  BotLog,
  WalletTransaction,
  DerivTickData,
  BotSymbolConfig,
  MasterDerivAccount,
  PoolParticipant,
  MasterPoolTrade
} from '@/types/trading';
import { 
  INITIAL_ASSETS, 
  DEFAULT_USER_SETTINGS, 
  INITIAL_NOTIFICATIONS,
  AVAILABLE_BOT_SYMBOLS,
  INITIAL_ADMIN_USERS,
  INITIAL_ADMIN_TRANSACTIONS,
  DEFAULT_MASTER_DERIV_ACCOUNT,
  INITIAL_MASTER_TRADES
} from '@/lib/mockData';

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
  derivData: DerivTickData;
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
  depositFunds: (amount: number, txHash?: string, address?: string) => void;
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
  // Master Deriv Account & Pooled Trading Engine
  masterDerivAccount: MasterDerivAccount;
  updateMasterDerivAccount: (updates: Partial<MasterDerivAccount>) => void;
  userProfitReturnRate: number; // e.g. 85 for 85%
  setUserProfitReturnRate: (rate: number) => void;
  activePoolParticipants: PoolParticipant[];
  totalPoolStake: number;
  masterTrades: MasterPoolTrade[];
  executeMasterTrade: (forcedOutcome?: 'win' | 'loss') => { success: boolean; message: string; trade?: MasterPoolTrade };
  // Payment / Deposit & Withdraw Modal
  isPaymentModalOpen: boolean;
  paymentModalTab: 'deposit' | 'withdraw';
  openPaymentModal: (tab?: 'deposit' | 'withdraw') => void;
  closePaymentModal: () => void;
  withdrawFunds: (amount: number, destination?: string) => { success: boolean; message: string };
  // Transactions History Modal
  transactions: WalletTransaction[];
  isTransactionModalOpen: boolean;
  openTransactionModal: () => void;
  closeTransactionModal: () => void;
  // Portfolio Stats
  portfolioValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  todayPnl: number;
  todayPnlPercent: number;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
  // Admin Dashboard Mode & Controls
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  toggleAdminMode: () => void;
  users: User[];
  adminAddFunds: (userId: string, amount: number, note?: string) => void;
  adminDeductFunds: (userId: string, amount: number, note?: string) => { success: boolean; message: string };
  adminEditUser: (userId: string, updates: Partial<User>) => void;
  adminDeleteUser: (userId: string) => { success: boolean; message: string };
  adminStopUserBot: (userId: string) => void;
  adminStopAllBots: () => void;
  availableBotSymbols: BotSymbolConfig[];
  adminSelectedSymbol: string;
  adminSelectBotSymbol: (symbolId: string) => void;
  adminUpdateTransactionStatus: (txId: string, status: 'completed' | 'processing' | 'pending' | 'rejected') => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'auratrade_auth_user_v1';
const USERS_DB_KEY = 'auratrade_registered_accounts_v1';
const POSITIONS_KEY = 'auratrade_positions_v1';
const ORDERS_KEY = 'auratrade_orders_v1';
const SETTINGS_KEY = 'auratrade_settings_v1';
const RISK_STORAGE_KEY = 'auratrade_risk_settings_v1';
const TRANSACTIONS_KEY = 'auratrade_transactions_v2';
const ADMIN_USERS_KEY = 'auratrade_admin_users_v2';
const ADMIN_BOT_SYMBOL_KEY = 'auratrade_bot_symbol_v1';
const MASTER_DERIV_KEY = 'gsquad_master_deriv_v1';
const PROFIT_RETURN_KEY = 'gsquad_profit_return_v1';
const MASTER_TRADES_KEY = 'gsquad_master_trades_v1';


const INITIAL_TRANSACTIONS: WalletTransaction[] = INITIAL_ADMIN_TRANSACTIONS;

const DEFAULT_RISK_SETTINGS: RiskSettings = {
  stake: 500,
  profitTarget: 1000,
  lossTarget: 500,
};

const INITIAL_DERIV_DATA: DerivTickData = {
  symbol: '1HZ100V',
  name: 'Volatility 100 (1s) Index',
  quote: 248350.25,
  prevQuote: 248332.10,
  bid: 248348.10,
  ask: 248352.40,
  spread: 4.30,
  change: 18.15,
  changePercent: 0.0073,
  high: 251920.00,
  low: 243810.50,
  sparkline: [247100, 247400, 247200, 247800, 248100, 247950, 248200, 248350],
  isConnected: false,
  lastUpdated: 'Connecting...',
};

const generateAccountId = () => `GSQ-${Math.floor(10000000 + Math.random() * 90000000)}`;

export function TradingProvider({ children }: { children: React.ReactNode }) {
  // Safe initial states for SSR and hydration parity
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'configure' | 'profile'>('home');
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState<string>(INITIAL_ASSETS[0].id);
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<TradeOrder[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [riskSettings, setRiskSettings] = useState<RiskSettings>(DEFAULT_RISK_SETTINGS);
  const [derivData, setDerivData] = useState<DerivTickData>(INITIAL_DERIV_DATA);

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
      time: '09:41:00 AM',
      message: 'System ready. Deriv feed active. Press START BOT to trade Volatility 100 (1s) Index.',
      type: 'system',
    },
  ]);

  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [tradeModalAssetId, setTradeModalAssetId] = useState<string | null>(null);
  const [initialTradeSide, setInitialTradeSide] = useState<'buy' | 'sell'>('buy');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalTab, setPaymentModalTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Admin states
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>(INITIAL_ADMIN_USERS);
  const [adminSelectedSymbol, setAdminSelectedSymbol] = useState<string>('1HZ100V');
  const adminSelectedSymbolRef = useRef(adminSelectedSymbol);

  // Master Deriv Account & Pooled Trading Engine
  const [masterDerivAccount, setMasterDerivAccount] = useState<MasterDerivAccount>(DEFAULT_MASTER_DERIV_ACCOUNT);
  const [userProfitReturnRate, setUserProfitReturnRateState] = useState<number>(85);
  const [masterTrades, setMasterTrades] = useState<MasterPoolTrade[]>(INITIAL_MASTER_TRADES);

  const masterDerivAccountRef = useRef(masterDerivAccount);
  const userProfitReturnRateRef = useRef(userProfitReturnRate);
  const masterTradesRef = useRef(masterTrades);

  useEffect(() => {
    masterDerivAccountRef.current = masterDerivAccount;
    userProfitReturnRateRef.current = userProfitReturnRate;
    masterTradesRef.current = masterTrades;
  });

  useEffect(() => {
    adminSelectedSymbolRef.current = adminSelectedSymbol;
  }, [adminSelectedSymbol]);

  // Hydrate client-only state from localStorage safely after mount
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && !parsed.accountId) {
            parsed.accountId = generateAccountId();
          }
          setUser(parsed);
          if (parsed?.role === 'admin') {
            setIsAdminMode(true);
          }
        }
        const storedPositions = localStorage.getItem(POSITIONS_KEY);
        if (storedPositions) {
          setPositions(JSON.parse(storedPositions));
        }
        const storedOrders = localStorage.getItem(ORDERS_KEY);
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        }
        const storedSettings = localStorage.getItem(SETTINGS_KEY);
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
        const storedRisk = localStorage.getItem(RISK_STORAGE_KEY);
        if (storedRisk) {
          setRiskSettings(JSON.parse(storedRisk));
        }
        const storedTx = localStorage.getItem(TRANSACTIONS_KEY);
        if (storedTx) {
          setTransactions(JSON.parse(storedTx));
        }
        const storedAdminUsers = localStorage.getItem(ADMIN_USERS_KEY);
        if (storedAdminUsers) {
          setUsers(JSON.parse(storedAdminUsers));
        }
        const storedBotSymbol = localStorage.getItem(ADMIN_BOT_SYMBOL_KEY);
        if (storedBotSymbol) {
          setAdminSelectedSymbol(storedBotSymbol);
          const foundSym = AVAILABLE_BOT_SYMBOLS.find((s) => s.id === storedBotSymbol);
          if (foundSym) {
            setDerivData((prev) => ({
              ...prev,
              symbol: foundSym.symbol,
              name: foundSym.name,
              quote: foundSym.basePrice,
            }));
          }
        }
        const storedMasterDeriv = localStorage.getItem(MASTER_DERIV_KEY);
        if (storedMasterDeriv) {
          try {
            setMasterDerivAccount(JSON.parse(storedMasterDeriv));
          } catch {}
        }
        const storedProfitReturn = localStorage.getItem(PROFIT_RETURN_KEY);
        if (storedProfitReturn) {
          const parsedRate = parseFloat(storedProfitReturn);
          if (!isNaN(parsedRate)) setUserProfitReturnRateState(parsedRate);
        }
        const storedMasterTrades = localStorage.getItem(MASTER_TRADES_KEY);
        if (storedMasterTrades) {
          try {
            setMasterTrades(JSON.parse(storedMasterTrades));
          } catch {}
        }
      } catch (e) {
        console.error('Failed to restore localStorage state:', e);
      } finally {
        setIsHydrated(true);
      }
    });

    return () => cancelAnimationFrame(handle);
  }, []);

  const openTransactionModal = useCallback(() => {
    setIsTransactionModalOpen(true);
  }, []);

  const closeTransactionModal = useCallback(() => {
    setIsTransactionModalOpen(false);
  }, []);

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

  // Append a bot log helper (newest items appear at top)
  const addBotLog = useCallback((message: string, type: BotLog['type'] = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: BotLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      time,
      message,
      type,
    };
    setBotLogs((prev) => [newLog, ...prev.slice(0, 99)]);
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

  // Deriv Stream WebSocket and Live Tick Engine
  const derivDataRef = useRef<DerivTickData>(derivData);

  useEffect(() => {
    derivDataRef.current = derivData;
  }, [derivData]);

  // Deriv Public WebSocket Client for Volatility 100 (1s) Index (1HZ100V)
  useEffect(() => {
    let ws: WebSocket | null = null;
    let pingInterval: NodeJS.Timeout | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isDisposed = false;

    const connectDeriv = () => {
      if (isDisposed) return;
      try {
        // Deriv public API endpoint with app_id=1089
        ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');

        ws.onopen = () => {
          if (isDisposed) return;
          setDerivData((prev) => ({ ...prev, isConnected: true }));
          // Subscribe to live ticks for Volatility 100 (1s) Index (1HZ100V)
          ws?.send(JSON.stringify({ ticks: '1HZ100V', subscribe: 1 }));

          // Heartbeat ping every 25 seconds
          pingInterval = setInterval(() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ ping: 1 }));
            }
          }, 25000);
        };

        ws.onmessage = (event) => {
          if (isDisposed) return;
          try {
            const data = JSON.parse(event.data);
            if (data.msg_type === 'tick' && data.tick) {
              const t = data.tick;
              const quote = Number(t.quote);
              const bid = Number(t.bid || (quote - 1.25));
              const ask = Number(t.ask || (quote + 1.25));
              const spread = Number((ask - bid).toFixed(2));
              const timeStr = new Date(t.epoch ? t.epoch * 1000 : Date.now()).toLocaleTimeString();

              setDerivData((prev) => {
                const prevQuote = prev.quote || quote;
                const diff = Number((quote - prevQuote).toFixed(2));
                const diffPct = prevQuote > 0 ? Number(((diff / prevQuote) * 100).toFixed(4)) : 0;
                const updatedSpark = [...prev.sparkline.slice(1), quote];

                return {
                  symbol: '1HZ100V',
                  name: 'Volatility 100 (1s) Index',
                  quote,
                  prevQuote,
                  bid,
                  ask,
                  spread,
                  change: diff,
                  changePercent: diffPct,
                  high: Math.max(prev.high, quote),
                  low: Math.min(prev.low, quote),
                  sparkline: updatedSpark,
                  isConnected: true,
                  lastUpdated: timeStr,
                };
              });

              setAssets((prev) =>
                prev.map((a) =>
                  a.id === '1HZ100V'
                    ? {
                        ...a,
                        price: quote,
                      }
                    : a
                )
              );
            }
          } catch {
            // ignore parse errors
          }
        };

        ws.onerror = () => {
          if (!isDisposed) {
            setDerivData((prev) => ({ ...prev, isConnected: false }));
          }
        };

        ws.onclose = () => {
          if (isDisposed) return;
          setDerivData((prev) => ({ ...prev, isConnected: false }));
          if (pingInterval) clearInterval(pingInterval);
          reconnectTimeout = setTimeout(connectDeriv, 3000);
        };
      } catch {
        if (!isDisposed) {
          reconnectTimeout = setTimeout(connectDeriv, 3000);
        }
      }
    };

    connectDeriv();

    // Resilient 1-second dynamic heartbeat generator if WS is disconnected/connecting
    const fallbackTicker = setInterval(() => {
      if (!derivDataRef.current.isConnected) {
        const curSymbolObj = AVAILABLE_BOT_SYMBOLS.find((s) => s.id === adminSelectedSymbolRef.current) || AVAILABLE_BOT_SYMBOLS[0];
        setDerivData((prev) => {
          const delta = (Math.random() - 0.49) * (curSymbolObj.basePrice > 1000 ? 16.5 : 0.85);
          const newQuote = Math.max(1, Number((prev.quote + delta).toFixed(prev.quote > 10 ? 2 : 4)));
          const diff = Number((newQuote - prev.quote).toFixed(2));
          const diffPct = Number(((diff / prev.quote) * 100).toFixed(4));
          const updatedSpark = [...prev.sparkline.slice(1), newQuote];

          return {
            ...prev,
            symbol: curSymbolObj.symbol,
            name: curSymbolObj.name,
            quote: newQuote,
            prevQuote: prev.quote,
            bid: Number((newQuote - 1.35).toFixed(2)),
            ask: Number((newQuote + 1.35).toFixed(2)),
            spread: 2.70,
            change: diff,
            changePercent: diffPct,
            high: Math.max(prev.high, newQuote),
            low: Math.min(prev.low, newQuote),
            sparkline: updatedSpark,
            lastUpdated: new Date().toLocaleTimeString(),
          };
        });

        setAssets((prev) =>
          prev.map((a) =>
            a.id === curSymbolObj.id || a.id === '1HZ100V'
              ? {
                  ...a,
                  price: derivDataRef.current.quote,
                }
              : a
          )
        );
      }
    }, 1000);

    return () => {
      isDisposed = true;
      if (pingInterval) clearInterval(pingInterval);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      clearInterval(fallbackTicker);
      if (ws) {
        try {
          ws.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Bot Trading Simulation Engine Loop & Master Deriv Pooled Engine
  const riskRef = useRef(riskSettings);
  const botStatsRef = useRef(botStats);
  const userRef = useRef(user);

  useEffect(() => {
    riskRef.current = riskSettings;
    botStatsRef.current = botStats;
    userRef.current = user;
  });

  // Calculate active pool participants and total pooled stake dynamically
  const activePoolParticipants = useMemo<PoolParticipant[]>(() => {
    const list: PoolParticipant[] = [];

    users.forEach((u) => {
      const isRunning = u.id === user?.id ? botRunning : !!u.botRunning;
      if (isRunning && u.role !== 'admin') {
        const userStake = u.id === user?.id
          ? Math.min(riskSettings.stake, (user?.cashBalance ?? riskSettings.stake))
          : (u.id === 'usr_003' ? 1000 : 500);

        list.push({
          userId: u.id,
          userName: u.displayName || u.username,
          userAccountId: u.accountId,
          stake: userStake,
          balance: u.id === user?.id ? (user?.cashBalance ?? u.cashBalance) : u.cashBalance,
          sharePercent: 0,
        });
      }
    });

    const total = list.reduce((acc, p) => acc + p.stake, 0);
    return list.map((p) => ({
      ...p,
      sharePercent: total > 0 ? Number(((p.stake / total) * 100).toFixed(1)) : 0,
    }));
  }, [users, user, botRunning, riskSettings.stake]);

  const totalPoolStake = useMemo(() => {
    return activePoolParticipants.reduce((acc, p) => acc + p.stake, 0);
  }, [activePoolParticipants]);

  const activePoolParticipantsRef = useRef(activePoolParticipants);
  useEffect(() => {
    activePoolParticipantsRef.current = activePoolParticipants;
  }, [activePoolParticipants]);

  // Admin controls: Set user profit return percentage (e.g., 85%)
  const setUserProfitReturnRate = useCallback((rate: number) => {
    const bounded = Math.max(10, Math.min(100, Math.round(rate)));
    setUserProfitReturnRateState(bounded);
    try {
      localStorage.setItem(PROFIT_RETURN_KEY, bounded.toString());
    } catch {}
    triggerToast(`User profit return rate configured to ${bounded}%`);
  }, [triggerToast]);

  // Admin controls: Update Master Deriv Account
  const updateMasterDerivAccount = useCallback((updates: Partial<MasterDerivAccount>) => {
    setMasterDerivAccount((prev) => {
      const next = { ...prev, ...updates, lastSync: Date.now() };
      try {
        localStorage.setItem(MASTER_DERIV_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    triggerToast('Master Deriv Account updated successfully');
  }, [triggerToast]);

  // Master Trade Execution Engine
  const executeMasterTrade = useCallback(
    (forcedOutcome?: 'win' | 'loss') => {
      const curDeriv = derivDataRef.current;
      const curSymbolObj = AVAILABLE_BOT_SYMBOLS.find((s) => s.id === adminSelectedSymbolRef.current) || AVAILABLE_BOT_SYMBOLS[0];
      const curReturnRate = userProfitReturnRateRef.current;
      const participants = activePoolParticipantsRef.current;

      if (participants.length === 0) {
        return { success: false, message: 'No active user bots currently enrolled in the pool.' };
      }

      const totalStake = participants.reduce((sum, p) => sum + p.stake, 0);
      if (totalStake <= 0) {
        return { success: false, message: 'Total pooled stake is 0.' };
      }

      // Determine trade outcome: Win rate ~68% or forced by Admin
      const isWin = forcedOutcome ? forcedOutcome === 'win' : Math.random() < 0.68;
      const currentPrice = curDeriv.quote || curSymbolObj.basePrice;
      const tickShift = (Math.random() * 0.0006 + 0.0002) * currentPrice;
      const exitPrice = Number((isWin ? currentPrice + tickShift : currentPrice - tickShift).toFixed(2));
      const side: 'buy' | 'sell' = Math.random() < 0.5 ? 'buy' : 'sell';

      const contractId = `DRV-CNT-${Math.floor(100000 + Math.random() * 900000)}`;
      const tradeId = `mst_${Date.now()}`;

      // Calculate outcome distribution for every participating user:
      // If WIN: user gets profit = stake * (returnRate / 100)
      // If LOSS: user loses stake = -stake deducted from balance
      const participantResults = participants.map((p) => {
        if (isWin) {
          const profit = Number((p.stake * (curReturnRate / 100)).toFixed(2));
          return {
            userId: p.userId,
            userName: p.userName,
            userAccountId: p.userAccountId,
            stake: p.stake,
            pnl: profit,
          };
        } else {
          return {
            userId: p.userId,
            userName: p.userName,
            userAccountId: p.userAccountId,
            stake: p.stake,
            pnl: -p.stake,
          };
        }
      });

      const totalUserPayout = participantResults.reduce((sum, r) => sum + r.pnl, 0);

      // 1. Update Deriv Master Account balance
      const derivGrossPnl = isWin ? totalStake * 0.95 : -totalStake;
      setMasterDerivAccount((prev) => {
        const newBal = Number(Math.max(1000, prev.balance + derivGrossPnl).toFixed(2));
        const next = { ...prev, balance: newBal, lastSync: Date.now() };
        try {
          localStorage.setItem(MASTER_DERIV_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });

      // 2. Update all users balances in users array
      setUsers((prev) => {
        const updated = prev.map((u) => {
          const foundResult = participantResults.find((r) => r.userId === u.id);
          if (foundResult) {
            const newBal = Number(Math.max(0, u.cashBalance + foundResult.pnl).toFixed(2));
            return {
              ...u,
              cashBalance: newBal,
              totalTrades: (u.totalTrades || 0) + 1,
            };
          }
          return u;
        });
        try {
          localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // 3. If current logged-in user participated, update their balance, stats & bot console log
      const currentUserResult = participantResults.find((r) => r.userId === userRef.current?.id);
      if (currentUserResult) {
        setUser((prev) => {
          if (!prev) return null;
          const newBal = Number(Math.max(0, prev.cashBalance + currentUserResult.pnl).toFixed(2));
          const updated = {
            ...prev,
            cashBalance: newBal,
            totalTrades: (prev.totalTrades || 0) + 1,
          };
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        });

        setBotStats((prev) => {
          const newWins = isWin ? prev.wins + 1 : prev.wins;
          const newLosses = !isWin ? prev.losses + 1 : prev.losses;
          const total = newWins + newLosses;
          const newPnl = Number((prev.pnl + currentUserResult.pnl).toFixed(2));
          const newRate = total > 0 ? Number(((newWins / total) * 100).toFixed(1)) : 0;
          return {
            wins: newWins,
            losses: newLosses,
            pnl: newPnl,
            rate: newRate,
          };
        });

        // Add order record
        const autoOrder: TradeOrder = {
          id: `bot_ord_${Date.now()}`,
          assetId: curSymbolObj.id,
          symbol: curSymbolObj.symbol,
          name: curSymbolObj.name,
          side,
          type: 'market',
          price: currentPrice,
          amount: Number((currentUserResult.stake / currentPrice).toFixed(6)),
          total: currentUserResult.stake,
          status: 'filled',
          timestamp: Date.now(),
        };
        setOrders((prev) => [autoOrder, ...prev]);

        if (isWin) {
          addBotLog(
            `🏆 MASTER DERIV WON [${contractId}]: ${curSymbolObj.name} | Stake $${currentUserResult.stake} -> +$${currentUserResult.pnl.toFixed(2)} (${curReturnRate}% return) credited to balance.`,
            'win'
          );
        } else {
          addBotLog(
            `🛑 MASTER DERIV LOST [${contractId}]: ${curSymbolObj.name} | -$${Math.abs(currentUserResult.pnl).toFixed(2)} stake deducted from balance.`,
            'loss'
          );
        }
      }

      // 4. Save Master Pool Trade audit record
      const newMasterTrade: MasterPoolTrade = {
        id: tradeId,
        contractId,
        symbol: curSymbolObj.symbol,
        symbolName: curSymbolObj.name,
        side,
        totalStake,
        entryPrice: currentPrice,
        exitPrice,
        outcome: isWin ? 'win' : 'loss',
        returnPercent: curReturnRate,
        userPayoutTotal: Number(totalUserPayout.toFixed(2)),
        participantCount: participants.length,
        participants: participantResults,
        timestamp: Date.now(),
        status: 'settled',
      };

      setMasterTrades((prev) => {
        const next = [newMasterTrade, ...prev].slice(0, 50);
        try {
          localStorage.setItem(MASTER_TRADES_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });

      triggerToast(
        isWin
          ? `⚡ Master Deriv Trade WON! +$${totalUserPayout.toLocaleString()} distributed to ${participants.length} pool bots.`
          : `⚠️ Master Deriv Trade LOST. -$${totalStake.toLocaleString()} deducted across ${participants.length} pool bots.`
      );

      return {
        success: true,
        message: `Master Deriv trade executed: ${isWin ? 'WIN' : 'LOSS'} on ${curSymbolObj.symbol}`,
        trade: newMasterTrade,
      };
    },
    [addBotLog, triggerToast]
  );

  // Toggle Bot with active Deriv symbol configured by admin
  const toggleBot = useCallback(() => {
    const curSymbolObj = AVAILABLE_BOT_SYMBOLS.find((s) => s.id === adminSelectedSymbolRef.current) || AVAILABLE_BOT_SYMBOLS[0];
    setBotRunning((prev) => {
      const next = !prev;
      if (next) {
        addBotLog(`[START] Bot online & enrolled in Master Deriv Pool. Asset: ${curSymbolObj.name} [${curSymbolObj.symbol}] | Personal Stake: $${riskRef.current.stake} | Target: +$${riskRef.current.profitTarget} | Stop: -$${riskRef.current.lossTarget}`, 'alert');
        triggerToast(`Enrolled in Master Deriv Pool on ${curSymbolObj.name}!`);
      } else {
        addBotLog('[STOP] Bot stopped by user. Removed from Master Pool.', 'system');
        triggerToast('Bot stopped. Disenrolled from pool.');
      }
      return next;
    });
  }, [addBotLog, triggerToast]);

  // Master Bot Execution Engine Loop
  useEffect(() => {
    // Active if current user bot is running OR if any simulated user bots are running
    const hasRunningBots = botRunning || users.some((u) => u.botRunning && u.role !== 'admin');
    if (!hasRunningBots) return;

    let step = 0;
    const interval = setInterval(() => {
      const curRisk = riskRef.current;
      const curStats = botStatsRef.current;
      const curUser = userRef.current;
      const curDeriv = derivDataRef.current;
      const curSymbolObj = AVAILABLE_BOT_SYMBOLS.find((s) => s.id === adminSelectedSymbolRef.current) || AVAILABLE_BOT_SYMBOLS[0];
      const symbol = curSymbolObj.symbol;
      const assetName = curSymbolObj.name;
      const currentDerivPrice = curDeriv.quote || curSymbolObj.basePrice;

      // Check current user target profit or loss limit if their bot is active
      if (botRunning && curUser) {
        if (curStats.pnl >= curRisk.profitTarget) {
          addBotLog(`🏆 Personal Target Profit of +$${curRisk.profitTarget} reached on ${symbol}! Auto-stopping bot.`, 'win');
          setBotRunning(false);
          triggerToast(`Profit target reached! +$${curStats.pnl.toFixed(2)}`);
          return;
        }

        if (curStats.pnl <= -curRisk.lossTarget) {
          addBotLog(`🛑 Personal Loss limit of -$${curRisk.lossTarget} hit on ${symbol}! Auto-stopping bot to protect capital.`, 'loss');
          setBotRunning(false);
          triggerToast(`Loss limit reached (-$${curRisk.lossTarget})`);
          return;
        }
      }

      step++;

      if (step % 2 === 1) {
        // Scanning phase: scan Deriv indicators for the master pool
        const indicator = [
          'Master Pool Algo: EMA 9/21 Dynamic Cross',
          'Master Pool Algo: RSI Mean Reversion (32.4)',
          'Master Pool Algo: Deriv Volatility Spike Momentum',
          'Master Pool Algo: 1s Tick Velocity Breakout',
          'Master Pool Algo: Liquidity Pool Order Block Match'
        ][Math.floor(Math.random() * 5)];

        const participants = activePoolParticipantsRef.current;
        const totalStake = participants.reduce((s, p) => s + p.stake, 0);

        if (botRunning) {
          addBotLog(
            `Scanning ${assetName} [${symbol}] @ $${currentDerivPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} | Signal: ${indicator} | Master Pool: $${totalStake.toLocaleString()} (${participants.length} bots)`,
            'info'
          );
        }
      } else {
        // Signal trigger -> Execute Master Single Trade on Admin Deriv Account!
        executeMasterTrade();
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [botRunning, users, executeMasterTrade, addBotLog, triggerToast]);


  // Save changes to localStorage on state changes ONLY after initial client hydration
  useEffect(() => {
    if (!isHydrated) return;
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
  }, [positions, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }, [transactions, isHydrated]);

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
        if (!authenticatedUser.accountId) {
          authenticatedUser.accountId = generateAccountId();
        }
        setUser(authenticatedUser);
        triggerToast(`Welcome back, ${authenticatedUser.displayName || authenticatedUser.username}! (${authenticatedUser.accountId})`);
        return { success: true };
      }

      if (cleanId === 'admin' || cleanId === 'admin@gsquad.io' || cleanId === 'adminsquad') {
        const adminUser: User = {
          id: 'usr_006',
          accountId: 'GSQ-99001122',
          username: 'AdminSquad',
          email: 'admin@gsquad.io',
          displayName: 'Executive Administrator',
          avatarSeed: 'admin',
          createdAt: Date.now() - 86400000 * 30,
          tier: 'SuperAdmin',
          isVerified: true,
          cashBalance: 250000.00,
          startingBalance: 250000,
          phone: '+1 (800) 555-GSQD',
          role: 'admin',
          botRunning: false,
          totalTrades: 0,
        };
        setUser(adminUser);
        setIsAdminMode(true);
        triggerToast('Executive Administrator authenticated. Admin Dashboard active.');
        return { success: true };
      }

      if (cleanId === 'demo' || cleanId === 'trader' || cleanId === 'user@gsquad.io' || cleanId === 'user@auratrade.com') {
        const demoUser: User = {
          id: 'demo-usr-01',
          accountId: 'GSQ-73835838',
          username: 'DemoTrader',
          email: 'demo@gsquad.io',
          displayName: 'Alex Rivers',
          avatarSeed: 'alex',
          createdAt: Date.now() - 86400000 * 14,
          tier: 'VIP Pro Tier',
          isVerified: true,
          cashBalance: 50000,
          startingBalance: 50000,
          phone: '+1 (555) 234-8921',
          role: 'user',
          botRunning: true,
          totalTrades: 142,
        };
        setUser(demoUser);
        triggerToast('Logged in as Alex Rivers (GSQ-73835838)');
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

      const newAccountId = generateAccountId();

      const newUser: User = {
        id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        accountId: newAccountId,
        username: cleanUsername,
        email: cleanEmail,
        displayName: cleanUsername,
        avatarSeed: cleanUsername.toLowerCase(),
        createdAt: Date.now(),
        tier: 'VIP Trader',
        isVerified: true,
        cashBalance: 50000,
        startingBalance: 50000,
        phone: '+1 (555) 890-0192',
        role: 'user',
        botRunning: false,
        totalTrades: 0,
      };

      const accountToStore = { ...newUser, passwordHash: pass };
      registeredList.push(accountToStore);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(registeredList));

      // Synchronize with admin users list
      setUsers((prev) => {
        const next = [newUser, ...prev.filter((u) => u.email !== cleanEmail)];
        try {
          localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });

      setUser(newUser);
      triggerToast(`Account created! Account ID: ${newAccountId}`);
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to create account.' };
    }
  }, [triggerToast]);

  // Auth: Quick Demo login
  const loginDemo = useCallback(() => {
    const demoUser: User = {
      id: 'demo-usr-default',
      accountId: 'GSQ-73835838',
      username: 'GoldTrader99',
      email: 'trader@gsquad.io',
      displayName: 'Morgan Vance',
      avatarSeed: 'morgan',
      createdAt: Date.now() - 86400000 * 22,
      tier: 'VIP Institutional',
      isVerified: true,
      cashBalance: 50000.00,
      startingBalance: 50000,
    };
    setUser(demoUser);
    triggerToast('Logged in as Morgan Vance (GSQ-73835838)');
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

  // Deposit funds (USDT TRC-20)
  const depositFunds = useCallback(
    (amount: number, txHash?: string, address?: string) => {
      if (!user) return;
      const updated = Number((user.cashBalance + amount).toFixed(2));
      setUser((prev) => (prev ? { ...prev, cashBalance: updated } : null));

      const hash = txHash || Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const depositTx: WalletTransaction = {
        id: `tx_dep_${Date.now()}`,
        type: 'deposit',
        amount,
        network: 'USDT (TRC-20)',
        address: address || 'TLvNf7Mqk1R76wJ3r9xY5E8bUqR1yXz2A4',
        txHash: hash,
        status: 'completed',
        timestamp: Date.now(),
      };
      setTransactions((prev) => [depositTx, ...prev]);

      const newNotif: NotificationItem = {
        id: `notif_dep_${Date.now()}`,
        title: 'USDT TRC-20 Deposit Credited',
        message: `+${amount.toLocaleString()} USDT received on TRON network. Balance updated.`,
        timestamp: Date.now(),
        read: false,
        type: 'deposit',
      };
      setNotifications((prev) => [newNotif, ...prev]);
      triggerToast(`Deposit of +$${amount.toLocaleString()} USDT confirmed!`);
    },
    [user, triggerToast]
  );

  // Withdraw funds (USDT TRC-20)
  const withdrawFunds = useCallback(
    (amount: number, destination = 'TX9zQ...7v8K') => {
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

      const hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const withdrawTx: WalletTransaction = {
        id: `tx_wth_${Date.now()}`,
        type: 'withdraw',
        amount,
        network: 'USDT (TRC-20)',
        address: destination,
        txHash: hash,
        status: 'completed',
        timestamp: Date.now(),
      };
      setTransactions((prev) => [withdrawTx, ...prev]);

      const newNotif: NotificationItem = {
        id: `notif_wth_${Date.now()}`,
        title: 'USDT TRC-20 Withdrawal Sent',
        message: `-${amount.toLocaleString()} USDT sent to ${destination} via TRON network.`,
        timestamp: Date.now(),
        read: false,
        type: 'deposit',
      };
      setNotifications((prev) => [newNotif, ...prev]);
      triggerToast(`Withdrawal of -$${amount.toLocaleString()} USDT processed!`);
      return { success: true, message: `Withdrawn $${amount.toLocaleString()} USDT successfully.` };
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

  const toggleAdminMode = useCallback(() => {
    setIsAdminMode((prev) => !prev);
  }, []);

  // Admin: Add funds to user
  const adminAddFunds = useCallback(
    (userId: string, amount: number, note?: string) => {
      if (amount <= 0) return;
      let targetUser: User | null = null;

      setUsers((prev) => {
        const next = prev.map((u) => {
          if (u.id === userId) {
            targetUser = u;
            return {
              ...u,
              cashBalance: Number((u.cashBalance + amount).toFixed(2)),
            };
          }
          return u;
        });
        try {
          localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });

      setUser((prev) => {
        if (prev && prev.id === userId) {
          const updated = {
            ...prev,
            cashBalance: Number((prev.cashBalance + amount).toFixed(2)),
          };
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        }
        return prev;
      });

      const target = targetUser || users.find((u) => u.id === userId) || user;
      const tx: WalletTransaction = {
        id: `tx_adm_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        userId,
        userName: target?.displayName || target?.username || 'Trader',
        userAccountId: target?.accountId || 'GSQ-SYSTEM',
        type: 'deposit',
        amount,
        network: 'USDT (TRC-20)',
        address: 'TLvNf7Mqk1R76wJ3r9xY5E8bUqR1yXz2A4',
        txHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        status: 'completed',
        timestamp: Date.now(),
        note: note || `Admin credited +$${amount.toLocaleString()} USDT`,
      };

      setTransactions((prev) => {
        const nextTx = [tx, ...prev];
        try {
          localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(nextTx));
        } catch {}
        return nextTx;
      });

      triggerToast(`Added +$${amount.toLocaleString()} USDT to ${target?.displayName || 'User'}`);
    },
    [users, user, triggerToast]
  );

  // Admin: Deduct funds from user
  const adminDeductFunds = useCallback(
    (userId: string, amount: number, note?: string) => {
      if (amount <= 0) return { success: false, message: 'Amount must be greater than zero' };
      const target = users.find((u) => u.id === userId) || (user?.id === userId ? user : null);
      if (!target) return { success: false, message: 'User not found' };

      if (target.cashBalance < amount) {
        return {
          success: false,
          message: `Cannot deduct $${amount.toLocaleString()}. Balance is only $${target.cashBalance.toLocaleString()}.`,
        };
      }

      setUsers((prev) => {
        const next = prev.map((u) => {
          if (u.id === userId) {
            return {
              ...u,
              cashBalance: Number((u.cashBalance - amount).toFixed(2)),
            };
          }
          return u;
        });
        try {
          localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });

      setUser((prev) => {
        if (prev && prev.id === userId) {
          const updated = {
            ...prev,
            cashBalance: Number((prev.cashBalance - amount).toFixed(2)),
          };
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        }
        return prev;
      });

      const tx: WalletTransaction = {
        id: `tx_adm_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        userId,
        userName: target.displayName || target.username,
        userAccountId: target.accountId,
        type: 'withdraw',
        amount,
        network: 'USDT (TRC-20)',
        address: 'TLvNf7Mqk1R76wJ3r9xY5E8bUqR1yXz2A4',
        txHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        status: 'completed',
        timestamp: Date.now(),
        note: note || `Admin debited -$${amount.toLocaleString()} USDT`,
      };

      setTransactions((prev) => {
        const nextTx = [tx, ...prev];
        try {
          localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(nextTx));
        } catch {}
        return nextTx;
      });

      triggerToast(`Deducted -$${amount.toLocaleString()} USDT from ${target.displayName}`);
      return { success: true, message: `Successfully deducted $${amount.toLocaleString()}` };
    },
    [users, user, triggerToast]
  );

  // Admin: Edit user info
  const adminEditUser = useCallback(
    (userId: string, updates: Partial<User>) => {
      setUsers((prev) => {
        const next = prev.map((u) => (u.id === userId ? { ...u, ...updates } : u));
        try {
          localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });

      setUser((prev) => {
        if (prev && prev.id === userId) {
          const updated = { ...prev, ...updates };
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        }
        return prev;
      });

      triggerToast('User profile updated successfully');
    },
    [triggerToast]
  );

  // Admin: Delete user
  const adminDeleteUser = useCallback(
    (userId: string) => {
      setUsers((prev) => {
        const next = prev.filter((u) => u.id !== userId);
        try {
          localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });

      if (user?.id === userId) {
        setUser(null);
        triggerToast('Current user deleted. Session ended.');
      } else {
        triggerToast('User account removed permanently');
      }
      return { success: true, message: 'User deleted' };
    },
    [user, triggerToast]
  );

  // Admin: Stop user bot
  const adminStopUserBot = useCallback(
    (userId: string) => {
      setUsers((prev) => {
        const next = prev.map((u) => (u.id === userId ? { ...u, botRunning: false } : u));
        try {
          localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });

      if (user?.id === userId || (userId === 'usr_001' && botRunning)) {
        setBotRunning(false);
        addBotLog('⚠️ Admin remote override: Trading bot was halted by system administrator.', 'alert');
      }

      triggerToast('User bot stopped by Administrator');
    },
    [user, botRunning, addBotLog, triggerToast]
  );

  // Admin: Emergency stop all bots
  const adminStopAllBots = useCallback(() => {
    setUsers((prev) => {
      const next = prev.map((u) => ({ ...u, botRunning: false }));
      try {
        localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    setBotRunning(false);
    addBotLog('🚨 EMERGENCY OVERRIDE: All automated trading bots stopped across platform.', 'alert');
    triggerToast('Emergency Killswitch: All trading bots halted!');
  }, [addBotLog, triggerToast]);

  // Admin: Select trading symbol for bot to use
  const adminSelectBotSymbol = useCallback(
    (symbolId: string) => {
      const targetSymbol = AVAILABLE_BOT_SYMBOLS.find((s) => s.id === symbolId);
      if (!targetSymbol) return;

      setAdminSelectedSymbol(symbolId);
      try {
        localStorage.setItem(ADMIN_BOT_SYMBOL_KEY, symbolId);
      } catch {}

      setDerivData((prev) => ({
        ...prev,
        symbol: targetSymbol.symbol,
        name: targetSymbol.name,
        quote: targetSymbol.basePrice,
        bid: Number((targetSymbol.basePrice - 1.25).toFixed(2)),
        ask: Number((targetSymbol.basePrice + 1.25).toFixed(2)),
        spread: 2.50,
      }));

      addBotLog(`[ADMIN CONFIG] Active bot trading symbol set to: ${targetSymbol.name} [${targetSymbol.symbol}]`, 'alert');
      triggerToast(`Bot trading symbol changed to ${targetSymbol.name}!`);
    },
    [addBotLog, triggerToast]
  );

  // Admin: Update transaction status
  const adminUpdateTransactionStatus = useCallback(
    (txId: string, status: 'completed' | 'processing' | 'pending' | 'rejected') => {
      setTransactions((prev) => {
        const next = prev.map((tx) => (tx.id === txId ? { ...tx, status } : tx));
        try {
          localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
      triggerToast(`Transaction status marked as ${status.toUpperCase()}`);
    },
    [triggerToast]
  );

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
        transactions,
        isTransactionModalOpen,
        openTransactionModal,
        closeTransactionModal,
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
        derivData,
        // Master Deriv Account & Pooled Trading Engine
        masterDerivAccount,
        updateMasterDerivAccount,
        userProfitReturnRate,
        setUserProfitReturnRate,
        activePoolParticipants,
        totalPoolStake,
        masterTrades,
        executeMasterTrade,
        // Admin
        isAdminMode,
        setIsAdminMode,
        toggleAdminMode,
        users,
        adminAddFunds,
        adminDeductFunds,
        adminEditUser,
        adminDeleteUser,
        adminStopUserBot,
        adminStopAllBots,
        availableBotSymbols: AVAILABLE_BOT_SYMBOLS,
        adminSelectedSymbol,
        adminSelectBotSymbol,
        adminUpdateTransactionStatus,
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
