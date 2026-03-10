import React, { useState, useEffect } from 'react';
import { MiniChart } from 'react-ts-tradingview-widgets';
import { Card, CardContent } from './ui/Card';

const SUGGESTED_COMPANIES = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'BTCUSD', name: 'Bitcoin' },
  { symbol: 'EURUSD', name: 'EUR/USD' },
  { symbol: 'NVDA', name: 'NVIDIA' },
];

export const SuggestedCompanies: React.FC<{ onSelect: (ticker: string) => void }> = ({ onSelect }) => {
  return (
    <div className="mb-12">
      <h3 className="text-lg font-semibold text-zinc-300 mb-6 flex items-center">
        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
        Trending Markets
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {SUGGESTED_COMPANIES.map((company) => (
          <div 
            key={company.symbol}
            onClick={() => onSelect(company.symbol)}
            className="cursor-pointer transform hover:scale-105 transition-all duration-200"
          >
            <Card className="overflow-hidden border-white/5 bg-zinc-900/50 hover:bg-zinc-900 hover:border-emerald-500/30">
              <CardContent className="p-0 h-[120px]">
                <MiniChart 
                  symbol={company.symbol}
                  colorTheme="dark"
                  autosize
                  isTransparent
                  trendLineColor="#10b981"
                  underLineColor="rgba(16, 185, 129, 0.1)"
                  dateRange="1M"
                />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
