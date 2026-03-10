import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, updateEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { User as UserIcon, Mail, Phone, MapPin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function ProfilePage() {
  const { user, profile } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
      
      // Fetch additional profile data from Firestore
      const fetchAdditionalData = async () => {
        if (!db) return;
        try {
          const userRef = doc(db, 'Users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setPhoneNumber(data.phoneNumber || '');
            setLocation(data.location || '');
            setBio(data.bio || '');
          }
        } catch (error) {
          console.error("Error fetching additional profile data:", error);
        } finally {
          setIsFetching(false);
        }
      };
      
      fetchAdditionalData();
    } else {
      setIsFetching(false);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      // Update Auth Profile
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }
      
      // Update Email (requires re-authentication usually, but we'll try)
      if (email !== user.email) {
        await updateEmail(user, email);
      }
      
      // Update Firestore Profile
      if (db) {
        const userRef = doc(db, 'Users', user.uid);
        await setDoc(userRef, {
          phoneNumber,
          location,
          bio
        }, { merge: true });
      }
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Your Profile</h1>
        <p className="text-zinc-400">Manage your account settings and personal information.</p>
      </div>

      <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="flex items-center space-x-2">
            <UserIcon className="w-5 h-5 text-emerald-500" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {message && (
            <div className={`p-4 rounded-lg mb-6 flex items-start space-x-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Display Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <Input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-10 bg-zinc-950/50 border-white/10"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-zinc-950/50 border-white/10"
                    placeholder="john@example.com"
                  />
                </div>
                <p className="text-xs text-zinc-500">Changing email may require re-authentication.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10 bg-zinc-950/50 border-white/10"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 bg-zinc-950/50 border-white/10"
                    placeholder="New York, USA"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full min-h-[100px] p-3 rounded-lg bg-zinc-950/50 border border-white/10 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-y"
                placeholder="Tell us a bit about your investing journey..."
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isLoading} className="bg-emerald-500 hover:bg-emerald-600 text-white min-w-[120px]">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card className="mt-6 bg-zinc-900/50 border-white/5 backdrop-blur-sm">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <span>Subscription Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-300 font-medium capitalize">
                {profile?.subscriptionStatus || 'None'}
              </p>
              {profile?.subscriptionStatus === 'trial' && profile.trialEndsAt && (
                <p className="text-sm text-zinc-500 mt-1">
                  Ends on {profile.trialEndsAt.toLocaleDateString()}
                </p>
              )}
              {profile?.subscriptionStatus === 'active' && profile.subscriptionEndsAt && (
                <p className="text-sm text-zinc-500 mt-1">
                  Renews on {profile.subscriptionEndsAt.toLocaleDateString()}
                </p>
              )}
            </div>
            {profile?.subscriptionStatus !== 'active' && (
              <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                Upgrade to Premium
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
