import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';

// Save user location to Firebase
export const saveUserLocation = async (userId, locationData) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Update the user document with location data
    await updateDoc(userRef, {
      location: {
        country: locationData.name,
        countryCode: locationData.code,
        currency: locationData.currency,
        currencySymbol: locationData.symbol,
        updatedAt: new Date().toISOString()
      }
    });

    console.log('User location saved to Firebase:', locationData);
    return { success: true };
  } catch (error) {
    // If document doesn't exist, create it
    if (error.code === 'not-found') {
      try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
          location: {
            country: locationData.name,
            countryCode: locationData.code,
            currency: locationData.currency,
            currencySymbol: locationData.symbol,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }, { merge: true });

        console.log('User location document created:', locationData);
        return { success: true };
      } catch (createError) {
        console.error('Error creating user location document:', createError);
        return { success: false, error: createError.message };
      }
    }
    
    console.error('Error saving user location:', error);
    return { success: false, error: error.message };
  }
};

// Get user location from Firebase
export const getUserLocation = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (userData.location) {
        return {
          success: true,
          location: {
            name: userData.location.country,
            code: userData.location.countryCode,
            currency: userData.location.currency,
            symbol: userData.location.currencySymbol
          }
        };
      }
    }

    return { success: false, error: 'No location data found' };
  } catch (error) {
    console.error('Error getting user location:', error);
    return { success: false, error: error.message };
  }
};

// Update user location preferences
export const updateUserLocationPreferences = async (userId, preferences) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      'location.preferences': preferences,
      'location.updatedAt': new Date().toISOString()
    });

    console.log('User location preferences updated:', preferences);
    return { success: true };
  } catch (error) {
    console.error('Error updating location preferences:', error);
    return { success: false, error: error.message };
  }
};

// Get user's complete profile including location
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { success: true, profile: userSnap.data() };
    }

    return { success: false, error: 'User profile not found' };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: error.message };
  }
};
