import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase.js';

const RESUME_COLLECTION = 'resume';

// Get resume data
export const getResumeData = async () => {
  try {
    const docRef = doc(db, RESUME_COLLECTION, 'main');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('Resume data not found');
    }
  } catch (error) {
    console.error('Error fetching resume data:', error);
    throw error;
  }
};

// Update resume data
export const updateResumeData = async (resumeData) => {
  try {
    const docRef = doc(db, RESUME_COLLECTION, 'main');
    await updateDoc(docRef, {
      ...resumeData,
      updatedAt: new Date(),
    });
    return 'main';
  } catch (error) {
    console.error('Error updating resume data:', error);
    throw error;
  }
};

// Create initial resume data
export const createResumeData = async (resumeData) => {
  try {
    const docRef = doc(db, RESUME_COLLECTION, 'main');
    await setDoc(docRef, {
      ...resumeData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return 'main';
  } catch (error) {
    console.error('Error creating resume data:', error);
    throw error;
  }
};
