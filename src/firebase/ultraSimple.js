import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, deleteField } from 'firebase/firestore';
import { db } from './config';

// Ultra-simple functions without any complex queries
export const addUltraSimpleAsset = async (userId, amount, note) => {
  try {
    console.log('Adding ultra simple asset:', { userId, amount, note });
    
    const docRef = await addDoc(collection(db, 'assets'), {
      amount: Number(amount),
      note: note || '',
      userId: userId,
      type: 'asset',
      created: new Date().toISOString()
    });
    
    console.log('Ultra simple asset added with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Ultra simple add asset error:', error);
    return { success: false, error: error.message };
  }
};

export const addUltraSimpleLiability = async (userId, amount, note) => {
  try {
    console.log('Adding ultra simple liability:', { userId, amount, note });
    
    const docRef = await addDoc(collection(db, 'liabilities'), {
      amount: Number(amount),
      note: note || '',
      userId: userId,
      type: 'liability',
      created: new Date().toISOString()
    });
    
    console.log('Ultra simple liability added with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Ultra simple add liability error:', error);
    return { success: false, error: error.message };
  }
};

// Simple get functions with basic queries
export const getUltraSimpleAssets = async (userId) => {
  try {
    console.log('Getting ultra simple assets for user:', userId);
    
    const q = query(collection(db, 'assets'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const assets = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      assets.push({ 
        id: doc.id, 
        amount: data.amount,
        note: data.note,
        created: data.created
      });
    });
    
    console.log('Ultra simple assets retrieved:', assets);
    return { success: true, assets };
  } catch (error) {
    console.error('Ultra simple get assets error:', error);
    return { success: false, error: error.message };
  }
};

export const getUltraSimpleLiabilities = async (userId) => {
  try {
    console.log('Getting ultra simple liabilities for user:', userId);
    
    const q = query(collection(db, 'liabilities'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const liabilities = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      liabilities.push({ 
        id: doc.id, 
        amount: data.amount,
        note: data.note,
        created: data.created
      });
    });
    
    console.log('Ultra simple liabilities retrieved:', liabilities);
    return { success: true, liabilities };
  } catch (error) {
    console.error('Ultra simple get liabilities error:', error);
    return { success: false, error: error.message };
  }
};
// Update functions
export const updateUltraSimpleAsset = async (assetId, amount, note) => {
  try {
    console.log('Updating ultra simple asset:', { assetId, amount, note });
    
    const assetRef = doc(db, 'assets', assetId);
    await updateDoc(assetRef, {
      amount: Number(amount),
      note: note || '',
      updated: new Date().toISOString()
    });
    
    console.log('Ultra simple asset updated:', assetId);
    return { success: true };
  } catch (error) {
    console.error('Ultra simple update asset error:', error);
    return { success: false, error: error.message };
  }
};

export const updateUltraSimpleLiability = async (liabilityId, amount, note) => {
  try {
    console.log('Updating ultra simple liability:', { liabilityId, amount, note });
    
    const liabilityRef = doc(db, 'liabilities', liabilityId);
    await updateDoc(liabilityRef, {
      amount: Number(amount),
      note: note || '',
      updated: new Date().toISOString()
    });
    
    console.log('Ultra simple liability updated:', liabilityId);
    return { success: true };
  } catch (error) {
    console.error('Ultra simple update liability error:', error);
    return { success: false, error: error.message };
  }
};

