import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Target, Calendar, Clock, Zap, TrendingUp, Edit3 } from 'lucide-react';
import { motion, AnimatePresence, useAnimate, usePresence } from 'framer-motion';
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

  // Vanishing List Components
  const VanishingGoal = ({ goal, type, removeElement, handleCheck }) => {
    const [isPresent, safeToRemove] = usePresence();
    const [scope, animate] = useAnimate();

    useEffect(() => {
      if (!isPresent && goal) {
        const exitAnimation = async () => {
          animate(
            "p",
            {
              color: goal.completed ? "#10b981" : "#ef4444",
            },
            {
              ease: "easeIn",
              duration: 0.125,
            }
          );
          await animate(
            scope.current,
            {
              scale: 1.025,
            },
            {
              ease: "easeIn",
              duration: 0.125,
            }
          );

          await animate(
            scope.current,
            {
              opacity: 0,
              x: goal.completed ? 24 : -24,
            },
            {
              delay: 0.75,
            }
          );
          safeToRemove();
        };

        exitAnimation();
      }
    }, [isPresent, goal?.completed, animate, scope, safeToRemove, goal]);

    const getTimeEstimate = (type) => {
      switch(type) {
        case 'daily': return '1 day';
        case 'weekly': return '1 week';
        case 'monthly': return '1 month';
        case 'yearly': return '1 year';
        default: return '1 day';
      }
    };

    // Safety check - return null if goal is undefined (after all hooks)
    if (!goal || !goal.id) {
      console.warn('VanishingGoal: goal is undefined or missing id', goal);
      return null;
    }

    return (
      <motion.div
        ref={scope}
        layout
        className="relative flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <input
          type="checkbox"
          checked={goal.completed}
          onChange={() => handleCheck(goal.id)}
          className="size-4 accent-gray-900 rounded"
        />

        <p
          className={`text-gray-900 transition-colors font-light ${goal.completed && "text-gray-400 line-through"}`}
        >
          {goal.title}
        </p>
        
        <div className="ml-auto flex gap-2">
          <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span>{getTimeEstimate(type)}</span>
          </div>
          <button
            onClick={() => removeElement(goal.id)}
            className="rounded-full bg-red-50 p-2 text-xs text-red-500 transition-colors hover:bg-red-100 hover:text-red-600"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    );
  };

  const VanishingGoalsList = ({ goals, type, handleCheck, removeElement }) => {
    // Filter out any undefined or invalid goals
    const validGoals = goals.filter(goal => goal && goal.id);
    
    return (
      <div className="w-full space-y-3">
        <AnimatePresence>
          {validGoals.map((goal) => (
            <VanishingGoal
              key={goal.id}
              goal={goal}
              type={type}
              handleCheck={handleCheck}
              removeElement={removeElement}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  };

  const GoalForm = ({ type, setGoals, activeSection, setActiveSection }) => {
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState("");

    const handleSubmit = async () => {
      if (!text.length || !user) {
        return;
      }

      setOperationLoading(true);
      const result = await addGoalToDb(user.uid, {
        title: text,
        type: type,
        completed: false,
        progress: 0
      });

      if (result.success) {
        // Create the goal object with proper structure
        const newGoalWithId = {
          id: result.id || result.goal?.id || Date.now().toString(),
          title: text,
          type: type,
          completed: false,
          progress: type === 'daily' ? null : 0,
          ...result.goal
        };
        
        setGoals(prev => ({
          ...prev,
          [type]: [newGoalWithId, ...prev[type]]
        }));
        setText("");
        setVisible(false);
      } else {
        console.error('Failed to add goal:', result.error);
      }
      setOperationLoading(false);
    };

    return (
      <div className="relative">
        <AnimatePresence>
          {visible && (
            <motion.form
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 25 }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="mb-4 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`What's your ${type} goal?`}
                className="h-20 w-full resize-none rounded-lg bg-gray-50 p-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              />
              <div className="flex items-center justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setVisible(false)}
                  className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={operationLoading}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                >
                  {operationLoading ? "Adding..." : "Add Goal"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => setVisible((pv) => !pv)}
          className="w-full rounded-lg border border-gray-200 bg-white py-3 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 flex items-center justify-center gap-2"
        >
          <Plus
            className={`w-4 h-4 transition-transform ${visible ? "rotate-45" : "rotate-0"}`}
          />
          <span className="text-sm font-medium">Add {type} goal</span>
        </button>
      </div>
    );
  };

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
            </div>

            <div className="space-y-4">
              {goals[section.key].length === 0 ? (
                <div className="text-center py-8">
                  <Icon className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-light text-sm">
                    No {section.key} goals yet
                  </p>
                </div>
              ) : (
                <VanishingGoalsList
                  goals={goals[section.key]}
                  type={section.key}
                  handleCheck={(id) => toggleGoal(section.key, id)}
                  removeElement={(id) => deleteGoal(section.key, id)}
                />
              )}
              
              <GoalForm
                type={section.key}
                setGoals={setGoals}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
            </div>
          </motion.div>
        );
      })}
      </div>
    </motion.div>
  );
};

export default GoalsPage;
