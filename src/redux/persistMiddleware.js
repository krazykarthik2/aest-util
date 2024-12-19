import { openDB } from "idb";
import axios from "axios";
import _ from "lodash";
import { checkAuth, initFromToken, loadAuthFromToken } from "./authSlice";
import { useDispatch } from "react-redux";
import { getBackendUrl } from "../util/jsutil";

const BACKEND_URL = getBackendUrl();
const DB_NAME = "aest-util-store";
const STORE_NAME = "redux-store";

// Initialize IndexedDB
const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

// Load the persisted state
export const loadPersistedState = async (__token) => {
  console.log("Loading persisted state...");

  try {
    const db = await initDB();
    let state = null;
    // If authenticated, try to load from backend first
    let token;
    if (__token) {
      token = __token;
    } else {
      token = localStorage.getItem("token");
    }
    if (token) {
      try {
        state = {
          ...state,
          auth: await loadAuthFromToken(null, {
            rejectWithValue: (...params) => {
              console.log("rejected with", params);
            },
          }),
        };
        console.log("Fetching state from backend...");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get(`${BACKEND_URL}/api/load-state`);
        if (response.data?.state) {
          state={...state,...response.data.state}
          // Save backend state to IndexedDB
          await db.put(STORE_NAME, state, "latest");
          console.log(state);
          console.log("Saved backend state to IndexedDB");
        }
      } catch (error) {
        console.error("Failed to load state from backend:", error);
      }
    }

    // If no state from backend, try IndexedDB
    if (!state) {
      state = await db.get(STORE_NAME, "latest");
      console.log(
        "Loaded state from IndexedDB:",
        state ? "found" : "not found"
      );
    }

    // Return state without auth data
    return state;
  } catch (error) {
    console.error("Failed to load persisted state:", error);
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

  // Function to sync state with backend
  const syncWithBackend = async (state) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.post(
        `${BACKEND_URL}/api/sync-state`,
        { state },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("State synced with backend");
    } catch (error) {
      console.error("Failed to sync state with backend:", error);
    } finally {
      syncInProgress = false;
    }
  };

  // Debounced sync function
  const debouncedSync = _.debounce(async (state) => {
    if (syncInProgress) return;
    syncInProgress = true;
    await syncWithBackend(state);
  }, 1000);

  return (store) => (next) => (action) => {
    // First, dispatch the action
    const result = next(action);

    // Get the new state
    const state = store.getState();

    // Skip persistence for certain actions
    if (
      action.type.startsWith("@@redux") ||
      action.type.startsWith("auth/") ||
      action.type.includes("persist") ||
      action.type.includes("command/addToHistory") ||
      action.type.includes("/silentUpdateState")
    ) {
      return result;
    }

    console.log("action-type:", action.type);
    // Create a state object for persistence (excluding auth and temporary data)
    const stateToSync = {
      ...state,
      auth: undefined,
      command: {
        ...state.command,
        history: [], // Don't persist command history
      },
    };

    // Only persist if state has actually changed
    if (_.isEqual(stateToSync, lastSyncedState)) {
      return result;
    }

    // Update local storage immediately
    if (db) {
      db.put(STORE_NAME, stateToSync, "latest")
        .then(() => {
          console.log("State saved to IndexedDB");
          lastSyncedState = stateToSync;
        })
        .catch((error) =>
          console.error("Failed to save state to IndexedDB:", error)
        );
    }

    // Sync with backend if authenticated
    const token = localStorage.getItem("token");
    if (token) {
      debouncedSync(stateToSync);
    }

    return result;
  };
};
