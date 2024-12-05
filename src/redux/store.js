import { configureStore, combineReducers } from '@reduxjs/toolkit';
import commandReducer from './commandSlice';
import typingReducer from './typingSlice';
import authReducer, { selectFreshState, setFreshState } from './authSlice';
import { createPersistMiddleware, loadPersistedState } from './persistMiddleware';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Create auth state middleware
const authStateMiddleware = store => next => action => {
  const result = next(action);
  
  // If login successful, fetch fresh state
  if (action.type === 'auth/login/fulfilled') {
    // Don't block the UI, load state asynchronously
    setTimeout(() => {
      axios.get(`${API_URL}/api/load-state`)
        .then(response => {
          if (response.data?.state) {
            // Load state in chunks to prevent UI freeze
            const state = response.data.state;
            Object.keys(state).forEach((key, index) => {
              setTimeout(() => {
                store.dispatch(setFreshState({ [key]: state[key] }));
              }, index * 100); // Stagger updates
            });
          }
        })
        .catch(error => {
          console.error('Failed to load state after login:', error);
        });
    }, 0);
  }
  
  return result;
};

// Create fresh state middleware with batched updates
const freshStateMiddleware = store => next => action => {
  // Prevent recursive dispatches
  if (action.type === 'auth/clearFreshState') {
    return next(action);
  }

  const result = next(action);
  const state = store.getState();
  const freshState = selectFreshState(state);
  
  if (freshState) {
    // Clear fresh state first to prevent recursion
    store.dispatch({ type: 'auth/clearFreshState' });
    
    // Update each slice individually without causing recursion
    Object.entries(freshState).forEach(([key, value]) => {
      if (key !== 'auth' && store.getState()[key]) {
        next({
          type: `${key}/updateState`,
          payload: value
        });
      }
    });
  }
  
  return result;
};

// Initialize store with persisted state
const initializeStore = async () => {
  try {
    const preloadedState = await Promise.race([
      loadPersistedState(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Store initialization timeout')), 2000)
      )
    ]);
    
    const persistMiddleware = createPersistMiddleware();

    // Create the root reducer
    const rootReducer = combineReducers({
      command: commandReducer,
      user: typingReducer,
      auth: authReducer,
    });

    // Create store with optimizations
    return configureStore({
      reducer: rootReducer,
      preloadedState: preloadedState || undefined,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: process.env.NODE_ENV === 'development',
          immutableCheck: process.env.NODE_ENV === 'development',
        }).concat(
          persistMiddleware,
          authStateMiddleware,
          freshStateMiddleware
        ),
      devTools: process.env.NODE_ENV === 'development',
    });
  } catch (error) {
    console.error('Failed to initialize store:', error);
    
    // Return store with default state if loading fails
    const rootReducer = combineReducers({
      command: commandReducer,
      user: typingReducer,
      auth: authReducer,
    });

    return configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: process.env.NODE_ENV === 'development',
          immutableCheck: process.env.NODE_ENV === 'development',
        }).concat(
          createPersistMiddleware(),
          authStateMiddleware,
          freshStateMiddleware
        ),
      devTools: process.env.NODE_ENV === 'development',
    });
  }
};

// Export a promise that resolves to the store
export const storePromise = initializeStore();

// For components that need the store immediately
export let store;
storePromise.then((initializedStore) => {
  store = initializedStore;
}).catch(error => {
  console.error('Store initialization error:', error);
});

export default store;
