import React, { useState, useEffect } from 'react';
import { AdvancedRealTimeChart, TechnicalAnalysis, SymbolInfo, CompanyProfile } from 'react-ts-tradingview-widgets';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Sparkles, Activity, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface PremiumDashboardProps {
  ticker: string;
}

export const PremiumDashboard: React.FC<PremiumDashboardProps> = ({ ticker }) => {
  const [liveAnalysis, setLiveAnalysis] = useState<string>('Initializing real-time AI analysis...');
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchLiveAnalysis = async () => {
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return;
        
        const ai = new GoogleGenAI({ apiKey });
        
        const prompt = `
          You are a high-frequency trading AI assistant. The user is currently looking at the live chart for ${ticker}.
          Give a very brief, punchy, "second-to-second" style analysis of what might be happening right now in the market for this asset.
          Keep it under 3 sentences. Use a professional, urgent, and analytical tone.
          Example: "Volume is spiking. Watch for a breakout above the moving average. Consider tightening stop losses."
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
        });

        if (isMounted && response.text) {
          setLiveAnalysis(response.text);
        }
      } catch (error) {
        console.error("Error fetching live analysis:", error);
      }
    };

    fetchLiveAnalysis();
    
    // Refresh analysis every 30 seconds to simulate "second to second"
    const interval = setInterval(fetchLiveAnalysis, 30000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [ticker]);

  return (
    <div className="space-y-6">
      {/* Live AI Analysis Banner */}
      <Card className="border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
        <CardContent className="p-4 flex items-start space-x-4">
          <div className="p-2 bg-emerald-500/20 rounded-full">
            <BrainCircuit className="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center">
              <Activity className="w-4 h-4 mr-2" /> Live AI Market Pulse
            </h3>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              {liveAnalysis}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Chart */}
      <Card className="w-full h-[600px] overflow-hidden border-white/5 bg-zinc-950">
        <CardContent className="p-0 h-full w-full relative">
          <div className="absolute top-4 left-4 z-10 bg-zinc-900/80 backdrop-blur px-3 py-1 rounded-full border border-white/10 flex items-center shadow-lg">
            <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-xs font-medium text-zinc-200">Premium Real-Time Data</span>
          </div>
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
            container_id="premium_tradingview_chart"
            studies={["RSI@tv-basicstudies", "MACD@tv-basicstudies"]}
          />
        </CardContent>
      </Card>

      {/* Advanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden border-white/5 bg-zinc-950 md:col-span-2">
          <CardContent className="p-0 h-[400px]">
            <CompanyProfile 
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
    </div>
  );
};
