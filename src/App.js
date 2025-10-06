import React, { useState, useEffect } from 'react';
import { Target, Calendar, CheckSquare, Sparkles, X, DollarSign, Rocket, ChevronDown, Briefcase, Brain, TrendingUp, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LocationProvider, useLocation } from './contexts/LocationContext';
import HomePage from './components/HomePage';
import VisionPage from './components/VisionPage';
import GoalsPage from './components/GoalsPage';
import HabitsPage from './components/HabitsPage';
import NetWorthPage from './components/NetWorthPage';
import BusinessOpportunitiesPage from './components/BusinessOpportunitiesPage';
import ProfessionIntelligencePage from './components/ProfessionIntelligencePage';
import ResumePage from './components/ResumePage';
import TestPage from './components/TestPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsConditionsPage from './components/TermsConditionsPage';
import AuthModal from './components/AuthModal';
import CookieConsent from './components/CookieConsent';
import ProfileDropdown from './components/ProfileDropdown';
import LocationSelector from './components/LocationSelector';
import Footer from './components/Footer';
import { testFirebaseConnection } from './firebase/test';
import { cn } from './utils/cn';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showQuote, setShowQuote] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const { user, loading } = useAuth();
  const { isLocationSet, updateLocation } = useLocation();

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

  const productivityTabs = [
    { id: 'vision', label: 'Journal', icon: Target, component: VisionPage, color: 'sage' },
    { id: 'goals', label: 'Goals', icon: Calendar, component: GoalsPage, color: 'blue' },
    { id: 'habits', label: 'Habits', icon: CheckSquare, component: HabitsPage, color: 'orange' },
    { id: 'networth', label: 'Net Worth', icon: DollarSign, component: NetWorthPage, color: 'green' },
  ];

  const intelligenceTabs = [
    { id: 'business', label: 'Business Intel', icon: Rocket, component: BusinessOpportunitiesPage, color: 'purple' },
    { id: 'profession', label: 'Career Intel', icon: Briefcase, component: ProfessionIntelligencePage, color: 'indigo' },
    { id: 'resume', label: 'Resume Intel', icon: FileText, component: ResumePage, color: 'gray' },
  ];

  const legalTabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: FileText, component: PrivacyPolicyPage, color: 'gray' },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText, component: TermsConditionsPage, color: 'gray' },
  ];

  const homeTab = { id: 'home', label: 'Home', icon: Sparkles, component: HomePage };
  const allTabs = [homeTab, ...productivityTabs, ...intelligenceTabs, ...legalTabs];

  // Shifting Dropdown Navigation Component
  const ShiftingDropDown = ({ activeTab, handleTabChange, productivityTabs, intelligenceTabs }) => {
    const [selected, setSelected] = useState(null);
    const [dir, setDir] = useState(null);

    const handleSetSelected = (val) => {
      if (typeof selected === "number" && typeof val === "number") {
        setDir(selected > val ? "r" : "l");
      } else if (val === null) {
        setDir(null);
      }
      setSelected(val);
    };

    const TABS = [
      {
        title: "Productivity",
        icon: TrendingUp,
        Component: () => (
          <div>
            <div className="grid grid-cols-2 gap-4">
              {productivityTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      handleTabChange(tab.id);
                      setSelected(null);
                    }}
                    className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
                      isActive 
                        ? "bg-gray-900 text-white" 
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium text-sm">{tab.label}</div>
                      <div className="text-xs opacity-70">
                        {tab.id === 'vision' && 'AI-powered journaling'}
                        {tab.id === 'goals' && 'Goal tracking & planning'}
                        {tab.id === 'habits' && 'Habit building system'}
                        {tab.id === 'networth' && 'Financial tracking'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ),
      },
      {
        title: "Intelligence",
        icon: Brain,
        Component: () => (
          <div>
            <div className="space-y-3">
              {intelligenceTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      handleTabChange(tab.id);
                      setSelected(null);
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
                      isActive 
                        ? "bg-gray-900 text-white" 
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium text-sm">{tab.label}</div>
                      <div className="text-xs opacity-70">
                        {tab.id === 'business' && 'AI business insights'}
                        {tab.id === 'profession' && 'Career intelligence'}
                        {tab.id === 'resume' && 'Resume optimization'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ),
      },
    ].map((n, idx) => ({ ...n, id: idx + 1 }));

    return (
      <div className="hidden md:flex">
        <div
          onMouseLeave={() => handleSetSelected(null)}
          className="relative flex h-fit gap-2"
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                id={`shift-tab-${t.id}`}
                onMouseEnter={() => handleSetSelected(t.id)}
                onClick={() => handleSetSelected(t.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  selected === t.id
                    ? "bg-gray-800 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.title}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    selected === t.id ? "rotate-180" : ""
                  }`}
                />
              </button>
            );
          })}

          <AnimatePresence>
            {selected && (
              <motion.div
                id="overlay-content"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute left-0 top-[calc(100%_+_24px)] w-96 rounded-xl border border-gray-200 bg-white shadow-2xl p-6 z-50"
              >
                {/* Bridge */}
                <div className="absolute -top-[24px] left-0 right-0 h-[24px]" />
                
                {/* Nub */}
                <Nub selected={selected} />

                {TABS.map((t) => {
                  return (
                    <div className="overflow-hidden" key={t.id}>
                      {selected === t.id && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            x: dir === "l" ? 100 : dir === "r" ? -100 : 0,
                          }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <t.Component />
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  // Nub component for the dropdown pointer
  const Nub = ({ selected }) => {
    const [left, setLeft] = useState(0);

    useEffect(() => {
      moveNub();
    }, [selected]);

    const moveNub = () => {
      if (selected) {
        const hoveredTab = document.getElementById(`shift-tab-${selected}`);
        const overlayContent = document.getElementById("overlay-content");

        if (!hoveredTab || !overlayContent) return;

        const tabRect = hoveredTab.getBoundingClientRect();
        const { left: contentLeft } = overlayContent.getBoundingClientRect();

        const tabCenter = tabRect.left + tabRect.width / 2 - contentLeft;
        setLeft(tabCenter);
      }
    };

    return (
      <motion.span
        style={{
          clipPath: "polygon(0 0, 100% 0, 50% 50%, 0% 100%)",
        }}
        animate={{ left }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border border-gray-200 bg-white"
      />
    );
  };

  useEffect(() => {
    // Test Firebase connection
    const testResult = testFirebaseConnection();
    console.log('Firebase connection test result:', testResult);
  }, []);

  // Show location selector for new users
  useEffect(() => {
    if (user && !loading && !isLocationSet) {
      setShowLocationSelector(true);
    }
  }, [user, loading, isLocationSet]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileMenu && !event.target.closest('.mobile-nav-container')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu]);

  const ActiveComponent = allTabs.find(tab => tab.id === activeTab)?.component;
  
  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
  };

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
    setShowMobileMenu(false); // Close mobile menu when tab is selected
  };

  const handleAuthSuccess = (user) => {
    console.log('User signed in:', user);
  };

  const handleLocationSelect = async (location) => {
    try {
      await updateLocation(location);
      setShowLocationSelector(false);
    } catch (error) {
      console.error('Error updating location:', error);
      // Still close the selector even if Firebase save fails
      setShowLocationSelector(false);
    }
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

      {/* Beautiful Header with Navigation */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo Section */}
            <motion.button 
              onClick={() => handleTabChange('home')}
              className="flex items-center space-x-2 sm:space-x-3"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden xs:block sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                  Billionaire OS
                </h1>
                <p className="text-xs text-gray-500 font-medium -mt-0.5 hidden sm:block">
                  Personal Intelligence Suite
                </p>
              </div>
            </motion.button>

            {/* Desktop Navigation - Shifting Dropdown */}
            <ShiftingDropDown 
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              productivityTabs={productivityTabs}
              intelligenceTabs={intelligenceTabs}
            />

            {/* Mobile Menu Button */}
            <div className="md:hidden mobile-nav-container">
              <motion.button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 min-w-0"
              >
                {(() => {
                  const activeTabData = allTabs.find(tab => tab.id === activeTab);
                  const Icon = activeTabData?.icon;
                  return (
                    <>
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate max-w-[80px] sm:max-w-none">{activeTabData?.label}</span>
                      <motion.div
                        animate={{ rotate: showMobileMenu ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </motion.div>
                    </>
                  );
                })()}
              </motion.button>
            </div>

            {/* Profile Dropdown */}
            <ProfileDropdown onLocationSettingsClick={() => setShowLocationSelector(true)} />
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-gray-100 shadow-lg"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                {/* Productivity Section */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Productivity</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    {productivityTabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <motion.button
                          key={tab.id}
                          onClick={() => {
                            handleTabChange(tab.id);
                            setShowMobileMenu(false);
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 min-h-[40px] sm:min-h-[44px]",
                            isActive
                              ? "bg-gray-900 text-white"
                              : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                          )}
                        >
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{tab.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Intelligence Section */}
                <div>
                  <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                    <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Intelligence</h3>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    {intelligenceTabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <motion.button
                          key={tab.id}
                          onClick={() => {
                            handleTabChange(tab.id);
                            setShowMobileMenu(false);
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 min-h-[40px] sm:min-h-[44px]",
                            isActive
                              ? "bg-gray-900 text-white"
                              : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                          )}
                        >
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{tab.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={activeTab === 'home' ? '' : 'max-w-4xl mx-auto px-4 sm:px-6 py-8 relative'}
      >
        {ActiveComponent ? (
          activeTab === 'home' ? 
            <ActiveComponent onNavigate={handleNavigate} /> : 
            <ActiveComponent />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-light text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-6">The requested page could not be loaded.</p>
            <button 
              onClick={() => handleNavigate('home')}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go Home
            </button>
          </div>
        )}
        
        {/* Location Selector Modal - Positioned within main content */}
        <LocationSelector
          isOpen={showLocationSelector}
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowLocationSelector(false)}
        />
      </motion.main>

      {/* Simple Quote */}
      <AnimatePresence>
        {showQuote && activeTab !== 'home' && (
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
      
      {activeTab !== 'home' && <Footer onNavigate={handleNavigate} />}
      <CookieConsent />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <AppContent />
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;
