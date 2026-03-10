import React from 'react';
import { SymbolInfo, TechnicalAnalysis } from 'react-ts-tradingview-widgets';
import { Card, CardContent } from './ui/Card';

interface StockStatsProps {
  ticker: string;
}

export const StockStats: React.FC<StockStatsProps> = ({ ticker }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="overflow-hidden border-white/5 bg-zinc-950">
        <CardContent className="p-0 h-[400px]">
          <SymbolInfo 
            symbol={ticker} 
            colorTheme="dark" 
            autosize 
          />
        </CardContent>
      </Card>
      <Card className="overflow-hidden border-white/5 bg-zinc-950">
        <CardContent className="p-0 h-[400px]">
          <TechnicalAnalysis 
            symbol={ticker} 
            colorTheme="dark" 
            autosize 
          />
        </CardContent>
      </Card>
    </div>
  );
};
