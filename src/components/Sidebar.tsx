import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { X, Home, Info, HelpCircle, Mail, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const handleSignOut = () => {
    if (auth) signOut(auth);
    onClose();
  };

  const menuItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About Us', icon: Info },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  if (user) {
    menuItems.push({ path: '/dashboard', label: 'User Dashboard', icon: LayoutDashboard });
    menuItems.push({ path: '/profile', label: 'Profile', icon: UserIcon });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-zinc-950 border-r border-white/10 z-50 shadow-2xl flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <span className="text-xl font-bold tracking-tight text-emerald-500">Menu</span>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {user && (
              <div className="p-6 border-t border-white/5">
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
