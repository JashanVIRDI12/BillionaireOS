import React, { useState, useEffect } from 'react';
import FirstTimeGuide from './FirstTimeGuide';
import { useLocation } from '../contexts/LocationContext';
import { TrendingUp, Target, DollarSign, Lightbulb, Users, BarChart3, CheckCircle, AlertCircle, Clock, Zap, Loader2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  analyzeMarketTrends, 
  analyzeCompetitors, 
  suggestRevenueModels, 
  createIdeaTestingPlan,
  generateBusinessIdeas 
} from '../services/businessIntelligence';
import SoothingLoader from './SoothingLoader';

const BusinessOpportunitiesPage = () => {
  // Show onboarding guide for first-time users
  const [showGuide, setShowGuide] = useState(false);
  useEffect(() => {
    const seen = localStorage.getItem('seenBusinessIntelligenceGuide');
    if (!seen) setShowGuide(true);
  }, []);
  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem('seenBusinessIntelligenceGuide', 'true');
  }
  const [activeTab, setActiveTab] = useState('ideas');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { location, getLocationContext, getCurrencySymbol, getCountryName } = useLocation();

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

  const [ideaTestingForm, setIdeaTestingForm] = useState({
    businessIdea: '',
    targetCustomers: '',
    budget: ''
  });

  const tabs = [
    { id: 'ideas', label: 'Idea Generator', icon: Lightbulb, color: 'yellow' },
    { id: 'market', label: 'Market Trends', icon: TrendingUp, color: 'blue' },
    { id: 'competitors', label: 'Competitor Analysis', icon: Users, color: 'red' },
    { id: 'revenue', label: 'Revenue Models', icon: DollarSign, color: 'green' },
    { id: 'mvp', label: 'Idea Testing', icon: Target, color: 'purple' }
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

  const handleIdeaTestingAnalysis = async () => {
    if (!ideaTestingForm.businessIdea.trim() || !ideaTestingForm.targetCustomers.trim()) {
      setError('Please fill in business idea and target customers');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await createIdeaTestingPlan(
        ideaTestingForm.businessIdea,
        ideaTestingForm.targetCustomers,
        ideaTestingForm.budget,
        getLocationContext()
      );
      
      if (result.success) {
        setResults(result.analysis);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to create idea testing plan');
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
    <>

      <FirstTimeGuide open={showGuide} onClose={handleCloseGuide} type="business" />
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Clean Minimalist Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-4 sm:mb-6 tracking-tight">
            Business Intelligence
          </h1>
          <div className="w-16 h-0.5 bg-gray-900 mx-auto mb-6 sm:mb-8"></div>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            AI-powered business opportunity analysis and validation
            {location && <span className="block sm:inline mt-1 sm:mt-0"> tailored for <span className="font-medium text-gray-900">{getCountryName(location.country)}</span></span>}
          </p>
        </div>

        {/* Clean Location Info */}
        {location && (
          <div className="flex items-center justify-center space-x-3 mb-16">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">
              {getCountryName(location.country)} • {location.currency} ({getCurrencySymbol(location.currency)})
            </span>
          </div>
        )}

        {/* Minimal Tabs */}
        <div className="mb-20">
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-50 rounded-xl p-1.5 border border-gray-200 shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setResults(null);
                      setError(null);
                    }}
                    className={`flex items-center space-x-2.5 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-gray-900 shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Quick Examples */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            {activeTab === 'ideas' && (
              <>
                <button
                  onClick={() => setIdeaForm({ interests: 'Technology, AI, Automation', skills: 'Programming, Data Analysis', budget: '$5,000', timeCommitment: 'Part-time (10-20 hours/week)' })}
                  className="text-xs px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-medium"
                >Try: Tech Entrepreneur</button>
                <button
                  onClick={() => setIdeaForm({ interests: 'Health, Fitness, Wellness', skills: 'Marketing, Content Creation', budget: '$2,000', timeCommitment: 'Side project (5-10 hours/week)' })}
                  className="text-xs px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-medium"
                >Try: Health Coach</button>
              </>
            )}
            {activeTab === 'market' && (
              <>
                <button
                  onClick={() => setMarketForm({ industry: 'Artificial Intelligence', timeframe: '2024-2025' })}
                  className="text-xs px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-medium"
                >Try: AI Industry</button>
                <button
                  onClick={() => setMarketForm({ industry: 'E-commerce', timeframe: 'Next 5 years' })}
                  className="text-xs px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-medium"
                >Try: E-commerce</button>
              </>
            )}
            {activeTab === 'competitors' && (
              <>
                <button
                  onClick={() => setCompetitorForm({ businessIdea: 'AI-powered fitness app', targetMarket: 'Health-conscious millennials' })}
                  className="text-xs px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-medium"
                >Try: Fitness App</button>
                <button
                  onClick={() => setCompetitorForm({ businessIdea: 'Sustainable food delivery', targetMarket: 'Eco-conscious consumers' })}
                  className="text-xs px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-medium"
                >Try: Eco Delivery</button>
              </>
            )}
            {activeTab === 'revenue' && (
              <>
                <button
                  onClick={() => setRevenueForm({ businessIdea: 'Online learning platform', targetCustomers: 'Working professionals', industry: 'Education Technology' })}
                  className="text-xs px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-medium"
                >Try: EdTech Platform</button>
                <button
                  onClick={() => setRevenueForm({ businessIdea: 'Local service marketplace', targetCustomers: 'Homeowners', industry: 'Home Services' })}
                  className="text-xs px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-medium"
                >Try: Service Marketplace</button>
              </>
            )}
            {activeTab === 'mvp' && (
              <>
                <button
                  onClick={() => setIdeaTestingForm({ businessIdea: 'Smart budgeting app', targetCustomers: 'Young professionals', budget: '$3,000' })}
                  className="text-xs px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-medium"
                >Try: Budgeting App</button>
                <button
                  onClick={() => setIdeaTestingForm({ businessIdea: 'Virtual event platform', targetCustomers: 'Small businesses', budget: '$8,000' })}
                  className="text-xs px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-medium"
                >Try: Event Platform</button>
              </>
            )}
            </div>
          </div>
        </div>

        {/* Clean Error Display */}
        {error && (
          <div className="mb-12 max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}


      {/* Tab Content */}
      <div className="pb-16">
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
            <div className="max-w-4xl mx-auto">
              <div className="bg-white sm:border sm:border-gray-200 sm:rounded-xl p-4 sm:p-8 sm:shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-900">Generate Business Ideas</h2>
                    <p className="text-sm text-gray-600">AI-powered personalized business opportunities</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Interests *
                    </label>
                    <textarea
                      value={ideaForm.interests}
                      onChange={(e) => setIdeaForm({...ideaForm, interests: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                      rows={3}
                      placeholder="e.g., Technology, Health, Finance..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Skills *
                    </label>
                    <textarea
                      value={ideaForm.skills}
                      onChange={(e) => setIdeaForm({...ideaForm, skills: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                      rows={3}
                      placeholder="e.g., Programming, Marketing, Sales..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Budget
                    </label>
                    <input
                      type="text"
                      value={ideaForm.budget}
                      onChange={(e) => setIdeaForm({...ideaForm, budget: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                      placeholder={`e.g., ${getCurrencySymbol() || '$'}1,000, ${getCurrencySymbol() || '$'}10,000`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Commitment
                    </label>
                    <select
                      value={ideaForm.timeCommitment}
                      onChange={(e) => setIdeaForm({...ideaForm, timeCommitment: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                    >
                      <option value="">Select time commitment</option>
                      <option value="Part-time (10-20 hours/week)">Part-time (10-20 hrs/week)</option>
                      <option value="Full-time (40+ hours/week)">Full-time (40+ hrs/week)</option>
                      <option value="Side project (5-10 hours/week)">Side project (5-10 hrs/week)</option>
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={handleGenerateIdeas}
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Ideas...</span>
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-4 h-4" />
                      <span>Generate Business Ideas</span>
                    </>
                  )}
                </button>
                {loading && (
                  <div className="mt-6">
                    <SoothingLoader message="Generating personalized business ideas..." />
                  </div>
                )}

                {/* Business Ideas Results */}
                {results && results.businessIdeas && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 mt-12"
                >
                  <div className="flex items-center space-x-3 mb-8">
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
            </div>
          )}

          {/* Market Trends Analysis */}
          {activeTab === 'market' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white sm:border sm:border-gray-200 sm:rounded-xl p-4 sm:p-8 sm:shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-900">Market Trend Analysis</h2>
                    <p className="text-sm text-gray-600">Industry analysis and market opportunities</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry *
                    </label>
                    <input
                      type="text"
                      value={marketForm.industry}
                      onChange={(e) => setMarketForm({...marketForm, industry: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                      placeholder="e.g., AI, FinTech, E-commerce, Healthcare"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeframe
                    </label>
                    <select
                      value={marketForm.timeframe}
                      onChange={(e) => setMarketForm({...marketForm, timeframe: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                    >
                      <option value="2024-2025">2024-2025</option>
                      <option value="2025-2026">2025-2026</option>
                      <option value="Next 5 years">Next 5 years</option>
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={handleMarketAnalysis}
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing Market...</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      <span>Analyze Market Trends</span>
                    </>
                  )}
                </button>
                {loading && (
                  <div className="mt-6">
                    <SoothingLoader message="Analyzing market trends and opportunities..." />
                  </div>
                )}
              {/* Market Analysis Results */}
              {results && results.keyTrends && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 mt-12"
                >
                  <div className="flex items-center space-x-3 mb-8">
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
            </div>
          )}

          {/* Competitor Analysis */}
          {activeTab === 'competitors' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white sm:border sm:border-gray-200 sm:rounded-xl p-4 sm:p-8 sm:shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-900">Competitor Analysis</h2>
                    <p className="text-sm text-gray-600">Market competition and differentiation opportunities</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Idea *
                    </label>
                    <textarea
                      value={competitorForm.businessIdea}
                      onChange={(e) => setCompetitorForm({...competitorForm, businessIdea: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                      rows={3}
                      placeholder="Describe your business idea in detail..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Market *
                    </label>
                    <input
                      type="text"
                      value={competitorForm.targetMarket}
                      onChange={(e) => setCompetitorForm({...competitorForm, targetMarket: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                      placeholder="e.g., Small businesses, Millennials, B2B SaaS companies"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleCompetitorAnalysis}
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing Competitors...</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4" />
                      <span>Analyze Competitors</span>
                    </>
                  )}
                </button>
                {loading && (
                  <div className="mt-6">
                    <SoothingLoader message="Analyzing competitive landscape..." />
                  </div>
                )}
              {/* Competitor Analysis Results */}
              {results && results.directCompetitors && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 mt-12"
                >
                  <h3 className="text-xl font-light text-gray-900 mb-8">🔍 Competitive Landscape Analysis</h3>
                  
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
            </div>
          )}

          {/* Revenue Models */}
          {activeTab === 'revenue' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white sm:border sm:border-gray-200 sm:rounded-xl p-4 sm:p-8 sm:shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-900">Revenue Model Analysis</h2>
                    <p className="text-sm text-gray-600">Monetization strategies and revenue optimization</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Idea *
                    </label>
                    <textarea
                      value={revenueForm.businessIdea}
                      onChange={(e) => setRevenueForm({...revenueForm, businessIdea: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                      rows={3}
                      placeholder="Describe your business idea..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Customers *
                    </label>
                    <input
                      type="text"
                      value={revenueForm.targetCustomers}
                      onChange={(e) => setRevenueForm({...revenueForm, targetCustomers: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                      placeholder="e.g., Small businesses, Consumers, Enterprises"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={revenueForm.industry}
                      onChange={(e) => setRevenueForm({...revenueForm, industry: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                      placeholder="e.g., SaaS, E-commerce, Healthcare"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleRevenueAnalysis}
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing Revenue Models...</span>
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4" />
                      <span>Analyze Revenue Models</span>
                    </>
                  )}
                </button>
                {loading && (
                  <div className="mt-6">
                    <SoothingLoader message="Analyzing monetization strategies..." />
                  </div>
                )}
              {/* Revenue Model Results */}
              {results && results.primaryRevenueModels && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 mt-12"
                >
                  <div className="flex items-center space-x-3 mb-8">
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
            </div>
          )}

          {/* Idea Testing */}
          {activeTab === 'mvp' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white sm:border sm:border-gray-200 sm:rounded-xl p-4 sm:p-8 sm:shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-900">Idea Testing Framework</h2>
                    <p className="text-sm text-gray-600">Test your business idea with structured experiments</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Idea *
                    </label>
                    <textarea
                      value={ideaTestingForm.businessIdea}
                      onChange={(e) => setIdeaTestingForm({...ideaTestingForm, businessIdea: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                      rows={3}
                      placeholder="Describe your business idea in detail..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Customers *
                    </label>
                    <input
                      type="text"
                      value={ideaTestingForm.targetCustomers}
                      onChange={(e) => setIdeaTestingForm({...ideaTestingForm, targetCustomers: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                      placeholder="e.g., Small business owners, Students, Freelancers"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Testing Budget
                    </label>
                    <input
                      type="text"
                      value={ideaTestingForm.budget}
                      onChange={(e) => setIdeaTestingForm({...ideaTestingForm, budget: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                      placeholder={`e.g., ${getCurrencySymbol() || '$'}500, ${getCurrencySymbol() || '$'}1,000, ${getCurrencySymbol() || '$'}5,000`}
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleIdeaTestingAnalysis}
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Testing Plan...</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4" />
                      <span>Create Idea Testing Plan</span>
                    </>
                  )}
                </button>
                {loading && (
                  <div className="mt-6">
                    <SoothingLoader message="Creating your idea testing framework..." />
                  </div>
                )}
              {/* Idea Testing Results */}
              {results && results.mvpApproaches && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 mt-12"
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-light text-gray-900">Idea Testing Strategy</h3>
                  </div>
                  
                  {/* Testing Approaches */}
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
                          <h6 className="text-sm font-medium text-gray-900 mb-3">Testing Goals</h6>
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
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      </div>
    </motion.div>
    </>
  );
};

export default BusinessOpportunitiesPage;
