import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, signOutUser, setAuthPersistence } from '../firebase/auth';
import { getUserSettings, saveUserSettings } from '../firebase/firestore';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userSettings, setUserSettings] = useState(null);

  useEffect(() => {
    // Set auth persistence
    setAuthPersistence(true);

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        setUser(user);
        
        // Load user settings
        const settingsResult = await getUserSettings(user.uid);
        if (settingsResult.success && settingsResult.settings) {
          setUserSettings(settingsResult.settings);
        } else {
          // Create default settings for new user
          const defaultSettings = {
            dreamNetWorth: 0,
            currentNetWorth: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          await saveUserSettings(user.uid, defaultSettings);
          setUserSettings(defaultSettings);
        }
      } else {
        setUser(null);
        setUserSettings(null);
        // Clear session cookie
        Cookies.remove('user_session');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    const result = await signOutUser();
    if (result.success) {
      setUser(null);
      setUserSettings(null);
    }
    setLoading(false);
    return result;
  };

  const updateUserSettings = async (newSettings) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    const result = await saveUserSettings(user.uid, newSettings);
    if (result.success) {
      setUserSettings(prev => ({ ...prev, ...newSettings }));
    }
    return result;
  };

  const value = {
    user,
    userSettings,
    loading,
    logout,
    updateUserSettings
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};