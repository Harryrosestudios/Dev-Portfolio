import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase.js';

const LEGAL_COLLECTION = 'legal';

// Get legal document (terms or privacy)
export const getLegalDocument = async (docType) => {
  try {
    const docRef = doc(db, LEGAL_COLLECTION, docType);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error(`${docType} document not found`);
    }
  } catch (error) {
    console.error(`Error fetching ${docType} document:`, error);
    throw error;
  }
};

// Update legal document
export const updateLegalDocument = async (docType, documentData) => {
  try {
    const docRef = doc(db, LEGAL_COLLECTION, docType);
    await updateDoc(docRef, {
      ...documentData,
      updatedAt: new Date(),
    });
    return docType;
  } catch (error) {
    console.error(`Error updating ${docType} document:`, error);
    throw error;
  }
};

// Create initial legal document
export const createLegalDocument = async (docType, documentData) => {
  try {
    const docRef = doc(db, LEGAL_COLLECTION, docType);
    await setDoc(docRef, {
      ...documentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docType;
  } catch (error) {
    console.error(`Error creating ${docType} document:`, error);
    throw error;
  }
};

// Convenience functions
export const getTermsOfService = () => getLegalDocument('terms');
export const getPrivacyPolicy = () => getLegalDocument('privacy');
export const updateTermsOfService = (data) => updateLegalDocument('terms', data);
export const updatePrivacyPolicy = (data) => updateLegalDocument('privacy', data);
export const createTermsOfService = (data) => createLegalDocument('terms', data);
export const createPrivacyPolicy = (data) => createLegalDocument('privacy', data);
