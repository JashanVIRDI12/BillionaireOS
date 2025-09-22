import React, { useState, useEffect } from 'react';
import { useLocation } from '../contexts/LocationContext';
import { TrendingUp, Target, DollarSign, Lightbulb, Users, BarChart3, Search, Rocket, Brain, CheckCircle, AlertCircle, Clock, Zap, ChevronDown, Building2, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  analyzeMarketTrends, 
  analyzeCompetitors, 
  suggestRevenueModels, 
  createMVPValidationPlan,
  generateBusinessIdeas 
} from '../services/businessIntelligence';
import SoothingLoader from './SoothingLoader';

const BusinessOpportunitiesPage = () => {
  const [activeTab, setActiveTab] = useState('ideas');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { getLocationContext, getCurrencySymbol } = useLocation();

  // Form states
  const [ideaForm, setIdeaForm] = useState({
    interests: '',
    skills: '',
    budget: '',
    timeCommitment: ''
  });

  const [marketForm, setMarketForm] = useState({
    industry: '',
    timeframe: '2024-2025'
  });

  const [competitorForm, setCompetitorForm] = useState({
    businessIdea: '',
    targetMarket: ''
  });

  const [revenueForm, setRevenueForm] = useState({
    businessIdea: '',
    targetCustomers: '',
    industry: ''
  });

  const [mvpForm, setMvpForm] = useState({
    businessIdea: '',
    targetCustomers: '',
    budget: ''
  });

  const tabs = [
    { id: 'ideas', label: 'Idea Generator', icon: Lightbulb, color: 'yellow' },
    { id: 'market', label: 'Market Trends', icon: TrendingUp, color: 'blue' },
    { id: 'competitors', label: 'Competitor Analysis', icon: Users, color: 'red' },
    { id: 'revenue', label: 'Revenue Models', icon: DollarSign, color: 'green' },
    { id: 'mvp', label: 'MVP Validation', icon: Target, color: 'purple' }
  ];

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileMenu && !event.target.closest('.mobile-business-nav')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu]);

  const handleGenerateIdeas = async () => {
    if (!ideaForm.interests.trim() || !ideaForm.skills.trim()) {
      setError('Please fill in your interests and skills');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await generateBusinessIdeas(
        ideaForm.interests,
        ideaForm.skills,
        ideaForm.budget,
        ideaForm.timeCommitment,
        getLocationContext()
      );
      
      if (result.success) {
        setResults(result.analysis);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to generate business ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleMarketAnalysis = async () => {
    if (!marketForm.industry.trim()) {
      setError('Please enter an industry to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeMarketTrends(marketForm.industry, marketForm.timeframe, getLocationContext());
      
      if (result.success) {
        setResults(result.analysis);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Market analysis error:', err);
      setError(`Failed to analyze market trends: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompetitorAnalysis = async () => {
    if (!competitorForm.businessIdea.trim() || !competitorForm.targetMarket.trim()) {
      setError('Please fill in both business idea and target market');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeCompetitors(competitorForm.businessIdea, competitorForm.targetMarket, getLocationContext());
      
      if (result.success) {
        setResults(result.analysis);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to analyze competitors');
    } finally {
      setLoading(false);
    }
  };

  const handleRevenueAnalysis = async () => {
    if (!revenueForm.businessIdea.trim() || !revenueForm.targetCustomers.trim()) {
      setError('Please fill in business idea and target customers');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await suggestRevenueModels(
        revenueForm.businessIdea,
        revenueForm.targetCustomers,
        revenueForm.industry,
        getLocationContext()
      );
      
      if (result.success) {
        setResults(result.analysis);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to analyze revenue models');
    } finally {
      setLoading(false);
    }
  };

  const handleMVPAnalysis = async () => {
    if (!mvpForm.businessIdea.trim() || !mvpForm.targetCustomers.trim()) {
      setError('Please fill in business idea and target customers');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await createMVPValidationPlan(
        mvpForm.businessIdea,
        mvpForm.targetCustomers,
        mvpForm.budget,
        getLocationContext()
      );
      
      if (result.success) {
        setResults(result.analysis);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to create MVP validation plan');
    } finally {
      setLoading(false);
    }
  };

  const getProfitColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'text-green-700 bg-green-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getCompetitionColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'text-red-700 bg-red-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      {/* Header */}
      <div className="border-b border-gray-100 pb-6 mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-black">Business Intelligence</h1>
        </div>
        <p className="text-gray-400 text-sm sm:text-base font-light ml-11">
          AI-powered business opportunity analysis and validation
        </p>
      </div>

      {/* Responsive Navigation */}
      <div className="mb-6 sm:mb-8">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div className="flex space-x-1 bg-gray-50 rounded-xl p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setResults(null);
                    setError(null);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap
                    ${isActive
                      ? "bg-white text-black shadow-sm border border-gray-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white hover:bg-opacity-50"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation - Dropdown */}
        <div className="md:hidden relative mobile-business-nav">
          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 font-medium text-sm shadow-sm"
          >
            <div className="flex items-center space-x-3">
              {(() => {
                const activeTabData = tabs.find(tab => tab.id === activeTab);
                const Icon = activeTabData?.icon;
                return (
                  <>
                    <Icon className="w-4 h-4 text-gray-700" />
                    <span className="text-gray-900">{activeTabData?.label}</span>
                  </>
                );
              })()}
            </div>
            <motion.div
              animate={{ rotate: showMobileMenu ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </motion.div>
          </motion.button>

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
              >
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setResults(null);
                        setError(null);
                        setShowMobileMenu(false);
                      }}
                      whileHover={{ backgroundColor: "#f9fafb" }}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200
                        ${isActive
                          ? "bg-black text-white"
                          : "text-gray-600 hover:text-black"
                        }
                        ${index !== tabs.length - 1 ? "border-b border-gray-100" : ""}
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <SoothingLoader 
            message="Analyzing business opportunities..." 
            icon={Brain}
          />
        </motion.div>
      )}

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Business Idea Generator */}
          {activeTab === 'ideas' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-yellow-600" />
                  <h2 className="text-xl font-bold text-gray-900">Generate Business Ideas</h2>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Your Interests *
                      </label>
                      <textarea
                        value={ideaForm.interests}
                        onChange={(e) => setIdeaForm({...ideaForm, interests: e.target.value})}
                        className="w-full h-16 sm:h-20 p-3 border-2 border-gray-300 focus:border-yellow-500 outline-none resize-none transition-all rounded-lg bg-white text-sm"
                        placeholder="e.g., Technology, Health, Finance..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Your Skills *
                      </label>
                      <textarea
                        value={ideaForm.skills}
                        onChange={(e) => setIdeaForm({...ideaForm, skills: e.target.value})}
                        className="w-full h-16 sm:h-20 p-3 border-2 border-gray-300 focus:border-yellow-500 outline-none resize-none transition-all rounded-lg bg-white text-sm"
                        placeholder="e.g., Programming, Marketing, Sales..."
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Available Budget
                      </label>
                      <input
                        type="text"
                        value={ideaForm.budget}
                        onChange={(e) => setIdeaForm({...ideaForm, budget: e.target.value})}
                        className="w-full p-3 border-2 border-gray-300 focus:border-yellow-500 outline-none transition-all rounded-lg bg-white text-sm"
                        placeholder={`e.g., ${getCurrencySymbol() || '$'}1,000, ${getCurrencySymbol() || '$'}10,000`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Time Commitment
                      </label>
                      <select
                        value={ideaForm.timeCommitment}
                        onChange={(e) => setIdeaForm({...ideaForm, timeCommitment: e.target.value})}
                        className="w-full p-3 border-2 border-gray-300 focus:border-yellow-500 outline-none transition-all rounded-lg bg-white text-sm"
                      >
                        <option value="">Select time commitment</option>
                        <option value="Part-time (10-20 hours/week)">Part-time (10-20 hrs/week)</option>
                        <option value="Full-time (40+ hours/week)">Full-time (40+ hrs/week)</option>
                        <option value="Side project (5-10 hours/week)">Side project (5-10 hrs/week)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  onClick={handleGenerateIdeas}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 disabled:opacity-50"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Generate Business Ideas</span>
                  </div>
                </motion.button>
              </div>

              {/* Business Ideas Results */}
              {results && results.businessIdeas && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-light text-gray-900">Personalized Business Ideas</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {results.businessIdeas.map((idea, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-all duration-200"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-light text-gray-900 mb-2">{idea.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{idea.description}</p>
                          </div>
                          <div className="flex flex-col space-y-2 ml-6">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getProfitColor(idea.profitPotential)}`}>
                              {idea.profitPotential} Profit
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCompetitionColor(idea.competitionLevel)}`}>
                              {idea.competitionLevel} Competition
                            </div>
                          </div>
                        </div>
                        
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">Industry</div>
                            <div className="text-sm font-medium text-gray-900">{idea.industry}</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">Startup Cost</div>
                            <div className="text-sm font-medium text-gray-900">{idea.startupCost}</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">Time to Market</div>
                            <div className="text-sm font-medium text-gray-900">{idea.timeToMarket}</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">Target Market</div>
                            <div className="text-sm font-medium text-gray-900">{idea.targetMarket}</div>
                          </div>
                        </div>
                        
                        {/* Advantages & Steps */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {idea.keyAdvantages && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-900 mb-3">Key Advantages</h5>
                              <div className="space-y-2">
                                {idea.keyAdvantages.slice(0, 3).map((advantage, i) => (
                                  <div key={i} className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-sm text-gray-700">{advantage}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {idea.firstSteps && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-900 mb-3">First Steps</h5>
                              <div className="space-y-2">
                                {idea.firstSteps.slice(0, 3).map((step, i) => (
                                  <div key={i} className="flex items-start space-x-2">
                                    <div className="w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                      <div className="text-xs text-gray-500">{i + 1}</div>
                                    </div>
                                    <span className="text-sm text-gray-700">{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick Wins and Long Term Plays */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.quickWins && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <h4 className="text-lg font-bold text-green-900 mb-4 flex items-center space-x-2">
                          <Zap className="w-5 h-5" />
                          <span>Quick Wins</span>
                        </h4>
                        <ul className="space-y-2">
                          {results.quickWins.map((win, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm text-green-800">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{win}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {results.longTermPlays && (
                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                        <h4 className="text-lg font-bold text-purple-900 mb-4 flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5" />
                          <span>Long-term Plays</span>
                        </h4>
                        <ul className="space-y-2">
                          {results.longTermPlays.map((play, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm text-purple-800">
                              <Target className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span>{play}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Market Trends Analysis */}
          {activeTab === 'market' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Market Trend Analysis</h2>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Industry *
                    </label>
                    <input
                      type="text"
                      value={marketForm.industry}
                      onChange={(e) => setMarketForm({...marketForm, industry: e.target.value})}
                      className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 outline-none transition-all rounded-lg bg-white text-sm"
                      placeholder="e.g., AI, FinTech, E-commerce, Healthcare"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Timeframe
                    </label>
                    <select
                      value={marketForm.timeframe}
                      onChange={(e) => setMarketForm({...marketForm, timeframe: e.target.value})}
                      className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 outline-none transition-all rounded-lg bg-white text-sm"
                    >
                      <option value="2024-2025">2024-2025</option>
                      <option value="2025-2026">2025-2026</option>
                      <option value="Next 5 years">Next 5 years</option>
                    </select>
                  </div>
                </div>
                
                <motion.button
                  onClick={handleMarketAnalysis}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Analyze Market Trends</span>
                  </div>
                </motion.button>
              </div>

              {/* Market Analysis Results */}
              {results && results.keyTrends && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-light text-gray-900">Market Analysis for {results.industry}</h3>
                  </div>
                  
                  {/* Market Overview */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-6">Market Overview</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-2">Market Size</div>
                        <div className="text-sm font-medium text-gray-900">{results.marketSize}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-2">Time to Market</div>
                        <div className="text-sm font-medium text-gray-900">{results.timeToMarket}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-2">Capital Requirement</div>
                        <div className="text-sm font-medium text-gray-900">{results.capitalRequirement}</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Trends */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-6">Key Market Trends</h4>
                    <div className="space-y-3">
                      {results.keyTrends.map((trend, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm leading-relaxed">{trend}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Opportunities and Threats */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Opportunities</h4>
                      <div className="space-y-3">
                        {results.opportunities?.map((opportunity, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700 leading-relaxed">{opportunity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Threats & Challenges</h4>
                      <div className="space-y-3">
                        {results.threats?.map((threat, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700 leading-relaxed">{threat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Success Factors */}
                  {results.successFactors && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Critical Success Factors</h4>
                      <div className="space-y-3">
                        {results.successFactors.map((factor, index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm leading-relaxed">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* Competitor Analysis */}
          {activeTab === 'competitors' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-6 h-6 text-red-600" />
                  <h2 className="text-xl font-bold text-gray-900">Competitor Analysis</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Business Idea *
                    </label>
                    <textarea
                      value={competitorForm.businessIdea}
                      onChange={(e) => setCompetitorForm({...competitorForm, businessIdea: e.target.value})}
                      className="w-full h-20 p-3 border-2 border-gray-300 focus:border-red-500 outline-none resize-none transition-all rounded-lg bg-white text-sm"
                      placeholder="Describe your business idea in detail..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Target Market *
                    </label>
                    <input
                      type="text"
                      value={competitorForm.targetMarket}
                      onChange={(e) => setCompetitorForm({...competitorForm, targetMarket: e.target.value})}
                      className="w-full p-3 border-2 border-gray-300 focus:border-red-500 outline-none transition-all rounded-lg bg-white text-sm"
                      placeholder="e.g., Small businesses, Millennials, B2B SaaS companies"
                    />
                  </div>
                </div>
                
                <motion.button
                  onClick={handleCompetitorAnalysis}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Analyze Competitors</span>
                  </div>
                </motion.button>
              </div>

              {/* Competitor Analysis Results */}
              {results && results.directCompetitors && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-light text-gray-900">🔍 Competitive Landscape Analysis</h3>
                  
                  {/* Direct Competitors */}
                  <div className="space-y-6">
                    {results.directCompetitors.map((competitor, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h5 className="text-lg font-medium text-gray-900 mb-2">{competitor.name}</h5>
                            <p className="text-gray-600 text-sm leading-relaxed">{competitor.description}</p>
                          </div>
                          <div className="ml-6">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-xs text-gray-500 mb-1">Market Share</div>
                              <div className="text-sm font-medium text-gray-900">{competitor.marketShare}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h6 className="text-sm font-medium text-gray-900 mb-3">Strengths</h6>
                            <div className="space-y-2">
                              {competitor.strengths?.slice(0, 3).map((strength, i) => (
                                <div key={i} className="flex items-start space-x-3">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm text-gray-700">{strength}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h6 className="text-sm font-medium text-gray-900 mb-3">Weaknesses</h6>
                            <div className="space-y-2">
                              {competitor.weaknesses?.slice(0, 3).map((weakness, i) => (
                                <div key={i} className="flex items-start space-x-3">
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm text-gray-700">{weakness}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Market Gaps and Opportunities */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Market Gaps</h4>
                      <div className="space-y-3">
                        {results.marketGaps?.map((gap, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700 leading-relaxed">{gap}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Competitive Advantages</h4>
                      <div className="space-y-3">
                        {results.competitiveAdvantages?.map((advantage, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700 leading-relaxed">{advantage}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Differentiation Opportunities */}
                  {results.differentiationOpportunities && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Differentiation Opportunities</h4>
                      <div className="space-y-3">
                        {results.differentiationOpportunities.map((opportunity, index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm leading-relaxed">{opportunity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* Revenue Models */}
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-900">Revenue Model Analysis</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Business Idea *
                    </label>
                    <textarea
                      value={revenueForm.businessIdea}
                      onChange={(e) => setRevenueForm({...revenueForm, businessIdea: e.target.value})}
                      className="w-full h-20 p-3 border-2 border-gray-300 focus:border-green-500 outline-none resize-none transition-all rounded-lg bg-white text-sm"
                      placeholder="Describe your business idea..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Target Customers *
                      </label>
                      <input
                        type="text"
                        value={revenueForm.targetCustomers}
                        onChange={(e) => setRevenueForm({...revenueForm, targetCustomers: e.target.value})}
                        className="w-full p-3 border-2 border-gray-300 focus:border-green-500 outline-none transition-all rounded-lg bg-white text-sm"
                        placeholder="e.g., Small businesses, Consumers, Enterprises"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Industry
                      </label>
                      <input
                        type="text"
                        value={revenueForm.industry}
                        onChange={(e) => setRevenueForm({...revenueForm, industry: e.target.value})}
                        className="w-full p-3 border-2 border-gray-300 focus:border-green-500 outline-none transition-all rounded-lg bg-white text-sm"
                        placeholder="e.g., SaaS, E-commerce, Healthcare"
                      />
                    </div>
                  </div>
                </div>
                
                <motion.button
                  onClick={handleRevenueAnalysis}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Analyze Revenue Models</span>
                  </div>
                </motion.button>
              </div>

              {/* Revenue Model Results */}
              {results && results.primaryRevenueModels && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="text-xl font-light text-gray-900">Revenue Model Recommendations</h3>
                  </div>
                  
                  {/* Primary Revenue Models */}
                  <div className="space-y-6">
                    {results.primaryRevenueModels.map((model, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900 mb-2">{model.model}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{model.description}</p>
                          </div>
                          <div className="ml-6">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              model.scalability === 'High' ? 'text-green-700 bg-green-100' :
                              model.scalability === 'Medium' ? 'text-yellow-700 bg-yellow-100' :
                              'text-red-700 bg-red-100'
                            }`}>
                              {model.scalability} Scalability
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-3">Advantages</h5>
                            <div className="space-y-2">
                              {model.pros?.slice(0, 3).map((pro, i) => (
                                <div key={i} className="flex items-start space-x-3">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm text-gray-700">{pro}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-3">Challenges</h5>
                            <div className="space-y-2">
                              {model.cons?.slice(0, 3).map((con, i) => (
                                <div key={i} className="flex items-start space-x-3">
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm text-gray-700">{con}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">Time to Revenue</div>
                            <div className="text-sm font-medium text-gray-900">{model.timeToRevenue}</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">Capital Required</div>
                            <div className="text-sm font-medium text-gray-900">{model.capitalRequirement}</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg col-span-2 lg:col-span-1">
                            <div className="text-xs text-gray-500 mb-1">Examples</div>
                            <div className="text-sm font-medium text-gray-900">{model.examples?.slice(0, 2).join(', ')}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Monetization Timeline */}
                  {results.monetizationTimeline && (
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span>Monetization Timeline</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h5 className="font-semibold text-blue-900 mb-2">Months 1-3</h5>
                          <p className="text-blue-800 text-sm">{results.monetizationTimeline['month1-3']}</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h5 className="font-semibold text-green-900 mb-2">Months 6-12</h5>
                          <p className="text-green-800 text-sm">{results.monetizationTimeline['month6-12']}</p>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <h5 className="font-semibold text-purple-900 mb-2">Year 2+</h5>
                          <p className="text-purple-800 text-sm">{results.monetizationTimeline['year2+']}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* MVP Validation */}
          {activeTab === 'mvp' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">MVP Validation Framework</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Business Idea *
                    </label>
                    <textarea
                      value={mvpForm.businessIdea}
                      onChange={(e) => setMvpForm({...mvpForm, businessIdea: e.target.value})}
                      className="w-full h-20 p-3 border-2 border-gray-300 focus:border-purple-500 outline-none resize-none transition-all rounded-lg bg-white text-sm"
                      placeholder="Describe your business idea in detail..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Target Customers *
                      </label>
                      <input
                        type="text"
                        value={mvpForm.targetCustomers}
                        onChange={(e) => setMvpForm({...mvpForm, targetCustomers: e.target.value})}
                        className="w-full p-3 border-2 border-gray-300 focus:border-purple-500 outline-none transition-all rounded-lg bg-white text-sm"
                        placeholder="e.g., Small business owners, Students, Freelancers"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Validation Budget
                      </label>
                      <input
                        type="text"
                        value={mvpForm.budget}
                        onChange={(e) => setMvpForm({...mvpForm, budget: e.target.value})}
                        className="w-full p-3 border-2 border-gray-300 focus:border-purple-500 outline-none transition-all rounded-lg bg-white text-sm"
                        placeholder={`e.g., ${getCurrencySymbol() || '$'}500, ${getCurrencySymbol() || '$'}1,000, ${getCurrencySymbol() || '$'}5,000`}
                      />
                    </div>
                  </div>
                </div>
                
                <motion.button
                  onClick={handleMVPAnalysis}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Create MVP Validation Plan</span>
                  </div>
                </motion.button>
              </div>

              {/* MVP Validation Results */}
              {results && results.mvpApproaches && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-light text-gray-900">MVP Validation Strategy</h3>
                  </div>
                  
                  {/* MVP Approaches */}
                  <div className="space-y-6">
                    {results.mvpApproaches.map((approach, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h5 className="text-lg font-medium text-gray-900 mb-2">{approach.type}</h5>
                            <p className="text-gray-600 text-sm leading-relaxed">{approach.description}</p>
                          </div>
                          <div className="ml-6 space-y-2">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-xs text-gray-500 mb-1">Cost</div>
                              <div className="text-sm font-medium text-gray-900">{approach.cost}</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-xs text-gray-500 mb-1">Timeline</div>
                              <div className="text-sm font-medium text-gray-900">{approach.timeToCreate}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h6 className="text-sm font-medium text-gray-900 mb-3">Validation Goals</h6>
                          <div className="space-y-2">
                            {approach.validationGoals?.slice(0, 3).map((goal, i) => (
                              <div key={i} className="flex items-start space-x-3">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-gray-700">{goal}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Experiment Plan */}
                  {results.experimentPlan && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-6">Week-by-Week Experiment Plan</h4>
                      <div className="space-y-6">
                        {results.experimentPlan.map((week, index) => (
                          <div key={index} className="border-l-2 border-purple-300 pl-6 py-4">
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="text-base font-medium text-gray-900">{week.week}</h5>
                              <div className="text-center p-2 bg-gray-50 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1">Budget</div>
                                <div className="text-sm font-medium text-gray-900">{week.budget}</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div>
                                <h6 className="text-sm font-medium text-gray-900 mb-3">Activities</h6>
                                <div className="space-y-2">
                                  {week.activities?.slice(0, 3).map((activity, i) => (
                                    <div key={i} className="flex items-start space-x-3">
                                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                      <span className="text-sm text-gray-700">{activity}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h6 className="text-sm font-medium text-gray-900 mb-3">Deliverables</h6>
                                <div className="space-y-2">
                                  {week.deliverables?.slice(0, 3).map((deliverable, i) => (
                                    <div key={i} className="flex items-start space-x-3">
                                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                      <span className="text-sm text-gray-700">{deliverable}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Success Metrics */}
                  {results.successMetrics && (
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5" />
                        <span>Success Metrics</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.successMetrics.map((metric, index) => (
                          <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h5 className="font-semibold text-green-900 mb-1">{metric.metric}</h5>
                            <div className="text-sm text-green-800">
                              <div><strong>Target:</strong> {metric.target}</div>
                              <div><strong>How to measure:</strong> {metric.measurement}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default BusinessOpportunitiesPage;
