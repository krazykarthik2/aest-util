import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { openDB } from 'idb';
import {loadPersistedState} from './persistMiddleware';
const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  totpRequired: false,
  totpEnabled: false,
  totpEnabling: false,
  totpError: null,
  freshState: null
};

// Async thunks for authentication
export const signup = createAsyncThunk(
  'auth/signup',
  async (body, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, totp }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
        ...(totp && { totp })
      });
      
      const { token, user } = response.data;
      
      if (!token) {
        throw new Error('No token received');
      }

      // Store token in localStorage
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;


      return { token, user };
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: error.message || 'Login failed' });
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      // Clear token
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      
      // Clear IndexedDB state on logout
      const db = await openDB('aest-util-store', 1);
      await db.clear('redux-store');
      
      return null;
    } catch (error) {
      console.error('Logout error:', error);
      return null;
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_URL}/auth/verify`);
      return { token, user: response.data.user };
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const enableTotp = createAsyncThunk(
  'auth/enableTotp',
  async (totp, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/enable-totp`, { totp });
      toast.info(JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to enable TOTP' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFreshState: (state, action) => {
      state.freshState = action.payload;
    },
    clearFreshState: (state) => {
      state.freshState = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
        if (action.payload?.totpRequired) {
          state.totpRequired = true;
        }
      })
      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        return initialState;
      })
      // Check auth cases
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        } else {
          return initialState;
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        return initialState;
      })
      // Enable TOTP cases
      .addCase(enableTotp.pending, (state) => {
        state.totpEnabling = true;
        state.totpError = null;
      })
      .addCase(enableTotp.fulfilled, (state) => {
        state.totpEnabling = false;
        state.totpEnabled = true;
        state.totpError = null;
      })
      .addCase(enableTotp.rejected, (state, action) => {
        state.totpEnabling = false;
        state.totpError = action.payload?.message || 'Failed to enable TOTP';
      });
  }
});

export const { clearError, setFreshState, clearFreshState } = authSlice.actions;

// Selectors
export const selectAuth = state => state.auth;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectUser = state => state.auth.user;
export const selectAuthLoading = state => state.auth.loading;
export const selectAuthError = state => state.auth.error;
export const selectTotpRequired = state => state.auth.totpRequired;
export const selectTotpEnabled = state => state.auth.totpEnabled;
export const selectTotpEnabling = state => state.auth.totpEnabling;
export const selectTotpError = state => state.auth.totpError;
export const selectFreshState = state => state.auth.freshState;

export default authSlice.reducer;
