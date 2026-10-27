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
  username: string;
  email: string;
  displayName: string;
  avatarSeed: string;
  createdAt: number;
  tier: string;
  isVerified: boolean;
  cashBalance: number;
  startingBalance: number;
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
