import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase.js';

const ABOUT_COLLECTION = 'about';

// Get about data
export const getAboutData = async () => {
  try {
    const docRef = doc(db, ABOUT_COLLECTION, 'main');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('About data not found');
    }
  } catch (error) {
    console.error('Error fetching about data:', error);
    throw error;
  }
};

// Update about data
export const updateAboutData = async (aboutData) => {
  try {
    const docRef = doc(db, ABOUT_COLLECTION, 'main');
    await updateDoc(docRef, {
      ...aboutData,
      updatedAt: new Date(),
    });
    return 'main';
  } catch (error) {
    console.error('Error updating about data:', error);
    throw error;
  }
};

// Create initial about data
export const createAboutData = async (aboutData) => {
  try {
    const docRef = doc(db, ABOUT_COLLECTION, 'main');
    await setDoc(docRef, {
      ...aboutData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return 'main';
  } catch (error) {
    console.error('Error creating about data:', error);
    throw error;
  }
};
