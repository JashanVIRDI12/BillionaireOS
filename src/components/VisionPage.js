import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Plus, Target, Trash2, Frown, Meh, Smile, SmilePlus, Star, Battery, BatteryLow, Zap, Flame, TrendingUp, Sparkles, ChevronLeft, ChevronRight, X, BookOpen, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


import { useAuth } from '../contexts/AuthContext';
import {
  addJournalEntry,
  getJournalEntries,
  deleteJournalEntry
} from '../firebase/ultraSimple';
import ConfirmModal from './ConfirmModal';
import SoothingLoader, { CardSkeleton } from './SoothingLoader';
import AIInsights from './AIInsights';

const VisionPage = () => {
  const { user } = useAuth();
  
  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({
    whatDidIDo: '',
    didIMoveCloser: '',
    lessonsLearned: '',
    mood: 5,
    energy: 5,
    date: getTodayDateString()
  });

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // Interactive states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [latestAnalyzedEntry, setLatestAnalyzedEntry] = useState(null);

  const saveButtonRef = useRef(null);

  // Load journal entries from Firebase on component mount
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const entriesResult = await getJournalEntries(user.uid);
        if (entriesResult.success) {
          setJournalEntries(entriesResult.entries);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);


  // Helper functions
  const showConfirmModal = (title, message, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm
    });
  };

  const hideConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleAddJournalEntry = async () => {
    if (!user || !currentEntry.whatDidIDo.trim()) return;

    setLoading(true);
    const result = await addJournalEntry(user.uid, currentEntry);
    
    if (result.success) {
      // Reload entries
      const entriesResult = await getJournalEntries(user.uid);
      if (entriesResult.success) {
        setJournalEntries(entriesResult.entries);
        
        // Set the latest entry for AI analysis
        const todayEntry = entriesResult.entries.find(entry => entry.date === currentEntry.date);
        if (todayEntry) {
          setLatestAnalyzedEntry(todayEntry);
          setShowAIInsights(true);
        }
      }
      
      // Reset form
      setCurrentEntry({
        whatDidIDo: '',
        didIMoveCloser: '',
        lessonsLearned: '',
        mood: 5,
        energy: 5,
        date: getTodayDateString()
      });
    } else {
      console.error('Failed to add entry:', result.error);
    }
    setLoading(false);
  };

  const handleDeleteEntry = async (entryId) => {
    showConfirmModal(
      'Delete Journal Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      async () => {
        setLoading(true);
        const result = await deleteJournalEntry(entryId);
        
        if (result.success) {
          const entriesResult = await getJournalEntries(user.uid);
          if (entriesResult.success) {
            setJournalEntries(entriesResult.entries);
          }
        } else {
          console.error('Failed to delete entry:', result.error);
        }
        setLoading(false);
      }
    );
  };

  // Calculate stats
  const getJournalStats = () => {
    if (journalEntries.length === 0) return null;
    
    const avgMood = journalEntries.reduce((sum, entry) => sum + entry.mood, 0) / journalEntries.length;
    const avgEnergy = journalEntries.reduce((sum, entry) => sum + entry.energy, 0) / journalEntries.length;
    const streak = calculateStreak();
    
    return {
      totalEntries: journalEntries.length,
      avgMood: avgMood.toFixed(1),
      avgEnergy: avgEnergy.toFixed(1),
      streak
    };
  };

  const calculateStreak = () => {
    if (journalEntries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < journalEntries.length; i++) {
      const entryDate = new Date(journalEntries[i].date);
      const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEntryForDate = (date) => {
    // Format date as YYYY-MM-DD in local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    return journalEntries.find(entry => entry.date === dateString);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const handleDateClick = (date) => {
    const entry = getEntryForDate(date);
    if (entry) {
      setSelectedEntry(entry);
      setShowEntryModal(true);
    }
  };

  const getMoodIcon = (rating) => {
    if (rating <= 2) return <Frown className="w-4 h-4 text-red-500" />;
    if (rating <= 4) return <Meh className="w-4 h-4 text-yellow-500" />;
    if (rating <= 6) return <Smile className="w-4 h-4 text-green-500" />;
    if (rating <= 8) return <SmilePlus className="w-4 h-4 text-green-600" />;
    return <Star className="w-4 h-4 text-yellow-400" />;
  };

  const getEnergyIcon = (rating) => {
    if (rating <= 2) return <BatteryLow className="w-4 h-4 text-red-500" />;
    if (rating <= 4) return <Battery className="w-4 h-4 text-yellow-500" />;
    if (rating <= 6) return <Zap className="w-4 h-4 text-blue-500" />;
    if (rating <= 8) return <Flame className="w-4 h-4 text-orange-500" />;
    return <div className="flex gap-1"><Zap className="w-3 h-3 text-blue-500" /><Zap className="w-3 h-3 text-blue-500" /></div>;
  };

  const stats = getJournalStats();

  // Show loading state
  if (loading && journalEntries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <SoothingLoader 
          message="Loading your journal..." 
          icon={Target}
        />
        <CardSkeleton count={4} />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="border-b border-gray-100 pb-6 mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-black">Journal</h1>
        </div>
        <p className="text-gray-400 text-sm sm:text-base font-light ml-11">Daily reflection and growth tracking</p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 text-center">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-light text-black mb-1">{stats.totalEntries}</p>
            <p className="text-xs sm:text-sm text-gray-500">Total Entries</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 text-center">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-light text-black mb-1">{stats.streak}</p>
            <p className="text-xs sm:text-sm text-gray-500">Day Streak</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 text-center">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mx-auto mb-3">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-light text-black mb-1">{stats.avgMood}</p>
            <p className="text-xs sm:text-sm text-gray-500">Avg Mood</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 text-center">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mx-auto mb-3">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-light text-black mb-1">{stats.avgEnergy}</p>
            <p className="text-xs sm:text-sm text-gray-500">Avg Energy</p>
          </div>
        </div>
      )}

      {/* Journal Entry Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-light text-black">Today's Entry</h2>
            <p className="text-gray-400 text-sm font-light">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
            
        {/* Form Fields */}
        <div className="space-y-6">
          {/* What did I do today */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-black mb-3">
              <Target className="w-4 h-4" />
              <span>What did I do today?</span>
            </label>
            <textarea
              value={currentEntry.whatDidIDo}
              onChange={(e) => setCurrentEntry({...currentEntry, whatDidIDo: e.target.value})}
              className="w-full h-24 p-4 border border-gray-300 focus:border-black outline-none resize-none transition-all rounded-lg bg-white"
              placeholder="Describe your hustle, wins, and actions today..."
            />
          </div>

          {/* Goal progress */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-black mb-3">
              <TrendingUp className="w-4 h-4" />
              <span>Did I move closer to my goal?</span>
            </label>
            <textarea
              value={currentEntry.didIMoveCloser}
              onChange={(e) => setCurrentEntry({...currentEntry, didIMoveCloser: e.target.value})}
              className="w-full h-20 p-4 border border-gray-300 focus:border-black outline-none resize-none transition-all rounded-lg bg-white"
              placeholder="Reflect on your progress toward your North Star..."
            />
          </div>

          {/* Lessons learned */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-black mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Lessons learned</span>
            </label>
            <textarea
              value={currentEntry.lessonsLearned}
              onChange={(e) => setCurrentEntry({...currentEntry, lessonsLearned: e.target.value})}
              className="w-full h-20 p-4 border border-gray-300 focus:border-black outline-none resize-none transition-all rounded-lg bg-white"
              placeholder="What insights, failures, or breakthroughs did you have?"
            />
          </div>

          {/* Mood & Energy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <label className="flex items-center justify-between text-sm font-medium text-black mb-3">
                <span>Mood</span>
                <span className="text-xl">{getMoodIcon(currentEntry.mood)}</span>
              </label>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentEntry.mood}
                  onChange={(e) => setCurrentEntry({...currentEntry, mood: parseInt(e.target.value)})}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-500">10</span>
              </div>
              <p className="text-center text-lg font-light text-black mt-2">{currentEntry.mood}/10</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <label className="flex items-center justify-between text-sm font-medium text-black mb-3">
                <span>Energy</span>
                <span className="text-xl">{getEnergyIcon(currentEntry.energy)}</span>
              </label>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentEntry.energy}
                  onChange={(e) => setCurrentEntry({...currentEntry, energy: parseInt(e.target.value)})}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-500">10</span>
              </div>
              <p className="text-center text-lg font-light text-black mt-2">{currentEntry.energy}/10</p>
            </div>
          </div>

          {/* Save Button */}
          <button
            ref={saveButtonRef}
            onClick={handleAddJournalEntry}
            disabled={!currentEntry.whatDidIDo.trim() || loading}
            className={`
              w-full flex items-center justify-center space-x-3 px-8 py-4 rounded-lg font-medium text-base transition-all duration-200
              ${loading 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : currentEntry.whatDidIDo.trim()
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Add Today's Entry</span>
              </>
            )}
          </button>
        </div>
      </div>

        {/* AI Insights */}
        {showAIInsights && latestAnalyzedEntry && (
          <div className="mb-8">
            <AIInsights 
              latestEntry={latestAnalyzedEntry}
              recentEntries={journalEntries}
              onAnalysisComplete={(analysis) => {
                console.log('AI Analysis completed:', analysis);
              }}
            />
          </div>
        )}

      {/* Calendar View */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-light text-black">Your Journey</h3>
          </div>
          {journalEntries.length > 0 && (
            <span className="text-sm text-gray-500">{journalEntries.length} entries</span>
          )}
        </div>

        {/* Calendar */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h4 className="text-lg font-medium text-black">
              {currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h4>
            
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const daysInMonth = getDaysInMonth(currentDate);
                const firstDay = getFirstDayOfMonth(currentDate);
                const days = [];

                // Empty cells for days before the first day of the month
                for (let i = 0; i < firstDay; i++) {
                  days.push(
                    <div key={`empty-${i}`} className="p-2 h-12"></div>
                  );
                }

                // Days of the month
                for (let day = 1; day <= daysInMonth; day++) {
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const entry = getEntryForDate(date);
                  const today = isToday(date);

                  days.push(
                    <motion.div
                      key={day}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDateClick(date)}
                      className={`
                        p-2 h-12 flex items-center justify-center text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 relative
                        ${today ? 'bg-black text-white' : 'hover:bg-gray-100'}
                        ${entry ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                      `}
                    >
                      <span>{day}</span>
                      {entry && (
                        <div className="absolute top-1 right-1 flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span className="text-xs">{getMoodIcon(entry.mood)}</span>
                        </div>
                      )}
                    </motion.div>
                  );
                }

                return days;
              })()}
            </div>

          {/* Calendar Legend */}
          <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-black rounded"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 border-2 border-blue-500 rounded"></div>
              <span>Has Entry</span>
            </div>
          </div>
        </div>
      </div>

        {/* Entry Modal */}
        <AnimatePresence>
          {showEntryModal && selectedEntry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowEntryModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {new Date(selectedEntry.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
                        <span>{getMoodIcon(selectedEntry.mood)}</span>
                        <span className="font-medium">Mood: {selectedEntry.mood}/10</span>
                      </span>
                      <span className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
                        <span>{getEnergyIcon(selectedEntry.energy)}</span>
                        <span className="font-medium">Energy: {selectedEntry.energy}/10</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        handleDeleteEntry(selectedEntry.id);
                        setShowEntryModal(false);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowEntryModal(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-blue-900">What I did:</span>
                    </div>
                    <p className="text-blue-800">{selectedEntry.whatDidIDo}</p>
                  </div>
                  
                  {selectedEntry.didIMoveCloser && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-500">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-900">Progress:</span>
                      </div>
                      <p className="text-green-800">{selectedEntry.didIMoveCloser}</p>
                    </div>
                  )}
                  
                  {selectedEntry.lessonsLearned && (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-l-4 border-purple-500">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-purple-900">Lessons:</span>
                      </div>
                      <p className="text-purple-800">{selectedEntry.lessonsLearned}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={hideConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  );
};

export default VisionPage;
