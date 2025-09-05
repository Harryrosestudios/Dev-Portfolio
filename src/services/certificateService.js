import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase.js';

const CERTIFICATES_COLLECTION = 'certificates';

// Get all certificates
export const getCertificates = async () => {
  try {
    // First try to fetch with date ordering, fallback to no ordering if it fails
    let querySnapshot;
    try {
      const q = query(collection(db, CERTIFICATES_COLLECTION), orderBy('date', 'desc'));
      querySnapshot = await getDocs(q);
    } catch (orderError) {
      // If ordering fails, just get all documents without ordering
      console.warn('Ordering failed, fetching certificates without ordering:', orderError);
      querySnapshot = await getDocs(collection(db, CERTIFICATES_COLLECTION));
    }
    
    const certificates = [];
    querySnapshot.forEach((doc) => {
      certificates.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    // Sort by date in JavaScript as fallback
    certificates.sort((a, b) => {
      const yearA = parseInt(a.date) || 0;
      const yearB = parseInt(b.date) || 0;
      return yearB - yearA; // Descending order (newest first)
    });
    
    return certificates;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw error;
  }
};

// Get a single certificate by ID
export const getCertificate = async (certificateId) => {
  try {
    const docRef = doc(db, CERTIFICATES_COLLECTION, certificateId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      throw new Error('Certificate not found');
    }
  } catch (error) {
    console.error('Error fetching certificate:', error);
    throw error;
  }
};

// Add a new certificate
export const addCertificate = async (certificateData) => {
  try {
    const docRef = await addDoc(collection(db, CERTIFICATES_COLLECTION), certificateData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding certificate:', error);
    throw error;
  }
};

// Update a certificate
export const updateCertificate = async (certificateId, certificateData) => {
  try {
    const docRef = doc(db, CERTIFICATES_COLLECTION, certificateId);
    await updateDoc(docRef, certificateData);
    return certificateId;
  } catch (error) {
    console.error('Error updating certificate:', error);
    throw error;
  }
};

// Delete a certificate
export const deleteCertificate = async (certificateId) => {
  try {
    await deleteDoc(doc(db, CERTIFICATES_COLLECTION, certificateId));
    return certificateId;
  } catch (error) {
    console.error('Error deleting certificate:', error);
    throw error;
  }
};
