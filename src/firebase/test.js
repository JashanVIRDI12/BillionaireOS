// Simple Firebase connection test
import { auth, db } from './config';

export const testFirebaseConnection = () => {
  console.log('Testing Firebase connection...');
  
  // Test auth
  console.log('Auth object:', auth);
  console.log('Auth app:', auth.app);
  console.log('Auth config:', auth.config);
  
  // Test firestore
  console.log('Firestore object:', db);
  console.log('Firestore app:', db.app);
  
  return {
    auth: !!auth,
    db: !!db,
    authApp: !!auth?.app,
    dbApp: !!db?.app
  };
};