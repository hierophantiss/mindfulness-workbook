// js/firebase-service.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Auth Functions
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logout() {
  return signOut(auth);
}

// User Profile Functions
export async function syncUserProfile(stats) {
  if (!auth.currentUser) return;
  const path = `users/${auth.currentUser.uid}`;
  try {
    await setDoc(doc(db, path), {
      ...stats,
      uid: auth.currentUser.uid,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserProfile() {
  if (!auth.currentUser) return null;
  const path = `users/${auth.currentUser.uid}`;
  try {
    const snap = await getDoc(doc(db, path));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Journal Functions
export async function saveJournalEntry(entry) {
  if (!auth.currentUser) return;
  const entryId = entry.date || new Date().toISOString().split('T')[0];
  const path = `users/${auth.currentUser.uid}/journal/${entryId}`;
  try {
    await setDoc(doc(db, path), {
      ...entry,
      uid: auth.currentUser.uid,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getJournalEntries() {
  if (!auth.currentUser) return [];
  const path = `users/${auth.currentUser.uid}/journal`;
  try {
    const q = query(collection(db, path), where('uid', '==', auth.currentUser.uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Mood Functions
export async function saveMood(val) {
  if (!auth.currentUser) return;
  const date = new Date().toDateString(); // Consistent with existing logic
  const moodId = date.replace(/\s/g, '_');
  const path = `users/${auth.currentUser.uid}/moods/${moodId}`;
  try {
    await setDoc(doc(db, path), {
      uid: auth.currentUser.uid,
      date,
      val,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Real-time listener for current user
export function listenToUserProfile(callback) {
  if (!auth.currentUser) return () => {};
  const path = `users/${auth.currentUser.uid}`;
  return onSnapshot(doc(db, path), (snap) => {
    if (snap.exists()) callback(snap.data());
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}

// Expose to window for app.js sync
window.firebaseService = {
  loginWithGoogle,
  logout,
  syncUserProfile,
  getUserProfile,
  saveJournalEntry,
  getJournalEntries,
  saveMood,
  listenToUserProfile,
  auth,
  db
};
