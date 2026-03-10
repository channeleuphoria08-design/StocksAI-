import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Zap, Shield, Crown } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = React.useState(false);

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    if (!user || !db) return;
    setLoading(true);
    try {
      const userRef = doc(db, 'Users', user.uid);
      const subscriptionEndsAt = new Date();
      subscriptionEndsAt.setMonth(subscriptionEndsAt.getMonth() + 1); // 1 month sub
      
      await setDoc(userRef, {
        subscriptionStatus: 'active',
        subscriptionEndsAt
      }, { merge: true });
      
      await refreshProfile();
      onClose();
    } catch (error) {
      console.error("Error subscribing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrial = async () => {
    if (!user || !db) return;
    setLoading(true);
    try {
      const userRef = doc(db, 'Users', user.uid);
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 3); // 3 days
      
      await setDoc(userRef, {
        subscriptionStatus: 'trial',
        trialEndsAt
      }, { merge: true });
      
      await refreshProfile();
      onClose();
    } catch (error) {
      console.error("Error starting trial:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 mb-6">
                <Crown className="w-8 h-8 text-yellow-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Unlock Premium Insights</h2>
              <p className="text-zinc-400 text-lg max-w-md mx-auto">
                Get real-time AI analysis, advanced charting tools, and exclusive educational content.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white">Second-to-Second AI</h4>
                    <p className="text-sm text-zinc-400">Live market pulse and actionable insights updated instantly.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white">Advanced TradingView</h4>
                    <p className="text-sm text-zinc-400">Full access to premium indicators and drawing tools.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white">Learn Stocky Academy</h4>
                    <p className="text-sm text-zinc-400">Interactive AI-generated lessons tailored to your skill level.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white">Priority Support</h4>
                    <p className="text-sm text-zinc-400">Get answers faster with priority queueing.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              {profile?.subscriptionStatus === 'none' || profile?.subscriptionStatus === 'expired' ? (
                <>
                  <Button 
                    className="w-full max-w-sm h-14 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                    onClick={handleStartTrial}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Start 3-Day Free Trial'}
                  </Button>
                  <p className="text-xs text-zinc-500">Then $19.99/month. Cancel anytime.</p>
                </>
              ) : profile?.subscriptionStatus === 'trial' ? (
                <>
                  <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl w-full max-w-sm mb-4">
                    <p className="text-yellow-400 font-medium">You are currently on a free trial.</p>
                    <p className="text-sm text-yellow-500/80 mt-1">
                      Ends on {profile.trialEndsAt?.toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    className="w-full max-w-sm h-14 text-lg font-semibold bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl"
                    onClick={handleSubscribe}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Upgrade to Full Subscription'}
                  </Button>
                </>
              ) : (
                <div className="text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-full max-w-sm">
                  <p className="text-emerald-400 font-medium flex items-center justify-center">
                    <Crown className="w-5 h-5 mr-2" />
                    Premium Active
                  </p>
                  <p className="text-sm text-emerald-500/80 mt-1">
                    Renews on {profile?.subscriptionEndsAt?.toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
