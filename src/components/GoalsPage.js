import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Target, Calendar, Clock, Zap, TrendingUp, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { saveNorthStarGoal, getNorthStarGoal, addGoal as addGoalToDb, getGoals, updateGoal as updateGoalInDb, deleteGoal as deleteGoalFromDb } from '../firebase/ultraSimple';
import SoothingLoader from './SoothingLoader';

const GoalsPage = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState({
    yearly: [],
    monthly: [],
    weekly: [],
    daily: []
  });
  const [newGoal, setNewGoal] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const [northStar, setNorthStar] = useState('');
  const [isEditingNorthStar, setIsEditingNorthStar] = useState(false);
  const [northStarInput, setNorthStarInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);

  // Load data from Firebase
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setLoading(true);
        try {
          const [northStarResult, goalsResult] = await Promise.all([
            getNorthStarGoal(user.uid),
            getGoals(user.uid)
          ]);
          
          if (northStarResult.success && northStarResult.goal) {
            setNorthStar(northStarResult.goal);
          }
          
          if (goalsResult.success) {
            // Organize goals by type
            const organizedGoals = {
              yearly: [],
              monthly: [],
              weekly: [],
              daily: []
            };
            
            goalsResult.goals.forEach(goal => {
              if (organizedGoals[goal.type]) {
                organizedGoals[goal.type].push(goal);
              }
            });
            
            setGoals(organizedGoals);
          }
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadData();
  }, [user]);


  const addGoal = async (type) => {
    if (!newGoal.trim() || !user) return;
    
    setOperationLoading(true);
    const goalData = {
      title: newGoal,
      type: type,
      completed: false,
      progress: type === 'daily' ? null : 0
    };

    const result = await addGoalToDb(user.uid, goalData);
    
    if (result.success) {
      const newGoalWithId = {
        id: result.id,
        ...goalData
      };
      
      setGoals(prev => ({
        ...prev,
        [type]: [...prev[type], newGoalWithId]
      }));
      
      setNewGoal('');
      setActiveSection('');
    } else {
      console.error('Failed to add goal:', result.error);
    }
    
    setOperationLoading(false);
  };

  const updateProgress = async (type, id, newProgress) => {
    const clampedProgress = Math.max(0, Math.min(100, newProgress));
    const isCompleted = clampedProgress >= 100;
    
    const result = await updateGoalInDb(id, { 
      progress: clampedProgress, 
      completed: isCompleted 
    });
    
    if (result.success) {
      setGoals(prev => ({
        ...prev,
        [type]: prev[type].map(goal =>
          goal.id === id
            ? { ...goal, progress: clampedProgress, completed: isCompleted }
            : goal
        )
      }));
    } else {
      console.error('Failed to update goal progress:', result.error);
    }
  };

  const toggleGoal = (type, id) => {
    const currentGoal = goals[type].find(goal => goal.id === id);
    if (!currentGoal) return;
    
    const newCompleted = !currentGoal.completed;
    
    // Immediate UI update for instant feedback
    setGoals(prev => ({
      ...prev,
      [type]: prev[type].map(goal =>
        goal.id === id ? { ...goal, completed: newCompleted } : goal
      )
    }));
    
    // Firebase update in background (non-blocking)
    updateGoalInDb(id, { completed: newCompleted }).then(result => {
      if (!result.success) {
        // Revert on failure
        setGoals(prev => ({
          ...prev,
          [type]: prev[type].map(goal =>
            goal.id === id ? { ...goal, completed: !newCompleted } : goal
          )
        }));
        console.error('Failed to toggle goal:', result.error);
      }
    });
  };

  const deleteGoal = async (type, id) => {
    setOperationLoading(true);
    const result = await deleteGoalFromDb(id);
    
    if (result.success) {
      setGoals(prev => ({
        ...prev,
        [type]: prev[type].filter(goal => goal.id !== id)
      }));
    } else {
      console.error('Failed to delete goal:', result.error);
    }
    setOperationLoading(false);
  };

  const handleNorthStarEdit = () => {
    setNorthStarInput(northStar);
    setIsEditingNorthStar(true);
  };

  const saveNorthStar = async () => {
    if (user && northStarInput.trim()) {
      setLoading(true);
      const success = await saveNorthStarGoal(user.uid, northStarInput.trim());
      if (success) {
        setNorthStar(northStarInput.trim());
      }
      setIsEditingNorthStar(false);
      setLoading(false);
    }
  };

  const cancelNorthStarEdit = () => {
    setNorthStarInput('');
    setIsEditingNorthStar(false);
  };

  const sections = [
    { key: 'daily', title: 'Daily Tasks', icon: Zap },
    { key: 'weekly', title: 'Weekly Goals', icon: Clock },
    { key: 'monthly', title: 'Monthly Goals', icon: Calendar },
    { key: 'yearly', title: 'Yearly Goals', icon: TrendingUp }
  ];

  const renderGoal = (goal, type, section) => {
    if (type === 'daily') {
      return (
        <div key={goal.id} className="group flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={goal.completed}
              onChange={() => toggleGoal(type, goal.id)}
              className="sr-only"
            />
            <motion.div 
              onClick={() => toggleGoal(type, goal.id)}
              whileTap={{ scale: 0.9 }}
              className={`w-4 h-4 rounded border-2 cursor-pointer transition-all duration-75 flex items-center justify-center ${
                goal.completed 
                  ? 'bg-black border-black' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <AnimatePresence>
                {goal.completed && (
                  <motion.svg
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          <span className={`flex-1 font-light transition-colors ${
            goal.completed 
              ? 'line-through text-gray-400' 
              : 'text-black'
          }`}>
            {goal.title}
          </span>
          <button
            onClick={() => deleteGoal(type, goal.id)}
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      );
    }

    return (
      <div key={goal.id} className="group p-5 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-light text-black leading-relaxed">{goal.title}</h4>
          <button
            onClick={() => deleteGoal(type, goal.id)}
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400 font-light">Progress</span>
            <span className="font-light text-black">{goal.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goal.progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-1.5 rounded-full bg-black"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => updateProgress(type, goal.id, goal.progress + 25)}
            className="flex-1 px-3 py-2 text-xs font-light border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 transition-colors"
          >
            +25%
          </button>
          <button
            onClick={() => updateProgress(type, goal.id, 100)}
            className="flex-1 px-3 py-2 text-xs font-light bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Complete
          </button>
        </div>
      </div>
    );
  };

  // Show loading state
  if (loading && Object.values(goals).every(arr => arr.length === 0)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <SoothingLoader 
          message="Loading your goals..." 
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
      className="min-h-screen bg-white"
    >
      {/* Header */}
      <div className="border-b border-gray-100 pb-6 mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-black">Goals</h1>
        </div>
        <p className="text-gray-400 text-sm sm:text-base font-light ml-11">Define your path to success</p>
      </div>

      {/* North Star Goal */}
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <Target className="w-3 h-3 text-white" />
          </div>
          <h2 className="text-lg font-light text-black">North Star Goal</h2>
          {!isEditingNorthStar && northStar && (
            <button
              onClick={handleNorthStarEdit}
              className="p-1 hover:bg-gray-50 rounded transition-colors"
            >
              <Edit3 className="w-3 h-3 text-gray-400 hover:text-black" />
            </button>
          )}
        </div>
        
        {isEditingNorthStar ? (
          <div className="space-y-3">
            <textarea
              value={northStarInput}
              onChange={(e) => setNorthStarInput(e.target.value)}
              placeholder="What is your ultimate goal? Your North Star that guides all other decisions..."
              className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm font-light"
              rows={3}
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={saveNorthStar}
                disabled={loading || !northStarInput.trim()}
                className="px-4 py-2 bg-black text-white text-sm font-light rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={cancelNorthStarEdit}
                className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-light rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={northStar ? handleNorthStarEdit : () => setIsEditingNorthStar(true)}
            className={`p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              northStar 
                ? 'border-gray-200 bg-gray-50 hover:bg-gray-100' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {northStar ? (
              <p className="text-black font-light leading-relaxed">{northStar}</p>
            ) : (
              <div className="text-center py-4">
                <Target className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 font-light">Click to set your North Star Goal</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-8">
      {sections.map((section, index) => {
        const Icon = section.icon;
        return (
          <motion.div 
            key={section.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border border-gray-100 rounded-lg p-6 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <Icon className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-light text-black">{section.title}</h3>
                  <p className="text-xs text-gray-400 font-light">{goals[section.key].length} {goals[section.key].length === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveSection(activeSection === section.key ? '' : section.key)}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <Plus className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
              </button>
            </div>

            <AnimatePresence>
              {activeSection === section.key && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <input
                      type="text"
                      placeholder={`Enter your ${section.key} goal...`}
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm font-light"
                      onKeyPress={(e) => e.key === 'Enter' && addGoal(section.key)}
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => addGoal(activeSection)}
                        disabled={operationLoading}
                        className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {operationLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            Adding...
                          </>
                        ) : (
                          'Add Goal'
                        )}
                      </button>
                      <button
                        onClick={() => setActiveSection('')}
                        className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-light rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              {goals[section.key].length === 0 ? (
                <div className="text-center py-8">
                  <Icon className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-light text-sm">
                    No {section.key} goals yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {goals[section.key].map((goal, goalIndex) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: goalIndex * 0.05 }}
                    >
                      {renderGoal(goal, section.key, section)}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
      </div>
    </motion.div>
  );
};

export default GoalsPage;
