import { AppState } from '../types';

const STORAGE_KEY = 'focus1_app_data';

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

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return INITIAL_STATE;
    return JSON.parse(serialized);
  } catch (e) {
    console.error('Failed to load state', e);
    return INITIAL_STATE;
  }
};

export const saveState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state', e);
  }
};