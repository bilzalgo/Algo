export type AssetCategory = 'all' | 'crypto' | 'stocks' | 'commodities' | 'forex';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  category: 'crypto' | 'stocks' | 'commodities' | 'forex';
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume: string;
  marketCap: string;
  sparkline: number[];
  color: string;
}

export interface Position {
  id: string;
  assetId: string;
  symbol: string;
  name: string;
  side: 'buy' | 'sell';
  amount: number; // units of asset
  totalInvested: number; // USD
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: number;
}

export interface TradeOrder {
  id: string;
  assetId: string;
  symbol: string;
  name: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  price: number;
  amount: number;
  total: number;
  status: 'filled' | 'pending' | 'cancelled';
  timestamp: number;
}

export interface User {
  id: string;
  accountId: string;
  username: string;
  email: string;
  displayName: string;
  avatarSeed: string;
  createdAt: number;
  tier: string;
  isVerified: boolean;
  cashBalance: number;
  startingBalance: number;
  phone?: string;
  botRunning?: boolean;
  role?: 'admin' | 'user';
  totalTrades?: number;
}

export interface UserSettings {
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  defaultOrderType: 'market' | 'limit';
  slippageTolerance: number; // e.g. 0.5%
  leverage: number; // 1x, 2x, 5x
  chartType: 'line' | 'candlestick';
  showMovingAverages: boolean;
  orderConfirmation: boolean;
  hapticFeedback: boolean;
  soundEffects: boolean;
  priceAlerts: boolean;
  tradeNotifications: boolean;
  demoBalanceResetCount: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'order' | 'price' | 'system' | 'deposit';
}

export interface RiskSettings {
  stake: number;
  profitTarget: number;
  lossTarget: number;
}

export interface BotLog {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'trade' | 'win' | 'loss' | 'alert' | 'system';
}

export interface BotStats {
  isRunning: boolean;
  pnl: number;
  wins: number;
  losses: number;
  rate: number;
}

export interface WalletTransaction {
  id: string;
  userId?: string;
  userName?: string;
  userAccountId?: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  network: 'USDT (TRC-20)';
  address: string;
  txHash: string;
  status: 'completed' | 'processing' | 'pending' | 'rejected';
  timestamp: number;
  note?: string;
}

export interface DerivTickData {
  symbol: string;
  name: string;
  quote: number;
  prevQuote: number;
  bid: number;
  ask: number;
  spread: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  sparkline: number[];
  isConnected: boolean;
  lastUpdated: string;
}

export interface BotSymbolConfig {
  id: string;
  symbol: string;
  name: string;
  category: 'volatility' | 'crash_boom' | 'step' | 'jump';
  tickSpeed: string;
  description: string;
  basePrice: number;
}

export interface MasterDerivAccount {
  accountId: string;
  token: string;
  server: string;
  currency: 'USD';
  balance: number;
  isConnected: boolean;
  lastSync: number;
}

export interface PoolParticipant {
  userId: string;
  userName: string;
  userAccountId: string;
  stake: number;
  balance: number;
  sharePercent: number;
}

export interface MasterPoolParticipantResult {
  userId: string;
  userName: string;
  userAccountId: string;
  stake: number;
  pnl: number;
}

export interface MasterPoolTrade {
  id: string;
  contractId: string;
  symbol: string;
  symbolName: string;
  side: 'buy' | 'sell';
  totalStake: number;
  entryPrice: number;
  exitPrice: number;
  outcome: 'win' | 'loss';
  returnPercent: number;
  userPayoutTotal: number;
  participantCount: number;
  participants: MasterPoolParticipantResult[];
  timestamp: number;
  status: 'settled';
}

