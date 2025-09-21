import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Lightbulb, Target, Zap, Heart, Award, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeJournalEntry, analyzeDailyTrends } from '../services/aiAnalysis';

const AIInsights = ({ latestEntry, recentEntries, onAnalysisComplete }) => {
  const [analysis, setAnalysis] = useState(null);
  const [trendAnalysis, setTrendAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    daily: true,
    trends: false
  });

  useEffect(() => {
    if (latestEntry) {
      analyzeEntry();
    }
  }, [latestEntry]);

  const analyzeEntry = async () => {
    if (!latestEntry) return;

    setLoading(true);
    setError(null);

    try {
      // Analyze the latest entry
      const entryResult = await analyzeJournalEntry(latestEntry);
      
      if (entryResult.success) {
        setAnalysis(entryResult.analysis);
        
        // Also analyze trends if we have multiple entries
        if (recentEntries && recentEntries.length > 1) {
          const trendResult = await analyzeDailyTrends(recentEntries);
          if (trendResult.success) {
            setTrendAnalysis(trendResult.analysis);
          }
        }
        
        if (onAnalysisComplete) {
          onAnalysisComplete(entryResult.analysis);
        }
      } else {
        setError(entryResult.error);
      }
    } catch (err) {
      setError('Failed to analyze your entry. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getScoreColor = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (numScore >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (!latestEntry) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">AI Insights</h3>
          <p className="text-sm text-gray-600">Powered by DeepSeek AI</p>
        </div>
      </div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full"
            />
            <span className="text-purple-700 font-medium">Analyzing your journal entry...</span>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4"
        >
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={analyzeEntry}
            className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium underline"
          >
            Try again
          </button>
        </motion.div>
      )}

      {analysis && (
        <div className="space-y-4">
          {/* Daily Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggleSection('daily')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Today's Analysis</span>
                {analysis.overallScore && (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}/10
                  </span>
                )}
              </div>
              {expandedSections.daily ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            <AnimatePresence>
              {expandedSections.daily && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200"
                >
                  <div className="p-4 space-y-4">
                    {/* Motivational Message */}
                    {analysis.motivationalMessage && (
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold text-purple-900">Today's Motivation</span>
                        </div>
                        <p className="text-purple-800 italic">{analysis.motivationalMessage}</p>
                      </div>
                    )}

                    {/* Strengths */}
                    {analysis.strengths && analysis.strengths.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Award className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-900">What You Did Well</span>
                        </div>
                        <ul className="space-y-2">
                          {analysis.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start space-x-2 text-green-800">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="text-sm">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Areas for Improvement */}
                    {analysis.improvements && analysis.improvements.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <TrendingUp className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold text-yellow-900">Areas to Improve</span>
                        </div>
                        <ul className="space-y-2">
                          {analysis.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start space-x-2 text-yellow-800">
                              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="text-sm">{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Key Insights */}
                    {analysis.insights && analysis.insights.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Lightbulb className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-blue-900">Key Insights</span>
                        </div>
                        <ul className="space-y-2">
                          {analysis.insights.map((insight, index) => (
                            <li key={index} className="flex items-start space-x-2 text-blue-800">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="text-sm">{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    {analysis.recommendations && analysis.recommendations.length > 0 && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Target className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold text-purple-900">Tomorrow's Action Plan</span>
                        </div>
                        <ul className="space-y-2">
                          {analysis.recommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-start space-x-2 text-purple-800">
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="text-sm">{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Mood & Energy Analysis */}
                    {analysis.moodEnergyAnalysis && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex space-x-1">
                            <Heart className="w-4 h-4 text-red-500" />
                            <Zap className="w-4 h-4 text-blue-500" />
                          </div>
                          <span className="font-semibold text-gray-900">Mood & Energy Analysis</span>
                        </div>
                        <p className="text-gray-800 text-sm">{analysis.moodEnergyAnalysis}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Trend Analysis */}
          {trendAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleSection('trends')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Weekly Trends</span>
                </div>
                {expandedSections.trends ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              <AnimatePresence>
                {expandedSections.trends && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-4 space-y-4">
                      {/* Trend Analysis */}
                      {trendAnalysis.trends && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {trendAnalysis.trends.mood && (
                            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                              <h4 className="font-semibold text-pink-900 text-sm mb-2">Mood Trends</h4>
                              <p className="text-pink-800 text-xs">{trendAnalysis.trends.mood}</p>
                            </div>
                          )}
                          {trendAnalysis.trends.energy && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <h4 className="font-semibold text-blue-900 text-sm mb-2">Energy Trends</h4>
                              <p className="text-blue-800 text-xs">{trendAnalysis.trends.energy}</p>
                            </div>
                          )}
                          {trendAnalysis.trends.productivity && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <h4 className="font-semibold text-green-900 text-sm mb-2">Productivity</h4>
                              <p className="text-green-800 text-xs">{trendAnalysis.trends.productivity}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Weekly Insights */}
                      {trendAnalysis.weeklyInsights && trendAnalysis.weeklyInsights.length > 0 && (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <Lightbulb className="w-4 h-4 text-indigo-600" />
                            <span className="font-semibold text-indigo-900">Weekly Insights</span>
                          </div>
                          <ul className="space-y-2">
                            {trendAnalysis.weeklyInsights.map((insight, index) => (
                              <li key={index} className="flex items-start space-x-2 text-indigo-800">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span className="text-sm">{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AIInsights;
