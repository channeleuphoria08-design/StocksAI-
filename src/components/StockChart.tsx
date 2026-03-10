import React from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { Card, CardContent } from './ui/Card';

interface StockChartProps {
  ticker: string;
}

export const StockChart: React.FC<StockChartProps> = ({ ticker }) => {
  return (
    <Card className="w-full h-full min-h-[500px] overflow-hidden border-white/5 bg-zinc-950">
      <CardContent className="p-0 h-full w-full">
        <AdvancedRealTimeChart
          symbol={ticker}
          theme="dark"
          autosize
          allow_symbol_change={false}
          hide_side_toolbar={false}
          style="1"
          locale="en"
          enable_publishing={false}
          backgroundColor="#09090b"
          gridColor="#27272a"
          hide_top_toolbar={false}
          save_image={false}
          container_id="tradingview_chart"
        />
      </CardContent>
    </Card>
  );
};
