import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Search, TrendingUp, User as UserIcon, LogOut, Star, Crown, BookOpen, Menu, ArrowLeft } from 'lucide-react';
import { Input } from './components/ui/Input';
import { Button } from './components/ui/Button';
import { StockChart } from './components/StockChart';
import { StockStats } from './components/StockStats';
import { AIAnalysis } from './components/AIAnalysis';
import { AIChat } from './components/AIChat';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SubscriptionModal } from './components/SubscriptionModal';
import { PremiumDashboard } from './components/PremiumDashboard';
import { LearnStocky } from './components/LearnStocky';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { ProfilePage } from './components/ProfilePage';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { SuggestedCompanies } from './components/SuggestedCompanies';
import { NewsSection } from './components/NewsSection';
import { FAQPage } from './components/FAQPage';
import { AboutPage } from './components/AboutPage';
import { auth, db } from './lib/firebase';
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { TickerTape } from 'react-ts-tradingview-widgets';

function DashboardContent({ ticker, setTicker, favorites, toggleFavorite }: any) {
  const { user, db: authDb } = useAuth() as any;

  const saveSearchHistory = async (stockName: string) => {
    if (!user || !db) return;
    try {
      await addDoc(collection(db, 'StockSearchHistory'), {
        userId: user.uid,
        stockName,
        timestamp: new Date()
      });
    } catch (err) {
      console.error("Error saving search history:", err);
    }
  };

  const handleSearch = (newTicker: string) => {
    setTicker(newTicker);
    saveSearchHistory(newTicker);
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <SuggestedCompanies onSelect={handleSearch} />

      <div className="mb-12">
        <TickerTape colorTheme="dark" displayMode="regular" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={ticker}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column: Chart & Stats */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold tracking-tight">{ticker}</h1>
                  <span className="flex items-center text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
                    LIVE
                  </span>
                </div>
                <p className="text-zinc-400 text-lg">TradingView Market Data</p>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleFavorite}
                className={favorites.includes(ticker) ? "text-yellow-400 border-yellow-400/50 bg-yellow-400/10" : ""}
              >
                <Star className="h-5 w-5" fill={favorites.includes(ticker) ? "currentColor" : "none"} />
              </Button>
            </div>

            <div className="h-[500px]">
              <StockChart ticker={ticker} />
            </div>

            <StockStats ticker={ticker} />
          </div>

          {/* Right Column: AI Analysis */}
          <div className="lg:col-span-1">
            <AIAnalysis ticker={ticker} />
          </div>
        </motion.div>
      </AnimatePresence>

      <NewsSection />
    </>
  );
}

function PremiumContent({ ticker, setTicker, favorites, toggleFavorite }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setTicker(searchQuery.trim().toUpperCase());
    }
  };

  return (
    <>
      <div className="mb-8 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <Input
            type="text"
            placeholder="Search premium assets (e.g., TSLA, BTCUSD)..."
            className="pl-10 h-12 text-lg bg-zinc-900/50 border-yellow-500/30 focus-visible:ring-yellow-500 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            className="absolute right-1 top-1 h-10 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
          >
            Deep Dive
          </Button>
        </form>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`premium-${ticker}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold tracking-tight text-white">{ticker}</h1>
                <span className="flex items-center text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20 uppercase tracking-wider">
                  <Crown className="w-3 h-3 mr-1" /> Premium
                </span>
              </div>
              <p className="text-zinc-400 text-lg">Advanced Real-Time Analysis</p>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleFavorite}
              className={favorites.includes(ticker) ? "text-yellow-400 border-yellow-400/50 bg-yellow-400/10" : ""}
            >
              <Star className="h-5 w-5" fill={favorites.includes(ticker) ? "currentColor" : "none"} />
            </Button>
          </div>

          <PremiumDashboard ticker={ticker} />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function Layout() {
  const { user, profile, isConfigured } = useAuth();
  const [ticker, setTicker] = useState('AAPL');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && db) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user || !db) return;
    try {
      const q = query(collection(db, 'FavoriteStocks'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const favs = querySnapshot.docs.map(doc => doc.data().stockTicker);
      setFavorites(favs);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!db) return;

    try {
      if (favorites.includes(ticker)) {
        setFavorites(favorites.filter(f => f !== ticker));
      } else {
        await addDoc(collection(db, 'FavoriteStocks'), {
          userId: user.uid,
          stockTicker: ticker,
          addedAt: new Date()
        });
        setFavorites([...favorites, ticker]);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const handlePremiumClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate('/login');
      return;
    }
    if (profile?.subscriptionStatus === 'none' || profile?.subscriptionStatus === 'expired') {
      e.preventDefault();
      setIsSubModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {user && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}

            <Link to="/" className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold tracking-tight hidden sm:inline-block">AI Stock Insights</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-1 ml-4">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/about' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                About
              </Link>
              <Link 
                to="/faq" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/faq' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                FAQ
              </Link>

              {user && (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/premium" 
                    onClick={handlePremiumClick}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${location.pathname === '/premium' ? 'bg-yellow-500/10 text-yellow-400' : 'text-zinc-400 hover:text-yellow-400 hover:bg-yellow-500/5'}`}
                  >
                    <Crown className="w-4 h-4 mr-1.5" />
                    Premium
                  </Link>
                  <Link 
                    to="/learn" 
                    onClick={handlePremiumClick}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${location.pathname === '/learn' ? 'bg-indigo-500/10 text-indigo-400' : 'text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/5'}`}
                  >
                    <BookOpen className="w-4 h-4 mr-1.5" />
                    Learn Stocky
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {profile?.subscriptionStatus === 'trial' && (
                  <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                    Trial ends {profile.trialEndsAt?.toLocaleDateString()}
                  </span>
                )}
                <Link to="/profile" className="text-sm text-zinc-400 hover:text-white transition-colors hidden md:inline-flex items-center space-x-2">
                  <UserIcon className="w-4 h-4" />
                  <span>{user.displayName || user.email}</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => auth && signOut(auth)}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                <UserIcon className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className={['/', '/about', '/faq', '/login', '/register'].includes(location.pathname) ? "" : "container mx-auto px-4 py-8 max-w-7xl"}>
        <Routes>
          <Route path="/" element={<LandingPage onSignIn={() => navigate('/login')} onRegister={() => navigate('/register')} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage initialMode="login" />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage initialMode="register" />} />
          <Route path="/dashboard" element={user ? <DashboardContent ticker={ticker} setTicker={setTicker} favorites={favorites} toggleFavorite={toggleFavorite} /> : <Navigate to="/login" replace />} />
          <Route path="/premium" element={user ? <PremiumContent ticker={ticker} setTicker={setTicker} favorites={favorites} toggleFavorite={toggleFavorite} /> : <Navigate to="/login" replace />} />
          <Route path="/learn" element={user ? <LearnStocky /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <SubscriptionModal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} />
      <AIChat />
      
      {!isConfigured && (
        <div className="fixed bottom-4 right-4 max-w-sm p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 text-sm backdrop-blur-md z-50">
          <strong>Note:</strong> Firebase is not configured. Authentication and saving favorites will not work. Please add Firebase config to your environment variables.
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}
