import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Target, Plus, Minus, Edit3, Save, HelpCircle, Trash2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  addUltraSimpleAsset,
  addUltraSimpleLiability,
  getUltraSimpleAssets,
  getUltraSimpleLiabilities,
  updateUltraSimpleAsset,
  updateUltraSimpleLiability,
  deleteUltraSimpleAsset,
  deleteUltraSimpleLiability
} from '../firebase/ultraSimple';
import AnimatedCounter from './AnimatedCounter';
import ConfirmModal from './ConfirmModal';
import SoothingLoader, { SkeletonLoader, CardSkeleton } from './SoothingLoader';


const NetWorthPage = () => {
  const { user, userSettings, updateUserSettings } = useAuth();
  const [currentNetWorth, setCurrentNetWorth] = useState(0);
  const [dreamNetWorth, setDreamNetWorth] = useState(0);
  const [isEditingDream, setIsEditingDream] = useState(false);
  
  // Separate input state for dream net worth editing
  const [dreamNetWorthInput, setDreamNetWorthInput] = useState('');
  
  // States for editing individual assets and liabilities
  const [editingAsset, setEditingAsset] = useState(null);
  const [editingLiability, setEditingLiability] = useState(null);
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });
  const [showNetWorthInfo, setShowNetWorthInfo] = useState(false);
  const [showAssetInfo, setShowAssetInfo] = useState(false);
  const [showLiabilityInfo, setShowLiabilityInfo] = useState(false);

  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [newAsset, setNewAsset] = useState({
    amount: '',
    note: ''
  });
  const [newLiability, setNewLiability] = useState({
    amount: '',
    note: ''
  });





  // Load user settings only once when they first become available
  useEffect(() => {
    if (userSettings && !isEditingDream) {
      setDreamNetWorth(userSettings.dreamNetWorth || 0);
    }
  }, [userSettings, isEditingDream]);

  // Load data from Firebase on component mount (only once)
  useEffect(() => {
    if (!user) {
      setInitialLoading(false);
      return;
    }

    const loadData = async () => {
      setInitialLoading(true);
      try {
        const [assetsResult, liabilitiesResult] = await Promise.all([
          getUltraSimpleAssets(user.uid),
          getUltraSimpleLiabilities(user.uid)
        ]);

        if (assetsResult.success) {
          setAssets(assetsResult.assets);
        }

        if (liabilitiesResult.success) {
          setLiabilities(liabilitiesResult.liabilities);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        // Add a minimum loading time for smooth experience
        setTimeout(() => {
          setInitialLoading(false);
        }, 800);
      }
    };

    loadData();
  }, [user]); // Only depend on user, not userSettings

  // Save dream net worth to Firebase (only when not editing and values actually change)
  useEffect(() => {
    if (user && userSettings && !isEditingDream) {
      const timeoutId = setTimeout(() => {
        // Only update if dream net worth is different from what's in userSettings
        if (userSettings.dreamNetWorth !== dreamNetWorth) {
          updateUserSettings({
            dreamNetWorth
          });
        }
      }, 1000); // Debounce saves

      return () => clearTimeout(timeoutId);
    }
  }, [dreamNetWorth, user, userSettings, updateUserSettings, isEditingDream]);



  // Calculate net worth from assets and liabilities
  useEffect(() => {
    const totalAssets = assets.reduce((sum, asset) => sum + asset.amount, 0);
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);
    const calculatedNetWorth = totalAssets - totalLiabilities;
    setCurrentNetWorth(calculatedNetWorth);
  }, [assets, liabilities]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper functions for confirmation
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

  const calculateMonthlyGrowthRate = () => {
    // Since we don't have historical data yet, return 0
    // This could be enhanced later with actual historical tracking
    return 0;
  };

  const calculateYearsToReachDream = () => {
    if (dreamNetWorth <= currentNetWorth) return 0;
    
    const monthlyGrowth = calculateMonthlyGrowthRate();
    if (monthlyGrowth <= 0) return null;
    
    const remainingAmount = dreamNetWorth - currentNetWorth;
    const monthsNeeded = remainingAmount / monthlyGrowth;
    const yearsNeeded = monthsNeeded / 12;
    
    return yearsNeeded;
  };

  const handleAddAsset = async () => {
    console.log('handleAddAsset called');
    console.log('User:', user);
    console.log('newAsset:', newAsset);
    
    if (!user) {
      console.error('No user found');
      return;
    }
    
    const amount = parseFloat(newAsset.amount);
    console.log('Parsed amount:', amount);
    
    if (newAsset.amount && !isNaN(amount) && amount > 0) {
      setLoading(true);
      
      const assetData = {
        amount: amount,
        note: newAsset.note || ''
      };
      
      console.log('Adding asset with data:', assetData);
      
      try {
        const result = await addUltraSimpleAsset(user.uid, amount, newAsset.note);
        console.log('Add asset result:', result);
        
        if (result.success) {
          // Reset form
          setNewAsset({
            amount: '',
            note: ''
          });
          
          // Reload assets to show the new one
          console.log('Reloading assets after successful add...');
          const assetsResult = await getUltraSimpleAssets(user.uid);
          console.log('Assets reload result:', assetsResult);
          
          if (assetsResult.success) {
            setAssets(assetsResult.assets);
          }
        } else {
          console.error('Failed to add asset:', result.error);
        }
      } catch (error) {
        console.error('Error in handleAddAsset:', error);
      }
      
      setLoading(false);
    } else {
      console.error('Invalid amount:', newAsset.amount);
      alert('Please enter a valid amount');
    }
  };

  const handleAddLiability = async () => {
    console.log('handleAddLiability called');
    console.log('User:', user);
    console.log('newLiability:', newLiability);
    
    if (!user) {
      console.error('No user found');
      return;
    }
    
    const amount = parseFloat(newLiability.amount);
    console.log('Parsed amount:', amount);
    
    if (newLiability.amount && !isNaN(amount) && amount > 0) {
      setLoading(true);
      
      const liabilityData = {
        amount: amount,
        note: newLiability.note || ''
      };
      
      console.log('Adding liability with data:', liabilityData);
      
      try {
        const result = await addUltraSimpleLiability(user.uid, amount, newLiability.note);
        console.log('Add liability result:', result);
        
        if (result.success) {
          // Reset form
          setNewLiability({
            amount: '',
            note: ''
          });
          
          // Reload liabilities to show the new one
          console.log('Reloading liabilities after successful add...');
          const liabilitiesResult = await getUltraSimpleLiabilities(user.uid);
          console.log('Liabilities reload result:', liabilitiesResult);
          
          if (liabilitiesResult.success) {
            setLiabilities(liabilitiesResult.liabilities);
          }
        } else {
          console.error('Failed to add liability:', result.error);
        }
      } catch (error) {
        console.error('Error in handleAddLiability:', error);
      }
      
      setLoading(false);
    } else {
      console.error('Invalid amount:', newLiability.amount);
      alert('Please enter a valid amount');
    }
  };

  // Asset management functions
  const handleEditAsset = (asset) => {
    setEditingAsset({
      id: asset.id,
      amount: asset.amount.toString(),
      note: asset.note
    });
  };

  const handleSaveAsset = async () => {
    if (!editingAsset) return;
    
    setLoading(true);
    const result = await updateUltraSimpleAsset(
      editingAsset.id,
      parseFloat(editingAsset.amount) || 0,
      editingAsset.note
    );
    
    if (result.success) {
      const assetsResult = await getUltraSimpleAssets(user.uid);
      if (assetsResult.success) {
        setAssets(assetsResult.assets);
      }
      setEditingAsset(null);
    } else {
      console.error('Failed to update asset:', result.error);
    }
    setLoading(false);
  };

  const handleDeleteAsset = async (assetId) => {
    showConfirmModal(
      'Delete Asset',
      'Are you sure you want to delete this asset? This action cannot be undone.',
      async () => {
        setLoading(true);
        const result = await deleteUltraSimpleAsset(assetId);
        
        if (result.success) {
          const assetsResult = await getUltraSimpleAssets(user.uid);
          if (assetsResult.success) {
            setAssets(assetsResult.assets);
          }
        } else {
          console.error('Failed to delete asset:', result.error);
        }
        setLoading(false);
      }
    );
  };

  // Liability management functions
  const handleEditLiability = (liability) => {
    setEditingLiability({
      id: liability.id,
      amount: liability.amount.toString(),
      note: liability.note
    });
  };

  const handleSaveLiability = async () => {
    if (!editingLiability) return;
    
    setLoading(true);
    const result = await updateUltraSimpleLiability(
      editingLiability.id,
      parseFloat(editingLiability.amount) || 0,
      editingLiability.note
    );
    
    if (result.success) {
      const liabilitiesResult = await getUltraSimpleLiabilities(user.uid);
      if (liabilitiesResult.success) {
        setLiabilities(liabilitiesResult.liabilities);
      }
      setEditingLiability(null);
    } else {
      console.error('Failed to update liability:', result.error);
    }
    setLoading(false);
  };

  const handleDeleteLiability = async (liabilityId) => {
    showConfirmModal(
      'Delete Liability',
      'Are you sure you want to delete this liability? This action cannot be undone.',
      async () => {
        setLoading(true);
        const result = await deleteUltraSimpleLiability(liabilityId);
        
        if (result.success) {
          const liabilitiesResult = await getUltraSimpleLiabilities(user.uid);
          if (liabilitiesResult.success) {
            setLiabilities(liabilitiesResult.liabilities);
          }
        } else {
          console.error('Failed to delete liability:', result.error);
        }
        setLoading(false);
      }
    );
  };

  const yearsToReachDream = calculateYearsToReachDream();
  const monthlyGrowth = calculateMonthlyGrowthRate();

  // Show loading state
  if (initialLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <SoothingLoader 
          message="Loading your financial data..." 
          icon={DollarSign}
        />
        <CardSkeleton count={4} />
        <SkeletonLoader count={3} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >


      {/* Current Net Worth Section */}
      <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-xl p-8 shadow-xl">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Net Worth</h2>
            <p className="text-gray-300 text-sm">Calculated from your assets and liabilities</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-5xl font-bold text-white mb-2">
              <AnimatedCounter 
                value={currentNetWorth} 
                formatFunction={formatCurrency}
                duration={800}
              />
            </p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              currentNetWorth >= 0 
                ? 'bg-green-500 bg-opacity-20 text-green-300' 
                : 'bg-red-500 bg-opacity-20 text-red-300'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {currentNetWorth >= 0 ? 'Positive Net Worth' : 'Negative Net Worth'}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Plus className="w-4 h-4 text-green-300" />
                <span className="text-sm font-medium text-gray-300">Total Assets</span>
              </div>
              <p className="text-xl font-bold text-white">
                <AnimatedCounter 
                  value={assets.reduce((sum, asset) => sum + asset.amount, 0)} 
                  formatFunction={formatCurrency}
                  duration={600}
                />
              </p>
              <p className="text-xs text-gray-400">{assets.length} items</p>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Minus className="w-4 h-4 text-red-300" />
                <span className="text-sm font-medium text-gray-300">Total Liabilities</span>
              </div>
              <p className="text-xl font-bold text-white">
                <AnimatedCounter 
                  value={liabilities.reduce((sum, liability) => sum + liability.amount, 0)} 
                  formatFunction={formatCurrency}
                  duration={600}
                />
              </p>
              <p className="text-xs text-gray-400">{liabilities.length} items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dream Net Worth Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Dream Net Worth</h2>
            <div className="relative">
              <button
                onClick={() => setShowNetWorthInfo(!showNetWorthInfo)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              
              {showNetWorthInfo && (
                <div className="absolute top-8 left-0 w-64 p-3 bg-white rounded border shadow-lg z-50">
                  <p className="text-sm text-gray-700">
                    Set your ultimate financial goal. We'll calculate how long it will take based on your current growth rate.
                  </p>
                  <button
                    onClick={() => setShowNetWorthInfo(false)}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                  >
                    Got it!
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            onMouseDown={(e) => {
              // Prevent the button click from causing input blur
              e.preventDefault();
            }}
            onClick={() => {
              if (isEditingDream) {
                setDreamNetWorth(parseFloat(dreamNetWorthInput) || 0);
                setIsEditingDream(false);
              } else {
                setDreamNetWorthInput(dreamNetWorth.toString());
                setIsEditingDream(true);
              }
            }}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-black border-2 border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-200 font-medium uppercase tracking-wide"
          >
            {isEditingDream ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{isEditingDream ? 'Save' : 'Edit'}</span>
          </button>
        </div>
        
        {isEditingDream ? (
          <input
            type="number"
            value={dreamNetWorthInput}
            onChange={(e) => setDreamNetWorthInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setDreamNetWorth(parseFloat(dreamNetWorthInput) || 0);
                setIsEditingDream(false);
              }
            }}
            onBlur={() => {
              setDreamNetWorth(parseFloat(dreamNetWorthInput) || 0);
              setIsEditingDream(false);
            }}
            placeholder="Enter your dream net worth..."
            className="w-full p-3 border-2 border-gray-300 focus:border-black outline-none transition-colors text-2xl font-bold"
            autoFocus
          />
        ) : (
          <div className="p-4 bg-gray-50 rounded border">
            <p className="text-3xl font-bold text-gray-900">
              <AnimatedCounter 
                value={dreamNetWorth} 
                formatFunction={formatCurrency}
                duration={800}
              />
            </p>
          </div>
        )}
      </div>

      {/* Progress & Projection Section */}
      {dreamNetWorth > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Progress & Projection</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progress Bar */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700">Progress to Dream Net Worth</span>
                  <span className="text-lg font-bold text-gray-900">
                    {Math.min(100, Math.round((currentNetWorth / dreamNetWorth) * 100))}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                  <div
                    className="h-4 rounded-full bg-gradient-to-r from-gray-800 to-black transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${Math.min(100, (currentNetWorth / dreamNetWorth) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatCurrency(currentNetWorth)}</span>
                  <span>{formatCurrency(dreamNetWorth)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-gray-600">
                  <span className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Remaining</span>
                  <span className="font-bold text-gray-900 text-lg">
                    <AnimatedCounter 
                      value={Math.max(0, dreamNetWorth - currentNetWorth)} 
                      formatFunction={formatCurrency}
                      duration={600}
                    />
                  </span>
                </div>
                <div className="text-gray-600">
                  <span className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Achieved</span>
                  <span className="font-bold text-gray-900 text-lg">
                    <AnimatedCounter 
                      value={Math.min(currentNetWorth, dreamNetWorth)} 
                      formatFunction={formatCurrency}
                      duration={600}
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* Time Projection */}
            <div className="space-y-4">
              {yearsToReachDream !== null && yearsToReachDream > 0 ? (
                <div className="p-4 bg-gray-50 rounded border-l-4 border-black">
                  <h4 className="font-medium text-gray-900 mb-2">Time to Reach Dream</h4>
                  <p className="text-2xl font-bold text-gray-900">
                    {yearsToReachDream < 1 
                      ? `${Math.round(yearsToReachDream * 12)} months`
                      : `${yearsToReachDream.toFixed(1)} years`
                    }
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Based on avg. monthly growth: {formatCurrency(monthlyGrowth)}
                  </p>
                </div>
              ) : yearsToReachDream === 0 ? (
                <div className="p-4 bg-gray-50 rounded border-l-4 border-black">
                  <h4 className="font-medium text-gray-900 mb-2">🎉 Dream Achieved!</h4>
                  <p className="text-sm text-gray-600">
                    You've already reached your dream net worth!
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded border-l-4 border-gray-400">
                  <h4 className="font-medium text-gray-900 mb-2">Need More Data</h4>
                  <p className="text-sm text-gray-600">
                    Add more assets and liabilities to calculate your growth rate and projection.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assets & Liabilities Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Assets</h2>
              <span className="text-sm text-gray-500">(<AnimatedCounter 
                value={assets.reduce((sum, asset) => sum + asset.amount, 0)} 
                formatFunction={formatCurrency}
                duration={500}
              />)</span>
              <button
                onClick={async () => {
                  const result = await getUltraSimpleAssets(user.uid);
                  if (result.success) setAssets(result.assets);
                }}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Refresh
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowAssetInfo(!showAssetInfo)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              {showAssetInfo && (
                <div className="absolute top-8 right-0 w-64 p-3 bg-white rounded border shadow-lg z-50">
                  <p className="text-sm font-medium text-gray-900 mb-2">Common Assets:</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>• Cash & Savings</p>
                    <p>• House/Property</p>
                    <p>• Car/Vehicle</p>
                    <p>• Stocks & Investments</p>
                    <p>• Retirement Accounts</p>
                    <p>• Jewelry & Valuables</p>
                    <p>• Business Assets</p>
                  </div>
                  <button
                    onClick={() => setShowAssetInfo(false)}
                    className="mt-2 text-xs text-black hover:underline"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="number"
              value={newAsset.amount}
              onChange={(e) => setNewAsset({...newAsset, amount: e.target.value})}
              className="w-full p-3 border-2 border-gray-300 focus:border-black outline-none transition-colors"
              placeholder="Enter amount..."
            />
            <input
              type="text"
              value={newAsset.note}
              onChange={(e) => setNewAsset({...newAsset, note: e.target.value})}
              className="w-full p-3 border-2 border-gray-300 focus:border-black outline-none transition-colors"
              placeholder="Description (e.g., House, Savings)"
            />
            <button
              onClick={handleAddAsset}
              disabled={loading || !newAsset.amount || isNaN(parseFloat(newAsset.amount)) || parseFloat(newAsset.amount) <= 0}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-black text-white border-2 border-black hover:bg-white hover:text-black disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium uppercase tracking-wide"
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
              <span>{loading ? 'Adding...' : 'Add Asset'}</span>
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <h4 className="font-medium text-gray-900">Your Assets</h4>
            {assets.length === 0 ? (
              <div className="text-center py-4">
                <Plus className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No assets added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {assets.map((asset) => (
                  <div key={asset.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    {editingAsset && editingAsset.id === asset.id ? (
                      <div className="space-y-3">
                        <input
                          type="number"
                          value={editingAsset.amount}
                          onChange={(e) => setEditingAsset({...editingAsset, amount: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none"
                          placeholder="Amount"
                        />
                        <input
                          type="text"
                          value={editingAsset.note}
                          onChange={(e) => setEditingAsset({...editingAsset, note: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none"
                          placeholder="Description"
                        />
                        <div className="flex space-x-2">
                          <motion.button
                            onClick={handleSaveAsset}
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
                          >
                            <Check className="w-3 h-3" />
                            <span>Save</span>
                          </motion.button>
                          <motion.button
                            onClick={() => setEditingAsset(null)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm font-medium"
                          >
                            <X className="w-3 h-3" />
                            <span>Cancel</span>
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-lg">{formatCurrency(asset.amount)}</p>
                          {asset.note && <p className="text-sm text-gray-600 mt-1">{asset.note}</p>}
                        </div>
                        <div className="flex space-x-1 ml-4">
                          <motion.button
                            onClick={() => handleEditAsset(asset)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
                            title="Edit asset"
                          >
                            <Edit3 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteAsset(asset.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete asset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Liabilities Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <Minus className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Liabilities</h2>
              <span className="text-sm text-gray-500">(<AnimatedCounter 
                value={liabilities.reduce((sum, liability) => sum + liability.amount, 0)} 
                formatFunction={formatCurrency}
                duration={500}
              />)</span>
              <button
                onClick={async () => {
                  const result = await getUltraSimpleLiabilities(user.uid);
                  if (result.success) setLiabilities(result.liabilities);
                }}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Refresh
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowLiabilityInfo(!showLiabilityInfo)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              {showLiabilityInfo && (
                <div className="absolute top-8 right-0 w-64 p-3 bg-white rounded border shadow-lg z-50">
                  <p className="text-sm font-medium text-gray-900 mb-2">Common Liabilities:</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>• Mortgage/Home Loan</p>
                    <p>• Car Loan</p>
                    <p>• Credit Card Debt</p>
                    <p>• Student Loans</p>
                    <p>• Personal Loans</p>
                    <p>• Medical Debt</p>
                    <p>• Business Loans</p>
                  </div>
                  <button
                    onClick={() => setShowLiabilityInfo(false)}
                    className="mt-2 text-xs text-black hover:underline"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="number"
              value={newLiability.amount}
              onChange={(e) => setNewLiability({...newLiability, amount: e.target.value})}
              className="w-full p-3 border-2 border-gray-300 focus:border-black outline-none transition-colors"
              placeholder="Enter amount..."
            />
            <input
              type="text"
              value={newLiability.note}
              onChange={(e) => setNewLiability({...newLiability, note: e.target.value})}
              className="w-full p-3 border-2 border-gray-300 focus:border-black outline-none transition-colors"
              placeholder="Description (e.g., Mortgage, Credit Card)"
            />
            <button
              onClick={handleAddLiability}
              disabled={loading || !newLiability.amount || isNaN(parseFloat(newLiability.amount)) || parseFloat(newLiability.amount) <= 0}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-800 text-white border-2 border-gray-800 hover:bg-white hover:text-gray-800 disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium uppercase tracking-wide"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
              ) : (
                <Minus className="w-4 h-4" />
              )}
              <span>{loading ? 'Adding...' : 'Add Liability'}</span>
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <h4 className="font-medium text-gray-900">Your Liabilities</h4>
            {liabilities.length === 0 ? (
              <div className="text-center py-4">
                <Minus className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No liabilities added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {liabilities.map((liability) => (
                  <div key={liability.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    {editingLiability && editingLiability.id === liability.id ? (
                      <div className="space-y-3">
                        <input
                          type="number"
                          value={editingLiability.amount}
                          onChange={(e) => setEditingLiability({...editingLiability, amount: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none"
                          placeholder="Amount"
                        />
                        <input
                          type="text"
                          value={editingLiability.note}
                          onChange={(e) => setEditingLiability({...editingLiability, note: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none"
                          placeholder="Description"
                        />
                        <div className="flex space-x-2">
                          <motion.button
                            onClick={handleSaveLiability}
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
                          >
                            <Check className="w-3 h-3" />
                            <span>Save</span>
                          </motion.button>
                          <motion.button
                            onClick={() => setEditingLiability(null)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm font-medium"
                          >
                            <X className="w-3 h-3" />
                            <span>Cancel</span>
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-lg">{formatCurrency(liability.amount)}</p>
                          {liability.note && <p className="text-sm text-gray-600 mt-1">{liability.note}</p>}
                        </div>
                        <div className="flex space-x-1 ml-4">
                          <motion.button
                            onClick={() => handleEditLiability(liability)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
                            title="Edit liability"
                          >
                            <Edit3 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteLiability(liability.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete liability"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Net Worth History */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Net Worth History</h2>
        </div>

        {/* Net Worth Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded border-l-4 border-black">
            <h4 className="font-medium text-gray-900 mb-2">Total Assets</h4>
            <p className="text-2xl font-bold text-gray-900">
              <AnimatedCounter 
                value={assets.reduce((sum, asset) => sum + asset.amount, 0)} 
                formatFunction={formatCurrency}
                duration={700}
              />
            </p>
            <p className="text-sm text-gray-600">{assets.length} items</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded border-l-4 border-gray-800">
            <h4 className="font-medium text-gray-900 mb-2">Total Liabilities</h4>
            <p className="text-2xl font-bold text-gray-900">
              <AnimatedCounter 
                value={liabilities.reduce((sum, liability) => sum + liability.amount, 0)} 
                formatFunction={formatCurrency}
                duration={700}
              />
            </p>
            <p className="text-sm text-gray-600">{liabilities.length} items</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded border-l-4 border-gray-600">
            <h4 className="font-medium text-gray-900 mb-2">Net Worth</h4>
            <p className="text-2xl font-bold text-gray-900">
              <AnimatedCounter 
                value={currentNetWorth} 
                formatFunction={formatCurrency}
                duration={800}
              />
            </p>
            <p className="text-sm text-gray-600">
              {currentNetWorth >= 0 ? 'Positive' : 'Negative'} net worth
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={hideConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </motion.div>
  );
};

export default NetWorthPage;
