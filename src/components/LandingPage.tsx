import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Shield, Zap, BrainCircuit, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

interface LandingPageProps {
  onSignIn: () => void;
  onRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSignIn, onRegister }) => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] rounded-full bg-indigo-500/10 blur-[120px]" />
        </div>
        
        <div className="relative container mx-auto px-4 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-zinc-300">The Future of Market Intelligence</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8">
              Master the Markets with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">AI Precision</span>
            </h1>
            
            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Stop guessing. Start knowing. Our platform combines real-time TradingView data with second-to-second AI analysis to give you the ultimate edge in stocks, crypto, and forex.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={onRegister}
                className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                onClick={onSignIn}
                variant="outline"
                className="w-full sm:w-auto h-14 px-8 text-lg font-semibold border-white/10 hover:bg-white/5 rounded-xl"
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-zinc-900/50 border-y border-white/5 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why We're Different</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              We don't just show you charts. We interpret them in real-time, tailoring insights to your specific investment goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-2xl bg-zinc-950 border border-white/5 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <BrainCircuit className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Second-to-Second AI</h3>
              <p className="text-zinc-400 leading-relaxed">
                Our AI watches the live tape, giving you instant, actionable insights on price action and volume spikes as they happen.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-zinc-950 border border-white/5 hover:border-indigo-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Global Market Access</h3>
              <p className="text-zinc-400 leading-relaxed">
                Powered by TradingView, access live data for every stock, forex pair, index, and cryptocurrency in the world.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-zinc-950 border border-white/5 hover:border-yellow-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Learn Stocky Academy</h3>
              <p className="text-zinc-400 leading-relaxed">
                New to trading? Our AI generates personalized, interactive lessons to take you from beginner to pro at your own pace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
