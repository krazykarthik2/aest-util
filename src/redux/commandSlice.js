import { createSlice } from '@reduxjs/toolkit';

const MAX_HISTORY_LENGTH = 100; // Limit history length

const initialState = {
  command: '',
  style: 1,
  history: [],
  lastOutput: '',
};

export const commandSlice = createSlice({
  name: 'command',
  initialState,
  reducers: {
    setCommand: (state, action) => {
      state.command = action.payload;
    },
    setStyle: (state, action) => {
      state.style = action.payload;
    },
    addToHistory: (state, action) => {
      state.history.push(action.payload);
    },
    setLastOutput: (state, action) => {
      state.lastOutput = action.payload;
    },
    clearHistory: (state) => {
      state.history = [];
    },
    updateState: (state, action) => {
      return { ...state, ...action.payload };
    },
    silentUpdateState: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { 
  setCommand, 
  setStyle, 
  addToHistory, 
  setLastOutput, 
  clearHistory,
  updateState,
  silentUpdateState
} = commandSlice.actions;

export default commandSlice.reducer;