// Delete functions
export const deleteUltraSimpleAsset = async (assetId) => {
  try {
    console.log('Deleting ultra simple asset:', assetId);
    
    const assetRef = doc(db, 'assets', assetId);
    await deleteDoc(assetRef);
    
    console.log('Ultra simple asset deleted:', assetId);
    return { success: true };
  } catch (error) {
    console.error('Ultra simple delete asset error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteUltraSimpleLiability = async (liabilityId) => {
  try {
    console.log('Deleting ultra simple liability:', liabilityId);
    
    const liabilityRef = doc(db, 'liabilities', liabilityId);
    await deleteDoc(liabilityRef);
    
    console.log('Ultra simple liability deleted:', liabilityId);
    return { success: true };
  } catch (error) {
    console.error('Ultra simple delete liability error:', error);
    return { success: false, error: error.message };
  }
};

// Journal functions
export const addJournalEntry = async (userId, entry) => {
  try {
    console.log('Adding journal entry:', { userId, entry });
    
    const docRef = await addDoc(collection(db, 'journal'), {
      ...entry,
      userId: userId,
      created: new Date().toISOString()
    });
    
    console.log('Journal entry added with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Add journal entry error:', error);
    return { success: false, error: error.message };
  }
};

export const getJournalEntries = async (userId) => {
  try {
    console.log('Getting journal entries for user:', userId);
    
    const q = query(
      collection(db, 'journal'), 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    const entries = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      entries.push({ 
        id: doc.id, 
        ...data
      });
    });
    
    // Sort by date descending
    entries.sort((a, b) => new Date(b.created) - new Date(a.created));
    
    console.log('Journal entries retrieved:', entries);
    return { success: true, entries };
  } catch (error) {
    console.error('Get journal entries error:', error);
    return { success: false, error: error.message };
  }
};

export const updateJournalEntry = async (entryId, updates) => {
  try {
    console.log('Updating journal entry:', { entryId, updates });
    
    const entryRef = doc(db, 'journal', entryId);
    await updateDoc(entryRef, {
      ...updates,
      updated: new Date().toISOString()
    });
    
    console.log('Journal entry updated:', entryId);
    return { success: true };
  } catch (error) {
    console.error('Update journal entry error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteJournalEntry = async (entryId) => {
  try {
    console.log('Deleting journal entry:', entryId);
    
    const entryRef = doc(db, 'journal', entryId);
    await deleteDoc(entryRef);
    
    console.log('Journal entry deleted:', entryId);
    return { success: true };
  } catch (error) {
    console.error('Delete journal entry error:', error);
    return { success: false, error: error.message };
  }
};

// North Star goal functions
export const saveNorthStarGoal = async (userId, goal) => {
  try {
    console.log('Saving north star goal:', { userId, goal });
    
    const docRef = await addDoc(collection(db, 'northstar'), {
      goal: goal,
      userId: userId,
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    });
    
    console.log('North star goal saved with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Save north star goal error:', error);
    return { success: false, error: error.message };
  }
};

export const getNorthStarGoal = async (userId) => {
  try {
    console.log('Getting north star goal for user:', userId);
    
    const q = query(
      collection(db, 'northstar'), 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    let goal = null;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!goal || new Date(data.updated) > new Date(goal.updated)) {
        goal = { id: doc.id, ...data };
      }
    });
    
    console.log('North star goal retrieved:', goal);
    return { success: true, goal: goal?.goal || '' };
  } catch (error) {
    console.error('Get north star goal error:', error);
    return { success: false, error: error.message };
  }
};

// Habits functions
export const addHabit = async (userId, habitName) => {
  try {
    console.log('Adding habit:', { userId, habitName });
    
    const docRef = await addDoc(collection(db, 'habits'), {
      name: habitName,
      userId: userId,
      completedDays: {},
      created: new Date().toISOString()
    });
    
    console.log('Habit added with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Add habit error:', error);
    return { success: false, error: error.message };
  }
};

export const getHabits = async (userId) => {
  try {
    console.log('Getting habits for user:', userId);
    
    const q = query(
      collection(db, 'habits'), 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    const habits = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      habits.push({ 
        id: doc.id, 
        name: data.name,
        completedDays: data.completedDays || {},
        created: data.created
      });
    });
    
    // Sort by creation date
    habits.sort((a, b) => new Date(a.created) - new Date(b.created));
    
    console.log('Habits retrieved:', habits);
    return { success: true, habits };
  } catch (error) {
    console.error('Get habits error:', error);
    return { success: false, error: error.message };
  }
};

export const updateHabit = async (habitId, updates) => {
  try {
    console.log('Updating habit:', { habitId, updates });
    
    const habitRef = doc(db, 'habits', habitId);
    await updateDoc(habitRef, {
      ...updates,
      updated: new Date().toISOString()
    });
    
    console.log('Habit updated:', habitId);
    return { success: true };
  } catch (error) {
    console.error('Update habit error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteHabit = async (habitId) => {
  try {
    console.log('Deleting habit:', habitId);
    
    const habitRef = doc(db, 'habits', habitId);
    await deleteDoc(habitRef);
    
    console.log('Habit deleted:', habitId);
    return { success: true };
  } catch (error) {
    console.error('Delete habit error:', error);
    return { success: false, error: error.message };
  }
};

export const toggleHabitCompletion = async (habitId, date, isCompleted) => {
  try {
    console.log('Toggling habit completion:', { habitId, date, isCompleted });
    
    const habitRef = doc(db, 'habits', habitId);
    
    if (isCompleted) {
      // Add the date to completedDays
      await updateDoc(habitRef, {
        [`completedDays.${date}`]: true,
        updated: new Date().toISOString()
      });
    } else {
      // Remove the date from completedDays
      await updateDoc(habitRef, {
        [`completedDays.${date}`]: deleteField(),
        updated: new Date().toISOString()
      });
    }
    
    console.log('Habit completion toggled:', habitId);
    return { success: true };
  } catch (error) {
    console.error('Toggle habit completion error:', error);
    return { success: false, error: error.message };
  }
};