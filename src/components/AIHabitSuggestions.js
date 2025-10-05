import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, Plus, Loader2, CheckCircle, Target, 
  Clock, TrendingUp, Lightbulb, X, ArrowRight 
} from 'lucide-react';
import { generateHabitsForGoal } from '../services/habitIntelligence';
import { useLocation } from '../contexts/LocationContext';

const AIHabitSuggestions = ({ onAddHabits, onClose }) => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [selectedHabits, setSelectedHabits] = useState(new Set());
  const [error, setError] = useState(null);
  const { getLocationContext } = useLocation();

  const handleGenerateHabits = async () => {
    if (!goal.trim()) {
      setError('Please enter your goal first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestions(null);
    
    try {
      const result = await generateHabitsForGoal(goal.trim(), getLocationContext());
      
      if (result.success) {
        setSuggestions(result);
        // Pre-select first 3 habits as recommended
        const preSelected = new Set();
        result.habits.slice(0, 3).forEach((_, index) => {
          preSelected.add(index);
        });
        setSelectedHabits(preSelected);
      } else {
        setError(result.error || 'Failed to generate habits');
      }
    } catch (err) {
      setError('Failed to generate habits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleHabitSelection = (index) => {
    const newSelected = new Set(selectedHabits);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedHabits(newSelected);
  };

  const handleAddSelectedHabits = () => {
    if (selectedHabits.size === 0) {
      setError('Please select at least one habit to add');
      return;
    }

    const habitsToAdd = Array.from(selectedHabits).map(index => 
      suggestions.habits[index].name
    );
    
    onAddHabits(habitsToAdd);
    onClose();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'health': return '💪';
      case 'learning': return '📚';
      case 'productivity': return '⚡';
      case 'finance': return '💰';
      case 'mindset': return '🧠';
      default: return '🎯';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Habit Suggestions</h2>
              <p className="text-sm text-gray-600">Get personalized habits for your goal</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Goal Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What goal do you want to achieve?
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Lose 20 pounds, Learn Spanish, Start a business..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateHabits()}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateHabits}
                disabled={loading || !goal.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{loading ? 'Generating...' : 'Generate'}</span>
              </motion.button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center space-x-3 text-gray-600">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>AI is analyzing your goal and generating personalized habits...</span>
              </div>
            </motion.div>
          )}

          {/* Suggestions */}
          <AnimatePresence>
            {suggestions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Goal Summary */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Your Goal</span>
                  </div>
                  <p className="text-purple-800">{suggestions.goal}</p>
                </div>

                {/* Habit Suggestions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recommended Habits ({suggestions.habits.length})
                    </h3>
                    <span className="text-sm text-gray-500">
                      {selectedHabits.size} selected
                    </span>
                  </div>

                  <div className="space-y-3">
                    {suggestions.habits.map((habit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => toggleHabitSelection(index)}
                        className={`
                          p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                          ${selectedHabits.has(index)
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-200
                            ${selectedHabits.has(index)
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-gray-300'
                            }
                          `}>
                            {selectedHabits.has(index) && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">{getCategoryIcon(habit.category)}</span>
                              <h4 className="font-medium text-gray-900">{habit.name}</h4>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
                            
                            <div className="flex items-center space-x-4 text-xs">
                              <div className="flex items-center space-x-1 text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{habit.timeEstimate}</span>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(habit.difficulty)}`}>
                                {habit.difficulty}
                              </span>
                              <span className="text-gray-500">{habit.category}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                {suggestions.tips && suggestions.tips.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Pro Tips</span>
                    </div>
                    <ul className="space-y-1">
                      {suggestions.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-yellow-800 flex items-start space-x-2">
                          <span className="text-yellow-600 mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddSelectedHabits}
                    disabled={selectedHabits.size === 0}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add {selectedHabits.size} Habit{selectedHabits.size !== 1 ? 's' : ''}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIHabitSuggestions;
