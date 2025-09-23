import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { saveUserLocation, getUserLocation } from '../firebase/userLocation';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [isLocationSet, setIsLocationSet] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const { user } = useAuth();

  // Get user's device timezone information
  const getDeviceTimezone = () => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const now = new Date();
      const timezoneName = now.toLocaleString('en', { timeZoneName: 'long' }).split(', ')[1];
      const timezoneShort = now.toLocaleString('en', { timeZoneName: 'short' }).split(', ')[1];
      const offset = now.getTimezoneOffset();
      const offsetHours = Math.floor(Math.abs(offset) / 60);
      const offsetMinutes = Math.abs(offset) % 60;
      const offsetSign = offset <= 0 ? '+' : '-';
      const offsetString = `UTC${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
      
      return {
        timezone,
        timezoneName,
        timezoneShort,
        offset,
        offsetString,
        localTime: now.toLocaleString(),
        localDate: now.toLocaleDateString(),
        localTimeOnly: now.toLocaleTimeString()
      };
    } catch (error) {
      console.error('Error getting device timezone:', error);
      return null;
    }
  };

  // Load location from Firebase when user is authenticated
  useEffect(() => {
    const loadUserLocation = async () => {
      if (user && !isLocationSet && !isLoadingLocation) {
        setIsLoadingLocation(true);
        
        try {
          // First try to get from Firebase
          const firebaseResult = await getUserLocation(user.uid);
          
          if (firebaseResult.success) {
            setLocation(firebaseResult.location);
            setIsLocationSet(true);
            // Also save to localStorage for faster access
            localStorage.setItem('billionaire-os-location', JSON.stringify(firebaseResult.location));
          } else {
            // Fallback to localStorage if Firebase doesn't have data
            const savedLocation = localStorage.getItem('billionaire-os-location');
            if (savedLocation) {
              try {
                const parsedLocation = JSON.parse(savedLocation);
                setLocation(parsedLocation);
                setIsLocationSet(true);
                // Save to Firebase for future use
                await saveUserLocation(user.uid, parsedLocation);
              } catch (error) {
                console.error('Error parsing saved location:', error);
                localStorage.removeItem('billionaire-os-location');
              }
            }
          }
        } catch (error) {
          console.error('Error loading user location:', error);
          // Fallback to localStorage
          const savedLocation = localStorage.getItem('billionaire-os-location');
          if (savedLocation) {
            try {
              const parsedLocation = JSON.parse(savedLocation);
              setLocation(parsedLocation);
              setIsLocationSet(true);
            } catch (parseError) {
              console.error('Error parsing saved location:', parseError);
              localStorage.removeItem('billionaire-os-location');
            }
          }
        } finally {
          setIsLoadingLocation(false);
        }
      }
    };

    loadUserLocation();
  }, [user, isLocationSet, isLoadingLocation]);

  const updateLocation = async (newLocation) => {
    // Add timezone information to the location
    const timezoneInfo = getDeviceTimezone();
    const locationWithTimezone = {
      ...newLocation,
      timezone: timezoneInfo
    };
    
    setLocation(locationWithTimezone);
    setIsLocationSet(true);
    localStorage.setItem('billionaire-os-location', JSON.stringify(locationWithTimezone));
    
    // Save to Firebase if user is authenticated
    if (user) {
      try {
        await saveUserLocation(user.uid, newLocation);
        console.log('Location saved to Firebase successfully');
      } catch (error) {
        console.error('Failed to save location to Firebase:', error);
        // Continue anyway since localStorage is updated
      }
    }
  };

  const clearLocation = () => {
    setLocation(null);
    setIsLocationSet(false);
    localStorage.removeItem('billionaire-os-location');
  };

  // Timezone utility functions
  const getCurrentTime = (format = 'full') => {
    const now = new Date();
    const timezone = location?.timezone?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    switch (format) {
      case 'time':
        return now.toLocaleTimeString('en-US', { timeZone: timezone });
      case 'date':
        return now.toLocaleDateString('en-US', { timeZone: timezone });
      case 'datetime':
        return now.toLocaleString('en-US', { timeZone: timezone });
      case 'iso':
        return now.toISOString();
      default:
        return now.toLocaleString('en-US', { 
          timeZone: timezone,
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
    }
  };

  const getTimezoneInfo = () => {
    return location?.timezone || getDeviceTimezone();
  };

  const formatTimeInTimezone = (date, format = 'full') => {
    const timezone = location?.timezone?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    switch (format) {
      case 'time':
        return dateObj.toLocaleTimeString('en-US', { timeZone: timezone });
      case 'date':
        return dateObj.toLocaleDateString('en-US', { timeZone: timezone });
      case 'datetime':
        return dateObj.toLocaleString('en-US', { timeZone: timezone });
      default:
        return dateObj.toLocaleString('en-US', { 
          timeZone: timezone,
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
    }
  };

  // Helper functions for formatting
  const formatCurrency = (amount, showSymbol = true) => {
    if (!location || !amount) return amount;
    
    const formatter = new Intl.NumberFormat(getLocale(), {
      style: showSymbol ? 'currency' : 'decimal',
      currency: location.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return showSymbol ? formatter.format(amount) : formatter.format(amount);
  };

  const getLocale = () => {
    if (!location) return 'en-US';
    
    const localeMap = {
      'US': 'en-US',
      'IN': 'en-IN',
      'GB': 'en-GB',
      'CA': 'en-CA',
      'AU': 'en-AU',
      'DE': 'de-DE',
      'FR': 'fr-FR',
      'JP': 'ja-JP',
      'SG': 'en-SG',
      'AE': 'ar-AE',
      'CH': 'de-CH',
      'NL': 'nl-NL',
      'SE': 'sv-SE',
      'NO': 'nb-NO',
      'DK': 'da-DK',
      'BR': 'pt-BR',
      'MX': 'es-MX',
      'AR': 'es-AR',
      'ZA': 'en-ZA',
      'KR': 'ko-KR',
      'CN': 'zh-CN',
      'HK': 'zh-HK',
      'TW': 'zh-TW',
      'TH': 'th-TH',
      'MY': 'ms-MY',
      'ID': 'id-ID',
      'PH': 'en-PH',
      'VN': 'vi-VN',
      'NZ': 'en-NZ',
      'IL': 'he-IL'
    };

    return localeMap[location.code] || 'en-US';
  };

  const getCurrencySymbol = () => {
    return location?.symbol || '$';
  };

  const getCountryName = () => {
    return location?.name || 'United States';
  };

  const getCountryCode = () => {
    return location?.code || 'US';
  };

  const getCurrencyCode = () => {
    return location?.currency || 'USD';
  };

  // Context for AI prompts
  const getLocationContext = () => {
    if (!location) return '';
    
    return `The user is located in ${location.name}. Use ${location.currency} (${location.symbol}) as the currency for all financial calculations and examples. Consider local market conditions, regulations, and business practices specific to ${location.name} when providing advice.`;
  };

  const value = {
    location,
    isLocationSet,
    isLoadingLocation,
    updateLocation,
    clearLocation,
    formatCurrency,
    getLocale,
    getCurrencySymbol,
    getCountryName,
    getCountryCode,
    getCurrencyCode,
    getLocationContext,
    // Timezone functions
    getCurrentTime,
    getTimezoneInfo,
    formatTimeInTimezone,
    getDeviceTimezone
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
