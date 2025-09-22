import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  BookOpen, 
  MapPin, 
  ChevronDown,
  ChevronUp,
  Loader2,
  BarChart3,
  GraduationCap,
  AlertCircle
} from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';
import { 
  analyzeSalary, 
  analyzeJobMarket, 
  generateCareerPath, 
  analyzeSkillsGap 
} from '../services/professionIntelligence';
import SoothingLoader from './SoothingLoader';

const ProfessionIntelligencePage = () => {
  const { location, getCountryName, getCurrencySymbol } = useLocation();
  const [activeTab, setActiveTab] = useState('salary');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    salary_market: true,
    salary_factors: true,
    salary_progression: true,
    salary_recommendations: true,
    market_overview: true,
    market_trends: true,
    market_skills: true,
    market_opp_chal: true,
    career_paths: true,
    career_action_plan: true,
    skills_missing: true,
    skills_improve: true,
    skills_learning: true
  });

  // Form states for different analyses
  const [salaryForm, setSalaryForm] = useState({
    profession: '',
    experience: '',
    currentSalary: ''
  });

  const [jobMarketForm, setJobMarketForm] = useState({
    profession: ''
  });

  const [careerPathForm, setCareerPathForm] = useState({
    currentRole: '',
    experience: '',
    skills: '',
    goals: ''
  });

  const [skillsGapForm, setSkillsGapForm] = useState({
    currentSkills: '',
    targetRole: '',
    industry: ''
  });

  const tabs = [
    { id: 'salary', name: 'Salary Analysis', icon: DollarSign },
    { id: 'market', name: 'Job Market', icon: TrendingUp },
    { id: 'career', name: 'Career Path', icon: Target },
    { id: 'skills', name: 'Skills Gap', icon: BookOpen }
  ];

  const experienceLevels = [
    'Entry Level (0-2 years)',
    'Mid Level (3-5 years)',
    'Senior Level (6-10 years)',
    'Lead/Principal (10+ years)',
    'Executive/C-Level'
  ];

  // Salary Analysis Handler
  const handleSalaryAnalysis = async () => {
    if (!salaryForm.profession || !salaryForm.experience || !salaryForm.currentSalary) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const locationContext = location ? `Location context: ${getCountryName(location.country)} (${location.currency}).` : '';
      const result = await analyzeSalary(
        salaryForm.profession,
        salaryForm.experience,
        location ? getCountryName(location.country) : 'Global',
        salaryForm.currentSalary,
        locationContext
      );

      if (result.success) {
        setResults(result.analysis);
      } else {
        setError(result.error || 'Failed to analyze salary data');
      }
    } catch (err) {
      setError('Failed to analyze salary data');
    } finally {
      setLoading(false);
    }
  };

  // Job Market Analysis Handler
  const handleJobMarketAnalysis = async () => {
    if (!jobMarketForm.profession) {
      setError('Please enter your profession');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const locationContext = location ? `Location context: ${getCountryName(location.country)} (${location.currency}).` : '';
      const result = await analyzeJobMarket(
        jobMarketForm.profession,
        location ? getCountryName(location.country) : 'Global',
        locationContext
      );

      if (result.success) {
        setResults(result.analysis);
      } else {
        setError(result.error || 'Failed to analyze job market');
      }
    } catch (err) {
      setError('Failed to analyze job market');
    } finally {
      setLoading(false);
    }
  };

  // Career Path Analysis Handler
  const handleCareerPathAnalysis = async () => {
    if (!careerPathForm.currentRole || !careerPathForm.experience || !careerPathForm.goals) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const locationContext = location ? `Location context: ${getCountryName(location.country)} (${location.currency}).` : '';
      const result = await generateCareerPath(
        careerPathForm.currentRole,
        careerPathForm.experience,
        careerPathForm.skills,
        careerPathForm.goals,
        locationContext
      );

      if (result.success) {
        setResults(result.analysis);
      } else {
        setError(result.error || 'Failed to generate career path');
      }
    } catch (err) {
      setError('Failed to generate career path');
    } finally {
      setLoading(false);
    }
  };

  // Skills Gap Analysis Handler
  const handleSkillsGapAnalysis = async () => {
    if (!skillsGapForm.currentSkills || !skillsGapForm.targetRole) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const locationContext = location ? `Location context: ${getCountryName(location.country)} (${location.currency}).` : '';
      const result = await analyzeSkillsGap(
        skillsGapForm.currentSkills,
        skillsGapForm.targetRole,
        skillsGapForm.industry,
        locationContext
      );

      if (result.success) {
        setResults(result.analysis);
      } else {
        setError(result.error || 'Failed to analyze skills gap');
      }
    } catch (err) {
      setError('Failed to analyze skills gap');
    } finally {
      setLoading(false);
    }
  };

  // Helpers
  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Clean Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            Profession Intelligence
          </h1>
          <div className="w-16 h-0.5 bg-gray-900 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            AI-powered career insights and professional development recommendations 
            tailored for <span className="font-medium text-gray-900">{location ? getCountryName(location.country) : 'your location'}</span>.
          </p>
        </div>

        {/* Clean Location Info */}
        {location && (
          <div className="flex items-center justify-center space-x-2 mb-12">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {getCountryName(location.country)} • {location.currency} ({getCurrencySymbol(location.currency)})
            </span>
          </div>
        )}

        {/* Minimal Tabs */}
        <div className="mb-16">
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-50 rounded-xl p-1 border border-gray-200">
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
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Quick Examples */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {activeTab === 'salary' && (
              <>
                <button
                  onClick={() => setSalaryForm({ profession: 'Software Engineer', experience: 'Mid Level (3-5 years)', currentSalary: `${getCurrencySymbol(location?.currency || 'USD')}85,000` })}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                >Try: Software Engineer • Mid • 85k</button>
                <button
                  onClick={() => setSalaryForm({ profession: 'Marketing Manager', experience: 'Senior Level (6-10 years)', currentSalary: `${getCurrencySymbol(location?.currency || 'USD')}120,000` })}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                >Try: Marketing Manager • Senior • 120k</button>
              </>
            )}
            {activeTab === 'market' && (
              <>
                <button
                  onClick={() => setJobMarketForm({ profession: 'Data Scientist' })}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                >Try: Data Scientist</button>
                <button
                  onClick={() => setJobMarketForm({ profession: 'Product Manager' })}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                >Try: Product Manager</button>
              </>
            )}
            {activeTab === 'career' && (
              <>
                <button
                  onClick={() => setCareerPathForm({ currentRole: 'Junior Developer', experience: 'Entry Level (0-2 years)', skills: 'JavaScript, React', goals: 'Become a Senior Developer' })}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                >Try: Junior Dev → Senior Dev</button>
                <button
                  onClick={() => setCareerPathForm({ currentRole: 'Sales Associate', experience: 'Mid Level (3-5 years)', skills: 'Negotiation, CRM', goals: 'Become a Sales Manager' })}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                >Try: Sales → Manager</button>
              </>
            )}
            {activeTab === 'skills' && (
              <>
                <button
                  onClick={() => setSkillsGapForm({ currentSkills: 'HTML, CSS, Basic JavaScript', targetRole: 'Full Stack Developer', industry: 'Technology' })}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                >Try: Web Basics → Full Stack</button>
                <button
                  onClick={() => setSkillsGapForm({ currentSkills: 'Content Strategy, SEO', targetRole: 'Head of Marketing', industry: 'SaaS' })}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                >Try: Marketing → HoM</button>
              </>
            )}
          </div>
        </div>

        {/* Clean Error Display */}
        {error && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Clean Salary Analysis Tab */}
          {activeTab === 'salary' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-900">Salary Analysis</h2>
                    <p className="text-sm text-gray-600">Market positioning and negotiation insights</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profession / Job Title *
                    </label>
                    <input
                      type="text"
                      value={salaryForm.profession}
                      onChange={(e) => setSalaryForm({...salaryForm, profession: e.target.value})}
                      placeholder="e.g., Software Engineer, Marketing Manager"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level *
                    </label>
                    <select
                      value={salaryForm.experience}
                      onChange={(e) => setSalaryForm({...salaryForm, experience: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                    >
                      <option value="">Select experience level</option>
                      {experienceLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Salary *
                    </label>
                    <input
                      type="text"
                      value={salaryForm.currentSalary}
                      onChange={(e) => setSalaryForm({...salaryForm, currentSalary: e.target.value})}
                      placeholder={`e.g., ${getCurrencySymbol(location?.currency || 'USD')}75,000 per year`}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSalaryAnalysis}
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4" />
                      <span>Analyze Salary</span>
                    </>
                  )}
                </button>
                {loading && (
                  <div className="mt-6">
                    <SoothingLoader message="Analyzing your salary profile..." />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Clean Job Market Tab */}
          {activeTab === 'market' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-900">Job Market Analysis</h2>
                    <p className="text-sm text-gray-600">Market demand and industry trends</p>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profession / Job Title *
                  </label>
                  <input
                    type="text"
                    value={jobMarketForm.profession}
                    onChange={(e) => setJobMarketForm({...jobMarketForm, profession: e.target.value})}
                    placeholder="e.g., Data Scientist, Product Manager"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                  />
                </div>

                <button
                  onClick={handleJobMarketAnalysis}
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      <span>Analyze Market</span>
                    </>
                  )}
                </button>
                {loading && (
                  <div className="mt-6">
                    <SoothingLoader message="Analyzing the job market..." />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Career Path Tab */}
          {activeTab === 'career' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-900">Career Path Recommendations</h2>
                    <p className="text-sm text-gray-600">Personalized career development strategies</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Role *
                    </label>
                    <input
                      type="text"
                      value={careerPathForm.currentRole}
                      onChange={(e) => setCareerPathForm({...careerPathForm, currentRole: e.target.value})}
                      placeholder="e.g., Junior Developer, Sales Associate"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level *
                    </label>
                    <select
                      value={careerPathForm.experience}
                      onChange={(e) => setCareerPathForm({...careerPathForm, experience: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                    >
                      <option value="">Select experience level</option>
                      {experienceLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Skills
                    </label>
                    <textarea
                      value={careerPathForm.skills}
                      onChange={(e) => setCareerPathForm({...careerPathForm, skills: e.target.value})}
                      placeholder="e.g., JavaScript, React, Project Management, Team Leadership"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Career Goals *
                    </label>
                    <textarea
                      value={careerPathForm.goals}
                      onChange={(e) => setCareerPathForm({...careerPathForm, goals: e.target.value})}
                      placeholder="e.g., Become a Senior Developer, Lead a team, Start my own company"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCareerPathAnalysis}
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Career Path...</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4" />
                      <span>Generate Career Path</span>
                    </>
                  )}
                </button>
                {loading && (
                  <div className="mt-6">
                    <SoothingLoader message="Designing your career roadmap..." />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills Gap Tab */}
          {activeTab === 'skills' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-900">Skills Gap Analysis</h2>
                    <p className="text-sm text-gray-600">Identify skill gaps and learning recommendations</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Skills *
                    </label>
                    <textarea
                      value={skillsGapForm.currentSkills}
                      onChange={(e) => setSkillsGapForm({...skillsGapForm, currentSkills: e.target.value})}
                      placeholder="e.g., HTML, CSS, Basic JavaScript, Customer Service"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Role *
                    </label>
                    <input
                      type="text"
                      value={skillsGapForm.targetRole}
                      onChange={(e) => setSkillsGapForm({...skillsGapForm, targetRole: e.target.value})}
                      placeholder="e.g., Full Stack Developer, Marketing Director"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={skillsGapForm.industry}
                      onChange={(e) => setSkillsGapForm({...skillsGapForm, industry: e.target.value})}
                      placeholder="e.g., Technology, Healthcare, Finance"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSkillsGapAnalysis}
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing Skills Gap...</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      <span>Analyze Skills Gap</span>
                    </>
                  )}
                </button>
                {loading && (
                  <div className="mt-6">
                    <SoothingLoader message="Mapping your skills journey..." />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Results Display */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Salary Analysis Results */}
              {activeTab === 'salary' && results.marketAnalysis && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="text-xl font-light text-gray-900">Your Salary Analysis</h3>
                  </div>
                  
                  {/* Market Position */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <button onClick={() => toggleSection('salary_market')} className="w-full flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Market Position</h4>
                      {expandedSections.salary_market ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                    <AnimatePresence initial={false}>
                      {expandedSections.salary_market && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">Your Percentile</div>
                            <div className="text-lg font-medium text-gray-900">{results.marketAnalysis.percentile}</div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">Market Average</div>
                            <div className="text-lg font-medium text-gray-900">{results.marketAnalysis.averageSalary}</div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">Market Range</div>
                            <div className="text-sm font-medium text-gray-900">
                              {results.marketAnalysis.salaryRange?.min} - {results.marketAnalysis.salaryRange?.max}
                            </div>
                          </div>
                        </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Salary Factors */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <button onClick={() => toggleSection('salary_factors')} className="w-full flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Salary Factors</h4>
                      {expandedSections.salary_factors ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                    <AnimatePresence initial={false}>
                      {expandedSections.salary_factors && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <div className="space-y-3">
                      {results.salaryFactors?.map((factor, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{factor}</span>
                        </div>
                      ))}
                    </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Career Progression */}
                  {results.careerProgression && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <button onClick={() => toggleSection('salary_progression')} className="w-full flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900">Career Progression</h4>
                        {expandedSections.salary_progression ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </button>
                      <AnimatePresence initial={false}>
                        {expandedSections.salary_progression && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Next Level</div>
                          <div className="text-sm font-medium text-gray-900">{results.careerProgression.nextLevel}</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Salary Increase</div>
                          <div className="text-sm font-medium text-gray-900">{results.careerProgression.salaryIncrease}</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Timeframe</div>
                          <div className="text-sm font-medium text-gray-900">{results.careerProgression.timeframe}</div>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-3">Requirements</h5>
                        <div className="space-y-2">
                          {results.careerProgression.requirements?.map((req, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-700">{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <button onClick={() => toggleSection('salary_recommendations')} className="w-full flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Recommendations</h4>
                      {expandedSections.salary_recommendations ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                    <AnimatePresence initial={false}>
                      {expandedSections.salary_recommendations && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <div className="space-y-3">
                      {results.recommendations?.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{rec}</span>
                        </div>
                      ))}
                    </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Job Market Results */}
              {activeTab === 'market' && results.marketOverview && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-light text-gray-900">Job Market Analysis</h3>
                  </div>
                  
                  {/* Market Overview */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <button onClick={() => toggleSection('market_overview')} className="w-full flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Market Overview</h4>
                      {expandedSections.market_overview ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                    <AnimatePresence initial={false}>
                      {expandedSections.market_overview && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Demand Level</div>
                        <div className="text-sm font-medium text-gray-900">{results.marketOverview.demandLevel}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Growth Rate</div>
                        <div className="text-sm font-medium text-gray-900">{results.marketOverview.growthRate}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Job Openings</div>
                        <div className="text-sm font-medium text-gray-900">{results.marketOverview.jobOpenings}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Competition</div>
                        <div className="text-sm font-medium text-gray-900">{results.marketOverview.competitionLevel}</div>
                      </div>
                    </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Industry Trends */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <button onClick={() => toggleSection('market_trends')} className="w-full flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Industry Trends</h4>
                      {expandedSections.market_trends ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                    <AnimatePresence initial={false}>
                      {expandedSections.market_trends && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <div className="space-y-3">
                      {results.industryTrends?.map((trend, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{trend}</span>
                        </div>
                      ))}
                    </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Skills in Demand */}
                  {results.skillsInDemand && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <button onClick={() => toggleSection('market_skills')} className="w-full flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900">Skills in Demand</h4>
                        {expandedSections.market_skills ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </button>
                      <AnimatePresence initial={false}>
                        {expandedSections.market_skills && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <div className="space-y-3">
                        {results.skillsInDemand.map((skill, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-sm text-gray-900">{skill.skill}</div>
                              <div className="text-xs text-gray-500">{skill.importance} • {skill.trend}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Opportunities & Challenges */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <button onClick={() => toggleSection('market_opp_chal')} className="w-full flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900">Opportunities</h4>
                        {expandedSections.market_opp_chal ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </button>
                      <AnimatePresence initial={false}>
                        {expandedSections.market_opp_chal && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <div className="space-y-3">
                        {results.opportunities?.map((opp, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{opp}</span>
                          </div>
                        ))}
                      </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Challenges</h4>
                      <div className="space-y-3">
                        {results.challenges?.map((challenge, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{challenge}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Career Path Results */}
              {activeTab === 'career' && results.careerPaths && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-light text-gray-900">Your Career Path</h3>
                  </div>
                  
                  {results.careerPaths.map((path, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="mb-4">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">{path.path}</h4>
                        <p className="text-gray-600 text-sm">{path.description}</p>
                      </div>

                      {/* Salary Progression */}
                      {path.salaryProgression && (
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">Current</div>
                            <div className="text-sm font-medium text-gray-900">{path.salaryProgression.current}</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">2 Years</div>
                            <div className="text-sm font-medium text-gray-900">{path.salaryProgression.year2}</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">5 Years</div>
                            <div className="text-sm font-medium text-gray-900">{path.salaryProgression.year5}</div>
                          </div>
                        </div>
                      )}

                      {/* Steps */}
                      {path.steps && (
                        <div className="mb-6">
                          <h5 className="text-sm font-medium text-gray-900 mb-3">Career Steps</h5>
                          <div className="space-y-4">
                            {path.steps.map((step, stepIndex) => (
                              <div key={stepIndex} className="border-l-2 border-purple-300 pl-4">
                                <div className="font-medium text-sm text-gray-900 mb-1">{step.step}</div>
                                <div className="text-xs text-gray-500 mb-2">Duration: {step.duration}</div>
                                <div className="space-y-2">
                                  {step.actions && (
                                    <div>
                                      <div className="text-xs font-medium text-gray-700 mb-1">Actions:</div>
                                      <div className="space-y-1">
                                        {step.actions.slice(0, 3).map((action, actionIndex) => (
                                          <div key={actionIndex} className="flex items-start space-x-2">
                                            <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                            <span className="text-xs text-gray-600">{action}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pros & Cons */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-3">Advantages</h5>
                          <div className="space-y-2">
                            {path.pros?.map((pro, proIndex) => (
                              <div key={proIndex} className="flex items-start space-x-3">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-gray-700">{pro}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-3">Considerations</h5>
                          <div className="space-y-2">
                            {path.cons?.map((con, conIndex) => (
                              <div key={conIndex} className="flex items-start space-x-3">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-gray-700">{con}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Action Plan */}
                  {results.actionPlan && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <button onClick={() => toggleSection('career_action_plan')} className="w-full flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900">Action Plan</h4>
                        {expandedSections.career_action_plan ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </button>
                      <AnimatePresence initial={false}>
                        {expandedSections.career_action_plan && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-3">Next 30 Days</h5>
                          <div className="space-y-2">
                            {results.actionPlan.next30Days?.map((action, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-gray-700">{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-3">Next 90 Days</h5>
                          <div className="space-y-2">
                            {results.actionPlan.next90Days?.map((action, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-gray-700">{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-3">Next 12 Months</h5>
                          <div className="space-y-2">
                            {results.actionPlan.next12Months?.map((action, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-gray-700">{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}

              {/* Skills Gap Results */}
              {activeTab === 'skills' && results.skillsGap && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-light text-gray-900">Skills Gap Analysis</h3>
                  </div>
                  
                  {/* Missing Skills */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <button onClick={() => toggleSection('skills_missing')} className="w-full flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Skills to Acquire</h4>
                      {expandedSections.skills_missing ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                    <AnimatePresence initial={false}>
                      {expandedSections.skills_missing && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <div className="space-y-3">
                      {results.skillsGap.missing?.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-sm text-gray-900">{skill.skill}</div>
                            <div className="text-xs text-gray-500">{skill.importance} • {skill.difficulty} • {skill.timeToLearn}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Skills to Improve */}
                  {results.skillsGap.toImprove && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <button onClick={() => toggleSection('skills_improve')} className="w-full flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900">Skills to Improve</h4>
                        {expandedSections.skills_improve ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </button>
                      <AnimatePresence initial={false}>
                        {expandedSections.skills_improve && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <div className="space-y-3">
                        {results.skillsGap.toImprove.map((skill, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="font-medium text-sm text-gray-900 mb-1">{skill.skill}</div>
                            <div className="text-xs text-gray-500 mb-2">
                              {skill.currentLevel} → {skill.targetLevel}
                            </div>
                            <div className="text-sm text-gray-700">{skill.gap}</div>
                          </div>
                        ))}
                      </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Learning Recommendations */}
                  {results.recommendations && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <button onClick={() => toggleSection('skills_learning')} className="w-full flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900">Learning Recommendations</h4>
                        {expandedSections.skills_learning ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </button>
                      <AnimatePresence initial={false}>
                        {expandedSections.skills_learning && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      
                      {results.recommendations.courses && (
                        <div className="mb-6">
                          <h5 className="text-sm font-medium text-gray-900 mb-3">Recommended Courses</h5>
                          <div className="space-y-3">
                            {results.recommendations.courses.map((course, index) => (
                              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                <div className="font-medium text-sm text-gray-900">{course.name}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {course.provider} • {course.duration} • {course.cost}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.recommendations.practice && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-3">Practice Recommendations</h5>
                          <div className="space-y-2">
                            {results.recommendations.practice.map((practice, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-gray-700">{practice}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfessionIntelligencePage;
