import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
const API_URL = process.env.REACT_APP_API_URL;

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
  async ({ email, password, totp }, { rejectWithValue }) => {
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
      
      // Return a plain object with only the data we need
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name || user.email.split('@')[0]
        }
      };
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
  async (_, { rejectWithValue }) => {
    try {
      // Clear token from axios defaults
      delete axios.defaults.headers.common['Authorization'];
      
      // Clear token from localStorage
      localStorage.removeItem('token');
      
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Check if user is already logged in
export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      // Set the token in axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verify token with backend (optional)
      const response = await axios.get(`${API_URL}/auth/verify`);
      return response.data;
    } catch (error) {
      // If token is invalid, clear it
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add TOTP enable thunk
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

const initialState = {
  user: {
    id: null,
    email: null,
    name: null
  },
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearFreshState: (state) => {
      state.freshState = null;
    },
    setFreshState: (state, action) => {
      state.freshState = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Signup failed';
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.totpRequired = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload.user.id,
          email: action.payload.user.email,
          name: action.payload.user.name || action.payload.user.email.split('@')[0] // Fallback to email username if name not provided
        };
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = {
          id: null,
          email: null,
          name: null
        };
        state.token = null;
        // Ensure error is a plain object
        state.error = typeof action.payload === 'string' 
          ? { message: action.payload }
          : action.payload || { message: 'Login failed' };
        state.totpRequired = action.payload?.totpRequired || false;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = {
          id: null,
          email: null,
          name: null
        };
        state.token = null;
        state.isAuthenticated = false;
        state.totpRequired = false;
        state.loading = false;
        state.freshState = null;
      })
      
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = {
            id: action.payload.user.id,
            email: action.payload.user.email,
            name: action.payload.user.name || action.payload.user.email.split('@')[0] // Fallback to email username if name not provided
          };
          state.token = localStorage.getItem('token');
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = {
          id: null,
          email: null,
          name: null
        };
        state.token = null;
      })
      
      // Enable TOTP
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
  },
});

export const { clearError, clearFreshState, setFreshState } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectTotpRequired = (state) => state.auth.totpRequired;
export const selectTotpEnabled = (state) => state.auth.totpEnabled;
export const selectTotpEnabling = (state) => state.auth.totpEnabling;
export const selectTotpError = (state) => state.auth.totpError;
export const selectFreshState = (state) => state.auth.freshState;

export default authSlice.reducer;
