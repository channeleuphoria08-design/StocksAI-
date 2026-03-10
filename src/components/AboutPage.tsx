import React from 'react';
import { motion } from 'motion/react';
import { Users, Target, Shield } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-12 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About AI Stock Insights</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            We are on a mission to democratize financial intelligence. By combining cutting-edge artificial intelligence with real-time market data, we empower retail investors to make decisions with institutional-grade precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 border border-white/5 p-8 rounded-2xl text-center"
          >
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
            <p className="text-zinc-400">To level the playing field by providing advanced AI analysis tools to everyone, not just Wall Street.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 border border-white/5 p-8 rounded-2xl text-center"
          >
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Our Team</h3>
            <p className="text-zinc-400">Built by a passionate team of data scientists, financial analysts, and engineers dedicated to your success.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 border border-white/5 p-8 rounded-2xl text-center"
          >
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Our Values</h3>
            <p className="text-zinc-400">Transparency, security, and continuous innovation are at the core of everything we build.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
