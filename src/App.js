import React, { useState, useEffect } from 'react';
import { Target, Calendar, CheckSquare, Sparkles, X } from 'lucide-react';
import VisionPage from './components/VisionPage';
import GoalsPage from './components/GoalsPage';
import HabitsPage from './components/HabitsPage';
import { cn } from './utils/cn';

function App() {
  const [activeTab, setActiveTab] = useState('vision');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showQuote, setShowQuote] = useState(true);

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
  ];

  useEffect(() => {
    setIsLoaded(true);
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

  return (
    <div className="min-h-screen bg-white font-sans antialiased">

      {/* Clean Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Billionaire OS
              </h1>
            </div>
            
            {/* Simple Tab Navigation */}
            <nav className="hidden md:flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "text-black border-b-2 border-black"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
            
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex space-x-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 text-sm font-medium whitespace-nowrap",
                  isActive
                    ? "text-black border-b-2 border-black"
                    : "text-gray-600"
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {ActiveComponent && <ActiveComponent />}
      </main>

      {/* Simple Quote */}
      {showQuote && (
        <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
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
        </div>
      )}
    </div>
  );
}

export default App;
