import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase.js';

const CLIENTS_COLLECTION = 'clients';

// Get all client reviews
export const getClientReviews = async () => {
  try {
    const q = query(collection(db, CLIENTS_COLLECTION), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return reviews;
  } catch (error) {
    console.error('Error fetching client reviews:', error);
    throw error;
  }
};

// Get a single client review by ID
export const getClientReview = async (reviewId) => {
  try {
    const docRef = doc(db, CLIENTS_COLLECTION, reviewId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      throw new Error('Client review not found');
    }
  } catch (error) {
    console.error('Error fetching client review:', error);
    throw error;
  }
};

// Add a new client review
export const addClientReview = async (reviewData) => {
  try {
    const docRef = await addDoc(collection(db, CLIENTS_COLLECTION), reviewData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding client review:', error);
    throw error;
  }
};

// Update a client review
export const updateClientReview = async (reviewId, reviewData) => {
  try {
    const docRef = doc(db, CLIENTS_COLLECTION, reviewId);
    await updateDoc(docRef, reviewData);
    return reviewId;
  } catch (error) {
    console.error('Error updating client review:', error);
    throw error;
  }
};

// Delete a client review
export const deleteClientReview = async (reviewId) => {
  try {
    await deleteDoc(doc(db, CLIENTS_COLLECTION, reviewId));
    return reviewId;
  } catch (error) {
    console.error('Error deleting client review:', error);
    throw error;
  }
};
