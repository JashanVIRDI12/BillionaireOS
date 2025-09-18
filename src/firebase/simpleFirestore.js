import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';

// Simple asset functions without complex queries
export const addSimpleAsset = async (userId, asset) => {
  try {
    console.log('Adding simple asset:', { userId, asset });
    
    const docRef = await addDoc(collection(db, 'assets'), {
      amount: asset.amount,
      note: asset.note || '',
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log('Simple asset added with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Simple add asset error:', error);
    return { success: false, error: error.message };
  }
};

export const addSimpleLiability = async (userId, liability) => {
  try {
    console.log('Adding simple liability:', { userId, liability });
    
    const docRef = await addDoc(collection(db, 'liabilities'), {
      amount: liability.amount,
      note: liability.note || '',
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log('Simple liability added with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Simple add liability error:', error);
    return { success: false, error: error.message };
  }
};

export const getSimpleAssets = async (userId) => {
  try {
    console.log('Getting simple assets for user:', userId);
    
    const q = query(collection(db, 'assets'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const assets = [];
    querySnapshot.forEach((doc) => {
      assets.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('Simple assets retrieved:', assets);
    return { success: true, assets };
  } catch (error) {
    console.error('Simple get assets error:', error);
    return { success: false, error: error.message };
  }
};

export const getSimpleLiabilities = async (userId) => {
  try {
    console.log('Getting simple liabilities for user:', userId);
    
    const q = query(collection(db, 'liabilities'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const liabilities = [];
    querySnapshot.forEach((doc) => {
      liabilities.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('Simple liabilities retrieved:', liabilities);
    return { success: true, liabilities };
  } catch (error) {
    console.error('Simple get liabilities error:', error);
    return { success: false, error: error.message };
  }
};