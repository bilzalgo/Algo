'use client';

import React from 'react';
import { TradingProvider } from '@/context/TradingContext';
import { TradingDashboard } from '@/components/TradingDashboard';

export default function Page() {
  return (
    <TradingProvider>
      <TradingDashboard />
    </TradingProvider>
  );
}
