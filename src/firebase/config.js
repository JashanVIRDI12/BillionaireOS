import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBP1XNjMj84q63pbcqw5Wk0nzM6TVB8mMQ",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "billionaire-os-ef98e.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "billionaire-os-ef98e",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "billionaire-os-ef98e.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "852411621941",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:852411621941:web:1cdb0baa1abd1a942e877c",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-9R8G49R4YX"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Test connection
console.log('Firebase initialized:', {
  app: !!app,
  auth: !!auth,
  db: !!db
});

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;