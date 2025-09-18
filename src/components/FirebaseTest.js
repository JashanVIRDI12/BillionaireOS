import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/config';

const FirebaseTest = () => {
  const [status, setStatus] = useState('Ready to test');
  const [error, setError] = useState(null);

  const testGoogleAuth = async () => {
    setStatus('Testing Google Auth...');
    setError(null);
    
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      console.log('Auth object:', auth);
      console.log('Provider:', provider);
      
      const result = await signInWithPopup(auth, provider);
      console.log('Success:', result);
      
      setStatus(`Success! Signed in as: ${result.user.email}`);
    } catch (error) {
      console.error('Test error:', error);
      setError({
        code: error.code,
        message: error.message,
        customData: error.customData
      });
      setStatus('Test failed');
    }
  };

  return (
    <div className="p-6 bg-white border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Firebase Authentication Test</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Status: {status}</p>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm font-medium text-red-800">Error Code: {error.code}</p>
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
        )}
        
        <button
          onClick={testGoogleAuth}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Google Sign In
        </button>
      </div>
    </div>
  );
};

export default FirebaseTest;