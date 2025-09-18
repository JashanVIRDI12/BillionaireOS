import React, { useState, useEffect } from 'react';
import { Target, Calendar, CheckSquare, Sparkles, X, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import VisionPage from './components/VisionPage';
import GoalsPage from './components/GoalsPage';
import HabitsPage from './components/HabitsPage';
import NetWorthPage from './components/NetWorthPage';
import AuthModal from './components/AuthModal';
import CookieConsent from './components/CookieConsent';
import ProfileDropdown from './components/ProfileDropdown';
import { testFirebaseConnection } from './firebase/test';
import { cn } from './utils/cn';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('vision');
  const [showQuote, setShowQuote] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading } = useAuth();

  // Array of inspirational quotes from notable figures
  const quotes = [
    {
      text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
      author: "Marcus Aurelius"
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney"
    },
    {
      text: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs"
    },
    {
      text: "Your time is limited, don't waste it living someone else's life.",
      author: "Steve Jobs"
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt"
    }
  ];

  // Get daily quote based on day of year
  const getDailyQuote = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return quotes[dayOfYear % quotes.length];
  };

  const currentQuote = getDailyQuote();

  const tabs = [
    { id: 'vision', label: 'Vision & Journal', icon: Target, component: VisionPage, color: 'sage' },
    { id: 'goals', label: 'Goals', icon: Calendar, component: GoalsPage, color: 'blue' },
    { id: 'habits', label: 'Habits & Tasks', icon: CheckSquare, component: HabitsPage, color: 'orange' },
    { id: 'networth', label: 'Net Worth', icon: DollarSign, component: NetWorthPage, color: 'green' },
  ];

  useEffect(() => {
    // Test Firebase connection
    const testResult = testFirebaseConnection();
    console.log('Firebase connection test result:', testResult);
  }, []);

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  const handleTabChange = (tabId) => {
    // Visual feedback for tab change
    const button = document.querySelector(`[data-tab="${tabId}"]`);
    if (button) {
      button.classList.add('animate-pulse-quick');
      setTimeout(() => {
        button.classList.remove('animate-pulse-quick');
      }, 300);
    }
    setActiveTab(tabId);
  };

  const handleAuthSuccess = (user) => {
    console.log('User signed in:', user);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-black border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 p-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Billionaire OS</h1>
            <p className="text-gray-600 mb-6">Your personal wealth and productivity system</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-3 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all duration-200 font-medium"
            >
              Get Started
            </button>
          </div>
        </motion.div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
        
        <CookieConsent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased">

      {/* Enhanced Minimalist Header */}
      <header className="sticky top-0 z-50 bg-white backdrop-blur-md bg-opacity-95 border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-black rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Billionaire OS
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  {user.displayName || user.phoneNumber || 'User'}
                </p>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-12">
              {/* Enhanced Tab Navigation */}
              <nav className="hidden md:flex space-x-1 bg-gray-50 rounded-xl p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-white text-black shadow-sm border border-gray-200"
                          : "text-gray-600 hover:text-gray-900 hover:bg-white hover:bg-opacity-50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden lg:inline">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
              
              {/* Profile Dropdown */}
              <ProfileDropdown />
            </div>
            
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex space-x-2 overflow-x-auto bg-gray-50 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 text-sm font-medium whitespace-nowrap rounded-md transition-all duration-200",
                  isActive
                    ? "bg-white text-black shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white hover:bg-opacity-50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 py-8"
      >
        {ActiveComponent && <ActiveComponent />}
      </motion.main>

      {/* Simple Quote */}
      <AnimatePresence>
        {showQuote && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-6 right-6 z-40 hidden lg:block"
          >
            <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-sm shadow-lg">
              <button
                onClick={() => setShowQuote(false)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-sm text-gray-700 italic pr-6">
                "{currentQuote.text}"
              </p>
              <p className="text-xs text-gray-500 mt-2 text-right font-medium">— {currentQuote.author}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <CookieConsent />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
