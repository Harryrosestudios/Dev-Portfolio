import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase.js';

const EXPERIENCE_COLLECTION = 'experience';

// Get all work experiences
export const getWorkExperiences = async () => {
  try {
    const q = query(collection(db, EXPERIENCE_COLLECTION), orderBy('order', 'desc')); // Most recent first
    const querySnapshot = await getDocs(q);
    const experiences = [];
    querySnapshot.forEach((doc) => {
      experiences.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return experiences;
  } catch (error) {
    console.error('Error fetching work experiences:', error);
    throw error;
  }
};

// Get a single work experience by ID
export const getWorkExperience = async (experienceId) => {
  try {
    const docRef = doc(db, EXPERIENCE_COLLECTION, experienceId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      throw new Error('Work experience not found');
    }
  } catch (error) {
    console.error('Error fetching work experience:', error);
    throw error;
  }
};

// Add a new work experience
export const addWorkExperience = async (experienceData) => {
  try {
    const docRef = await addDoc(collection(db, EXPERIENCE_COLLECTION), experienceData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding work experience:', error);
    throw error;
  }
};

// Update a work experience
export const updateWorkExperience = async (experienceId, experienceData) => {
  try {
    const docRef = doc(db, EXPERIENCE_COLLECTION, experienceId);
    await updateDoc(docRef, experienceData);
    return experienceId;
  } catch (error) {
    console.error('Error updating work experience:', error);
    throw error;
  }
};

// Delete a work experience
export const deleteWorkExperience = async (experienceId) => {
  try {
    await deleteDoc(doc(db, EXPERIENCE_COLLECTION, experienceId));
    return experienceId;
  } catch (error) {
    console.error('Error deleting work experience:', error);
    throw error;
  }
};
