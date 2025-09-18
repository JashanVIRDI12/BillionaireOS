import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

const FirestoreTest = () => {
  const [status, setStatus] = useState('Ready to test');
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const testFirestore = async () => {
    setStatus('Testing Firestore...');
    setError(null);
    
    if (!user) {
      setError('No user logged in');
      setStatus('Failed');
      return;
    }

    try {
      // Simple test - just try to write one document
      console.log('Testing simple Firestore write...');
      console.log('User ID:', user.uid);
      console.log('Database object:', db);
      
      const docRef = await addDoc(collection(db, 'test'), {
        message: 'Hello Firestore!',
        userId: user.uid,
        timestamp: new Date().toISOString()
      });
      
      console.log('Document written with ID: ', docRef.id);
      setStatus(`Success! Added document with ID: ${docRef.id}`);
    } catch (error) {
      console.error('Firestore test error:', error);
      setError({
        code: error.code || 'unknown',
        message: error.message || 'Unknown error'
      });
      setStatus('Test failed');
    }
  };

  return (
    <div className="p-6 bg-white border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Firestore Test</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Status: {status}</p>
          <p className="text-sm text-gray-600">User: {user ? user.uid : 'Not logged in'}</p>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm font-medium text-red-800">Error Code: {error.code}</p>
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
        )}
        
        <button
          onClick={testFirestore}
          disabled={!user}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300"
        >
          Test Firestore
        </button>
      </div>
    </div>
  );
};

export default FirestoreTest;