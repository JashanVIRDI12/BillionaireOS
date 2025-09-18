import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth, googleProvider } from './config';
import Cookies from 'js-cookie';

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    console.log('Attempting Google sign in...');
    console.log('Auth object:', auth);
    console.log('Google provider:', googleProvider);
    
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    console.log('Google sign in successful:', user);
    
    // Set session cookie
    Cookies.set('user_session', user.uid, { expires: 7 }); // 7 days
    
    return { success: true, user };
  } catch (error) {
    console.error('Google sign in error details:', {
      code: error.code,
      message: error.message,
      customData: error.customData
    });
    return { success: false, error: error.message };
  }
};



// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    Cookies.remove('user_session');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
};

// Set persistence
export const setAuthPersistence = async (persistent = true) => {
  try {
    const persistence = persistent ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);
  } catch (error) {
    console.error('Set persistence error:', error);
  }
};

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};