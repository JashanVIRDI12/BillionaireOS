import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  setDoc,
  query, 
  where, 
  orderBy
} from 'firebase/firestore';
import { db } from './config';

// Assets functions
export const addAsset = async (userId, asset) => {
  try {
    console.log('addAsset called with:', { userId, asset });
    console.log('Database object:', db);
    
    const docRef = await addDoc(collection(db, 'assets'), {
      ...asset,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Asset added successfully with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Add asset error:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
};

export const getUserAssets = async (userId) => {
  try {
    const q = query(
      collection(db, 'assets'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const assets = [];
    querySnapshot.forEach((doc) => {
      assets.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, assets };
  } catch (error) {
    console.error('Get assets error:', error);
    return { success: false, error: error.message };
  }
};

export const updateAsset = async (assetId, updates) => {
  try {
    const assetRef = doc(db, 'assets', assetId);
    await updateDoc(assetRef, {
      ...updates,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Update asset error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteAsset = async (assetId) => {
  try {
    await deleteDoc(doc(db, 'assets', assetId));
    return { success: true };
  } catch (error) {
    console.error('Delete asset error:', error);
    return { success: false, error: error.message };
  }
};

// Liabilities functions
export const addLiability = async (userId, liability) => {
  try {
    console.log('addLiability called with:', { userId, liability });
    console.log('Database object:', db);
    
    const docRef = await addDoc(collection(db, 'liabilities'), {
      ...liability,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Liability added successfully with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Add liability error:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
};

export const getUserLiabilities = async (userId) => {
  try {
    const q = query(
      collection(db, 'liabilities'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const liabilities = [];
    querySnapshot.forEach((doc) => {
      liabilities.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, liabilities };
  } catch (error) {
    console.error('Get liabilities error:', error);
    return { success: false, error: error.message };
  }
};

export const updateLiability = async (liabilityId, updates) => {
  try {
    const liabilityRef = doc(db, 'liabilities', liabilityId);
    await updateDoc(liabilityRef, {
      ...updates,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Update liability error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteLiability = async (liabilityId) => {
  try {
    await deleteDoc(doc(db, 'liabilities', liabilityId));
    return { success: true };
  } catch (error) {
    console.error('Delete liability error:', error);
    return { success: false, error: error.message };
  }
};

// User settings functions
export const saveUserSettings = async (userId, settings) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...settings,
      updatedAt: new Date()
    }, { merge: true }); // merge: true will update existing fields or create new document
    return { success: true };
  } catch (error) {
    console.error('Save settings error:', error);
    return { success: false, error: error.message };
  }
};

export const getUserSettings = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return { success: true, settings: docSnap.data() };
    } else {
      return { success: true, settings: null };
    }
  } catch (error) {
    console.error('Get settings error:', error);
    return { success: false, error: error.message };
  }
};

// Real-time listeners (commented out to fix assertion errors)
// export const subscribeToUserAssets = (userId, callback) => {
//   const q = query(
//     collection(db, 'assets'), 
//     where('userId', '==', userId),
//     orderBy('createdAt', 'desc')
//   );
  
//   return onSnapshot(q, (querySnapshot) => {
//     const assets = [];
//     querySnapshot.forEach((doc) => {
//       assets.push({ id: doc.id, ...doc.data() });
//     });
//     callback(assets);
//   });
// };

// export const subscribeToUserLiabilities = (userId, callback) => {
//   const q = query(
//     collection(db, 'liabilities'), 
//     where('userId', '==', userId),
//     orderBy('createdAt', 'desc')
//   );
  
//   return onSnapshot(q, (querySnapshot) => {
//     const liabilities = [];
//     querySnapshot.forEach((doc) => {
//       liabilities.push({ id: doc.id, ...doc.data() });
//     });
//     callback(liabilities);
//   });
// };