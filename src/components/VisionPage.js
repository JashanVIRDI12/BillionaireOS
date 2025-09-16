import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Plus, Edit3, Star, Save, HelpCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import { triggerSuccessAnimation } from '../utils/feedback';

const VisionPage = () => {
  const [northStar, setNorthStar] = useState('');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [showNorthStarInfo, setShowNorthStarInfo] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    whatDidIDo: '',
    didIMoveCloser: '',
    lessonsLearned: '',
    mood: 5,
    energy: 5,
    date: new Date().toISOString().split('T')[0]
  });

  const saveButtonRef = useRef(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedNorthStar = localStorage.getItem('northStar');
    const savedJournalEntries = localStorage.getItem('journalEntries');

    if (savedNorthStar) setNorthStar(savedNorthStar);
    if (savedJournalEntries) setJournalEntries(JSON.parse(savedJournalEntries));
  }, []);

  // Save data to localStorage with debounce to prevent re-renders
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('northStar', northStar);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [northStar]);

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  const handleSaveGoal = React.useCallback(() => {
    setIsEditingGoal(false);
  }, []);

  const handleNorthStarChange = React.useCallback((e) => {
    setNorthStar(e.target.value);
  }, []);


  const handleAddJournalEntry = () => {
    if (currentEntry.whatDidIDo.trim()) {
      const newEntry = {
        ...currentEntry,
        id: Date.now(),
        timestamp: new Date().toISOString()
      };
      const updatedEntries = [newEntry, ...journalEntries];
      setJournalEntries(updatedEntries);
      localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
      
      // Trigger success animation
      if (saveButtonRef.current) {
        triggerSuccessAnimation(saveButtonRef.current);
      }
      
      // Reset form
      setCurrentEntry({
        whatDidIDo: '',
        didIMoveCloser: '',
        lessonsLearned: '',
        mood: 5,
        energy: 5,
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const getMoodEmoji = (rating) => {
    if (rating <= 2) return '😢';
    if (rating <= 4) return '😐';
    if (rating <= 6) return '🙂';
    if (rating <= 8) return '😊';
    return '🤩';
  };

  const getEnergyEmoji = (rating) => {
    if (rating <= 2) return '🪫';
    if (rating <= 4) return '🔋';
    if (rating <= 6) return '⚡';
    if (rating <= 8) return '🔥';
    return '⚡⚡';
  };

  const getEnergyColor = (rating) => {
    if (rating <= 3) return 'text-red-500';
    if (rating <= 6) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-8">
      {/* North Star Goal Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">North Star Goal</h2>
            <div className="relative">
              <button
                onClick={() => setShowNorthStarInfo(!showNorthStarInfo)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              
              {/* North Star Info Tooltip */}
              {showNorthStarInfo && (
                <div className="absolute top-8 left-0 w-64 p-3 bg-white rounded border shadow-lg z-50">
                  <p className="text-sm text-gray-700">
                    Your ultimate long-term vision (5-10+ years) that guides all your decisions and goals.
                  </p>
                  <button
                    onClick={() => setShowNorthStarInfo(false)}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                  >
                    Got it!
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsEditingGoal(!isEditingGoal)}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-black border-2 border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-200 font-medium uppercase tracking-wide"
          >
            {isEditingGoal ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{isEditingGoal ? 'Save' : 'Edit'}</span>
          </button>
        </div>
        
        {isEditingGoal ? (
          <input
            type="text"
            value={northStar}
            onChange={handleNorthStarChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveGoal()}
            placeholder="Define your ultimate goal..."
            className="w-full p-3 border-2 border-gray-300 focus:border-black outline-none transition-colors"
            autoFocus
          />
        ) : (
          <div className="p-4 bg-gray-50 rounded border">
            <p className="text-gray-700">
              {northStar || "Click edit to define your North Star Goal"}
            </p>
          </div>
        )}
      </div>


      {/* Daily Journal Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Daily Journal</h2>
        </div>

        {/* New Entry Form */}
        <div className="space-y-4 mb-8 p-4 bg-gray-50 rounded border">
          <h3 className="font-medium text-gray-900">Today's Entry</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What did I do today?
            </label>
            <textarea
              value={currentEntry.whatDidIDo}
              onChange={(e) => setCurrentEntry({...currentEntry, whatDidIDo: e.target.value})}
              className="w-full h-20 p-3 border-2 border-gray-300 focus:border-black outline-none resize-none transition-colors"
              placeholder="Describe your activities and accomplishments..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Did I move closer to my goal?
            </label>
            <textarea
              value={currentEntry.didIMoveCloser}
              onChange={(e) => setCurrentEntry({...currentEntry, didIMoveCloser: e.target.value})}
              className="w-full h-16 p-3 border-2 border-gray-300 focus:border-black outline-none resize-none transition-colors"
              placeholder="Reflect on your progress..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lessons learned
            </label>
            <textarea
              value={currentEntry.lessonsLearned}
              onChange={(e) => setCurrentEntry({...currentEntry, lessonsLearned: e.target.value})}
              className="w-full h-16 p-3 border-2 border-gray-300 focus:border-black outline-none resize-none transition-colors"
              placeholder="What insights did you gain today?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mood: {getMoodEmoji(currentEntry.mood)} ({currentEntry.mood}/10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentEntry.mood}
                onChange={(e) => setCurrentEntry({...currentEntry, mood: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Energy: {getEnergyEmoji(currentEntry.energy)} ({currentEntry.energy}/10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentEntry.energy}
                onChange={(e) => setCurrentEntry({...currentEntry, energy: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <button
            ref={saveButtonRef}
            onClick={handleAddJournalEntry}
            disabled={!currentEntry.whatDidIDo.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-black text-white border-2 border-black hover:bg-white hover:text-black disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium uppercase tracking-wide"
          >
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </button>
        </div>

        {/* Past Entries */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Past Entries</h3>
          {journalEntries.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No journal entries yet. Start by adding your first entry above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {journalEntries.map((entry) => (
                <div key={entry.id} className="bg-white border border-gray-200 rounded p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">{entry.date}</h4>
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="flex items-center space-x-1">
                        <span>Mood:</span>
                        <span>{getMoodEmoji(entry.mood)}</span>
                      </span>
                      <span className={cn("font-medium", getEnergyColor(entry.energy))}>
                        Energy: {entry.energy}/10
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded border-l-4 border-gray-400">
                      <span className="font-medium text-gray-700 block mb-1">What I did:</span>
                      <span className="text-gray-600">{entry.whatDidIDo}</span>
                    </div>
                    {entry.didIMoveCloser && (
                      <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                        <span className="font-medium text-gray-700 block mb-1">Progress:</span>
                        <span className="text-gray-600">{entry.didIMoveCloser}</span>
                      </div>
                    )}
                    {entry.lessonsLearned && (
                      <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                        <span className="font-medium text-gray-700 block mb-1">Lessons:</span>
                        <span className="text-gray-600">{entry.lessonsLearned}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisionPage;
