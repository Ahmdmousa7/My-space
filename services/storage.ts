import { AppState } from '../types';
import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

// For this MVP, we use a single shared document.
// In a real app with Auth, this would be `users/${userId}`.
const DOC_REF = doc(db, 'workspaces', 'default');

const INITIAL_STATE: AppState = {
  tasks: [
    { id: '1', title: 'Review Q3 goals', completed: false, priority: 'high', createdAt: Date.now(), color: 'red' },
    { id: '2', title: 'Email marketing team', completed: true, priority: 'medium', createdAt: Date.now() - 100000, color: 'blue' },
  ],
  links: [
    { id: '1', title: 'Gemini API Docs', url: 'https://ai.google.dev', category: 'Dev', createdAt: Date.now() },
  ],
  sheets: [
    { id: '1', title: 'Project Budget', url: 'https://docs.google.com/spreadsheets', lastOpened: Date.now() },
  ],
  notes: [
    { id: '1', content: 'Remember to drink water!', color: 'blue', x: 0, y: 0, createdAt: Date.now() },
    { id: '2', content: 'Meeting notes:\n- Discuss new timeline\n- Approve budget', color: 'yellow', x: 0, y: 0, createdAt: Date.now() },
  ],
};

// Original loadState is deprecated in favor of subscription
export const loadState = (): AppState => {
  return INITIAL_STATE;
};

export const subscribeToState = (callback: (data: AppState) => void) => {
  return onSnapshot(DOC_REF, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as AppState);
    } else {
      // If doc doesn't exist, create it with initial state
      setDoc(DOC_REF, INITIAL_STATE);
      callback(INITIAL_STATE);
    }
  }, (error) => {
    console.error("Error subscribing to state:", error);
  });
};

export const saveState = async (state: AppState) => {
  try {
    const stateToSave = { ...state, lastUpdated: Date.now() };
    // Ensure no undefined values are sent to Firestore (it rejects them)
    const cleanState = JSON.parse(JSON.stringify(stateToSave));
    await setDoc(DOC_REF, cleanState);
  } catch (e) {
    console.error('Failed to save state to Firestore', e);
  }
};