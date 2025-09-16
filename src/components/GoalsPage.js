import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Target, CheckCircle, Calendar, Clock, Zap, TrendingUp } from 'lucide-react';

const GoalsPage = () => {
  const [goals, setGoals] = useState({
    yearly: [],
    monthly: [],
    weekly: [],
    daily: []
  });
  const [newGoal, setNewGoal] = useState('');
  const [activeSection, setActiveSection] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = (type) => {
    if (!newGoal.trim()) return;
    
    const goal = {
      id: Date.now(),
      title: newGoal,
      completed: false,
      progress: type === 'daily' ? null : 0
    };

    setGoals(prev => ({
      ...prev,
      [type]: [...prev[type], goal]
    }));
    
    setNewGoal('');
    setActiveSection('');
  };

  const updateProgress = (type, id, newProgress) => {
    setGoals(prev => ({
      ...prev,
      [type]: prev[type].map(goal =>
        goal.id === id
          ? { ...goal, progress: Math.max(0, Math.min(100, newProgress)), completed: newProgress >= 100 }
          : goal
      )
    }));
  };

  const toggleGoal = (type, id) => {
    setGoals(prev => ({
      ...prev,
      [type]: prev[type].map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    }));
  };

  const deleteGoal = (type, id) => {
    setGoals(prev => ({
      ...prev,
      [type]: prev[type].filter(goal => goal.id !== id)
    }));
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
        <div key={goal.id} className="group flex items-center gap-3 p-3 bg-white border border-gray-200 rounded">
          <input
            type="checkbox"
            checked={goal.completed}
            onChange={() => toggleGoal(type, goal.id)}
            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-2 focus:ring-blue-500"
          />
          <span className={`flex-1 ${
            goal.completed 
              ? 'line-through text-gray-500' 
              : 'text-gray-900'
          }`}>
            {goal.title}
          </span>
          <button
            onClick={() => deleteGoal(type, goal.id)}
            className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div key={goal.id} className="group p-4 bg-white border border-gray-200 rounded">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-medium text-gray-900">{goal.title}</h4>
          <button
            onClick={() => deleteGoal(type, goal.id)}
            className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">{goal.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-black transition-all duration-300"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => updateProgress(type, goal.id, goal.progress + 25)}
            className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            +25%
          </button>
          <button
            onClick={() => updateProgress(type, goal.id, 100)}
            className="flex-1 px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800"
          >
            Complete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        const Icon = section.icon;
        return (
          <div 
            key={section.key} 
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                  <p className="text-sm text-gray-600">{goals[section.key].length} {goals[section.key].length === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveSection(activeSection === section.key ? '' : section.key)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                <Plus className="w-4 h-4" />
                Add {section.key === 'weekly' ? 'Task' : 'Goal'}
              </button>
            </div>

            {activeSection === section.key && (
              <div className="mb-6 p-4 bg-gray-50 rounded border">
                <input
                  type="text"
                  placeholder={`Enter your ${section.key} goal...`}
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && addGoal(section.key)}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => addGoal(section.key)}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  >
                    Add Goal
                  </button>
                  <button
                    onClick={() => setActiveSection('')}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {goals[section.key].length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-1">
                    No {section.key} goals yet
                  </p>
                  <p className="text-gray-400 text-sm">
                    Click the button above to add your first goal!
                  </p>
                </div>
              ) : (
                goals[section.key].map(goal => renderGoal(goal, section.key, section))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GoalsPage;
