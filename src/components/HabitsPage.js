import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckSquare } from 'lucide-react';
import { cn } from '../utils/cn';

const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(getWeekStart(new Date()));

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
  const todayDate = new Date().toISOString().split('T')[0];

  // Load data from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem('weeklyHabits');
    if (savedHabits) {
      const parsed = JSON.parse(savedHabits);
      // Reset habits if it's a new week
      const savedWeek = parsed.weekStart;
      if (savedWeek !== currentWeek.toISOString().split('T')[0]) {
        // New week - reset all completions
        const resetHabits = parsed.habits.map(habit => ({
          ...habit,
          completedDays: {}
        }));
        setHabits(resetHabits);
      } else {
        setHabits(parsed.habits);
      }
    }
  }, [currentWeek]);

  // Save data to localStorage
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('weeklyHabits', JSON.stringify({
        habits,
        weekStart: currentWeek.toISOString().split('T')[0]
      }));
    }
  }, [habits, currentWeek]);

  // Toggle habit completion for a specific date
  const toggleHabit = (habitId, date) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const completedDays = { ...habit.completedDays };
        if (completedDays[date]) {
          delete completedDays[date];
        } else {
          completedDays[date] = true;
        }
        return { ...habit, completedDays };
      }
      return habit;
    }));
  };

  // Add new habit
  const addHabit = () => {
    if (newHabit.trim()) {
      const habit = {
        id: Date.now(),
        name: newHabit.trim(),
        completedDays: {}
      };
      setHabits(prev => [...prev, habit]);
      setNewHabit('');
      setShowAddHabit(false);
    }
  };

  // Delete habit
  const deleteHabit = (habitId) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  };

  // Calculate weekly progress for a habit
  const getWeeklyProgress = (habit) => {
    const completed = weekDates.filter(date => habit.completedDays[date]).length;
    return Math.round((completed / 7) * 100);
  };

  // Calculate daily progress across all habits
  const getDailyProgress = () => {
    if (habits.length === 0) return 0;
    const completedToday = habits.filter(habit => habit.completedDays[todayDate]).length;
    return Math.round((completedToday / habits.length) * 100);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weekly Habits</h1>
          <p className="text-gray-600 mt-1">Track your habits for the week of {currentWeek.toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Today's Progress</div>
          <div className="text-2xl font-bold text-gray-900">{getDailyProgress()}%</div>
        </div>
      </div>

      {/* Weekly Habit Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-200">
                Habit
              </th>
              {dayNames.map((day, index) => (
                <th key={day} className={cn(
                  "px-3 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200",
                  weekDates[index] === todayDate && "bg-blue-50"
                )}>
                  {day}
                  <div className="text-xs text-gray-500 font-normal">
                    {new Date(weekDates[index]).getDate()}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                Progress
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {habits.map((habit) => (
              <tr key={habit.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                  {habit.name}
                </td>
                {weekDates.map((date, index) => (
                  <td key={date} className={cn(
                    "px-3 py-4 text-center border-r border-gray-200",
                    date === todayDate && "bg-blue-50"
                  )}>
                    <button
                      onClick={() => toggleHabit(habit.id, date)}
                      className={cn(
                        "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors",
                        habit.completedDays[date]
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-gray-400"
                      )}
                    >
                      {habit.completedDays[date] && <CheckSquare className="w-4 h-4" />}
                    </button>
                  </td>
                ))}
                <td className="px-4 py-4 text-center border-r border-gray-200">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${getWeeklyProgress(habit)}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 min-w-[3rem]">
                      {getWeeklyProgress(habit)}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {habits.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No habits yet. Add your first habit to get started!</p>
          </div>
        )}
      </div>

      {/* Add Habit Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {!showAddHabit ? (
          <button
            onClick={() => setShowAddHabit(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Habit
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Enter habit name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
              autoFocus
            />
            <button
              onClick={addHabit}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddHabit(false);
                setNewHabit('');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitsPage;
