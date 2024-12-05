import { openDB } from 'idb';
import axios from 'axios';
import _ from 'lodash';

// Get the backend URL from environment variables
const BACKEND_URL = process.env.REACT_APP_API_URL;
console.log('Backend URL:', BACKEND_URL);
console.log('All env vars:', process.env);

// Initialize IndexedDB
const initDB = async () => {
  return openDB('aest-util-store', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('redux-store')) {
        db.createObjectStore('redux-store');
      }
    },
  });
};

// Load the persisted state
export const loadPersistedState = async () => {
  try {
    // First try to load from IndexedDB
    const db = await initDB();
    const state = await db.get('redux-store', 'latest');
    
    if (state) {
      // Initialize auth state as empty since it's managed separately
      return {
        ...state,
        auth: {
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
          totpRequired: false
        }
      };
    }
    
    // Only try to fetch from backend if token exists
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/load-state`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data && response.data.state) {
          // Save the fetched state to IndexedDB
          await db.put('redux-store', response.data.state, 'latest');
          // Initialize auth state as empty since it's managed separately
          return {
            ...response.data.state,
            auth: {
              user: null,
              isAuthenticated: false,
              loading: false,
              error: null,
              totpRequired: false
            }
          };
        }
      } catch (error) {
        console.error('Failed to load state from backend:', error);
      }
    }
    
    return undefined;
  } catch (error) {
    console.error('Failed to load persisted state:', error);
    return undefined;
  }
};

// Create the persistence middleware
export const createPersistMiddleware = () => {
  let db;
  let syncTimeout;
  let syncInProgress = false;
  let lastSyncedState = null;

  // Initialize the database
  initDB().then((database) => {
    db = database;
  });

  // Debounce sync function
  const debouncedSync = _.debounce(async (state, token) => {
    if (syncInProgress) return;
    syncInProgress = true;
    
    try {
      await axios.post(`${BACKEND_URL}/api/sync-state`, {
        state
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Failed to sync with backend:', error);
    } finally {
      syncInProgress = false;
    }
  }, 2000);

  return store => next => async action => {
    // First, dispatch the action
    const result = next(action);
    
    // Get the new state
    const state = store.getState();
    
    // Skip persistence for certain action types
    if (
      action.type.startsWith('@@redux') || 
      action.type.includes('persist') ||
      action.type.includes('command/setCommand') || // Skip command updates
      action.type.includes('command/addToHistory') // Skip history updates
    ) {
      return result;
    }
    
    // Create a new state object without auth data and command history for persistence
    const stateToSync = {
      ...state,
      auth: undefined, // Exclude auth data
      command: {
        ...state.command,
        history: [], // Don't persist command history
      }
    };
    
    // Only persist if state has actually changed
    if (_.isEqual(stateToSync, lastSyncedState)) {
      return result;
    }
    
    try {
      // Save to IndexedDB immediately but only if state changed
      if (db) {
        await db.put('redux-store', stateToSync, 'latest');
        lastSyncedState = stateToSync;
      }
      
      // Only sync with backend if token exists
      const token = localStorage.getItem('token');
      if (token) {
        debouncedSync(stateToSync, token);
      }
    } catch (error) {
      console.error('Failed to persist state:', error);
    }
    
    return result;
  };
};
