import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Target, X, ChevronLeft, ChevronRight, BarChart3, Calendar, TrendingUp, Flame, Brain, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  addHabit as addHabitToDb,
  getHabits,
  deleteHabit as deleteHabitFromDb,
  toggleHabitCompletion
} from '../firebase/ultraSimple';
import SoothingLoader from './SoothingLoader';
import AIHabitSuggestions from './AIHabitSuggestions';

const HabitsPage = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addingHabits, setAddingHabits] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(getWeekStart(new Date()));
  
  const todayDate = new Date().toISOString().split('T')[0];

  // Get the start of the current week (Monday)
  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  // Get week dates (Monday to Sunday)
  const getWeekDates = (weekStart) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeek);
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Load data from Firebase
  useEffect(() => {
    if (!user) return;

    const loadHabits = async () => {
      setLoading(true);
      try {
        const result = await getHabits(user.uid);
        if (result.success) {
          setHabits(result.habits);
        } else {
          console.error('Failed to load habits:', result.error);
        }
      } catch (error) {
        console.error('Error loading habits:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHabits();
  }, [user]);

  // Toggle habit completion for a specific date
  const toggleHabit = async (habitId, date) => {
    if (!user) return;

    // Optimistically update UI
    const habit = habits.find(h => h.id === habitId);
    const isCurrentlyCompleted = habit?.completedDays[date];
    const newCompletionState = !isCurrentlyCompleted;

    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const completedDays = { ...h.completedDays };
        if (newCompletionState) {
          completedDays[date] = true;
        } else {
          delete completedDays[date];
        }
        return { ...h, completedDays };
      }
      return h;
    }));

    // Update in Firebase
    try {
      const result = await toggleHabitCompletion(habitId, date, newCompletionState);
      if (!result.success) {
        console.error('Failed to toggle habit:', result.error);
        // Revert optimistic update on failure
        setHabits(prev => prev.map(h => {
          if (h.id === habitId) {
            const completedDays = { ...h.completedDays };
            if (isCurrentlyCompleted) {
              completedDays[date] = true;
            } else {
              delete completedDays[date];
            }
            return { ...h, completedDays };
          }
          return h;
        }));
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  // Add new habit
  const addHabit = async () => {
    if (!user || !newHabit.trim()) return;

    setLoading(true);
    try {
      const result = await addHabitToDb(user.uid, newHabit.trim());
      if (result.success) {
        // Reload habits to get the new one
        const habitsResult = await getHabits(user.uid);
        if (habitsResult.success) {
          setHabits(habitsResult.habits);
        }
        setNewHabit('');
        setShowAddHabit(false);
      } else {
        console.error('Failed to add habit:', result.error);
      }
    } catch (error) {
      console.error('Error adding habit:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add multiple habits from AI suggestions
  const addMultipleHabits = async (habitNames) => {
    if (!user || !habitNames.length) return;

    setAddingHabits(true);
    try {
      // Add habits one by one
      for (const habitName of habitNames) {
        await addHabitToDb(user.uid, habitName);
      }
      
      // Reload all habits
      const habitsResult = await getHabits(user.uid);
      if (habitsResult.success) {
        setHabits(habitsResult.habits);
      }
    } catch (error) {
      console.error('Error adding multiple habits:', error);
    } finally {
      setAddingHabits(false);
    }
  };

  // Delete habit
  const deleteHabit = async (habitId) => {
    if (!user) return;

    setLoading(true);
    try {
      const result = await deleteHabitFromDb(habitId);
      if (result.success) {
        setHabits(prev => prev.filter(habit => habit.id !== habitId));
      } else {
        console.error('Failed to delete habit:', result.error);
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate today's progress
  const getTodayProgress = () => {
    if (habits.length === 0) return 0;
    const completedToday = habits.filter(habit => habit.completedDays[todayDate]).length;
    return Math.round((completedToday / habits.length) * 100);
  };



  // Calculate streak for a habit
  const getHabitStreak = (habit) => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (habit.completedDays[dateStr]) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  // Get weekly stats
  const getWeeklyStats = () => {
    const totalPossible = habits.length * 7;
    const totalCompleted = habits.reduce((sum, habit) => {
      return sum + weekDates.filter(date => habit.completedDays[date]).length;
    }, 0);
    
    return {
      completed: totalCompleted,
      total: totalPossible,
      percentage: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0,
      bestStreak: habits.length > 0 ? Math.max(...habits.map(h => getHabitStreak(h))) : 0
    };
  };

  // Navigate weeks
  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  // Show loading state
  if (loading && habits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <SoothingLoader 
          message="Loading your habits..." 
          icon={Target}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 sm:space-y-6 lg:space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-10 sm:w-12 h-10 sm:h-12 bg-black rounded-xl flex items-center justify-center">
            <Target className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Weekly Habits</h1>
            <p className="text-gray-600">
              {habits.length > 0 && `${habits.filter(h => h.completedDays[todayDate]).length}/${habits.length} completed today`}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2 sm:space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAISuggestions(true)}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-sm sm:text-base font-medium"
          >
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">AI Habits</span>
            <span className="sm:hidden">AI</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStats(true)}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm sm:text-base"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium">Stats</span>
          </motion.button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-center space-x-4 sm:space-x-6 bg-white border-2 border-gray-200 rounded-xl p-3 sm:p-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateWeek(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        
        <div className="text-center">
          <div className="text-xs sm:text-sm text-gray-600">Week of</div>
          <div className="font-semibold text-gray-900 text-sm sm:text-base">
            {currentWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {
              new Date(currentWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateWeek(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Today's Progress */}
      {habits.length > 0 && (
        <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-xl p-4 sm:p-6">
          <div className="text-center mb-4">
            <div className="text-3xl sm:text-4xl font-bold mb-2">{getTodayProgress()}%</div>
            <p className="text-gray-300 text-sm sm:text-base">Today's Progress</p>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getTodayProgress()}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white h-3 rounded-full"
            />
          </div>
        </div>
      )}

      {/* Weekly Habits Grid */}
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="hidden sm:grid bg-gray-50" style={{ gridTemplateColumns: '2fr repeat(7, 1fr)' }}>
          <div className="p-4 font-semibold text-gray-900 border-r border-gray-200">
            Habit
          </div>
          {dayNames.map((day, index) => (
            <div
              key={day}
              className={`p-4 text-center font-medium border-r border-gray-200 ${
                weekDates[index] === todayDate ? 'bg-black text-white' : 'text-gray-900'
              }`}
            >
              <div>{day}</div>
              <div className={`text-xs mt-1 ${
                weekDates[index] === todayDate ? 'text-gray-300' : 'text-gray-500'
              }`}>
                {new Date(weekDates[index]).getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden bg-gray-50 p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 text-center">Weekly Habits</h3>
          <div className="flex justify-center items-center space-x-2 mt-2">
            <button
              onClick={() => setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 font-medium">
              {currentWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
              {new Date(currentWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <button
              onClick={() => setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Habits */}
        <AnimatePresence>
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Desktop Grid Layout */}
              <div className="hidden sm:grid border-b border-gray-200 hover:bg-gray-50 transition-colors" style={{ gridTemplateColumns: '2fr repeat(7, 1fr)' }}>
                <div className="p-4 border-r border-gray-200 flex items-center justify-between min-w-0">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-2 h-2 bg-black rounded-full flex-shrink-0"></div>
                    <span className="font-medium text-gray-900 truncate" title={habit.name}>
                      {habit.name}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteHabit(habit.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200 flex-shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </motion.button>
                </div>
                {weekDates.map((date) => (
                  <div
                    key={date}
                    className={`p-4 border-r border-gray-200 flex items-center justify-center ${
                      date === todayDate ? 'bg-gray-50' : ''
                    }`}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleHabit(habit.id, date)}
                      className={`
                        w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                        ${habit.completedDays[date]
                          ? 'bg-black border-black text-white shadow-md'
                          : 'border-gray-300 hover:border-black hover:bg-gray-50'
                        }
                      `}
                    >
                      <AnimatePresence>
                        {habit.completedDays[date] && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                ))}
              </div>

              {/* Mobile Card Layout */}
              <div className="sm:hidden border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span className="font-medium text-gray-900">{habit.name}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteHabit(habit.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {weekDates.map((date, dayIndex) => (
                    <div key={date} className="text-center">
                      <div className={`text-xs font-medium mb-2 ${
                        date === todayDate ? 'text-black' : 'text-gray-500'
                      }`}>
                        {dayNames[dayIndex]}
                      </div>
                      <div className={`text-xs mb-2 ${
                        date === todayDate ? 'text-black font-medium' : 'text-gray-400'
                      }`}>
                        {new Date(date).getDate()}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleHabit(habit.id, date)}
                        className={`
                          w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-200 mx-auto
                          ${habit.completedDays[date]
                            ? 'bg-black border-black text-white shadow-md'
                            : 'border-gray-300 hover:border-black hover:bg-gray-50'
                          }
                        `}
                      >
                        <AnimatePresence>
                          {habit.completedDays[date] && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Check className="w-4 h-4" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {habits.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No habits yet</h3>
            <p className="text-gray-600">Start building better habits today</p>
          </div>
        )}
      </div>



      {/* Add Habit */}
      <AnimatePresence mode="wait">
        {!showAddHabit ? (
          <motion.button
            key="add-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddHabit(true)}
            className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold text-lg shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Habit</span>
          </motion.button>
        ) : (
          <motion.div
            key="add-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4"
          >
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Enter your new habit..."
              className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black outline-none transition-colors rounded-lg text-lg"
              onKeyDown={(e) => e.key === 'Enter' && addHabit()}
              autoFocus
            />
            
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addHabit}
                disabled={!newHabit.trim() || loading}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>{loading ? 'Adding...' : 'Add Habit'}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowAddHabit(false);
                  setNewHabit('');
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-black hover:bg-gray-50 transition-all duration-200 font-medium flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Habit Suggestions Modal */}
      <AnimatePresence>
        {showAISuggestions && (
          <AIHabitSuggestions
            onAddHabits={addMultipleHabits}
            onClose={() => setShowAISuggestions(false)}
          />
        )}
      </AnimatePresence>

      {/* Stats Modal */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowStats(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Weekly Stats</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowStats(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Today's Progress */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-900">{getTodayProgress()}%</div>
                      <div className="text-sm text-blue-700">Today's Progress</div>
                    </div>
                  </div>
                </div>

                {/* Weekly Progress */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-900">{getWeeklyStats().percentage}%</div>
                      <div className="text-sm text-green-700">Weekly Progress</div>
                    </div>
                  </div>
                </div>

                {/* Best Streak */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border-l-4 border-orange-500">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                      <Flame className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-900">{getWeeklyStats().bestStreak}</div>
                      <div className="text-sm text-orange-700">Best Streak</div>
                    </div>
                  </div>
                </div>

                {/* Completed This Week */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border-l-4 border-purple-500">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-900">{getWeeklyStats().completed}</div>
                      <div className="text-sm text-purple-700">Completed This Week</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HabitsPage;