import { createSlice } from '@reduxjs/toolkit';

const MAX_HISTORY_LENGTH = 100; // Limit history length

const initialState = {
  style: 1,
  history: [],//{in: ,out: }
  lastOutput: '',
};

export const commandSlice = createSlice({
  name: 'command',
  initialState,
  reducers: {

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
  setStyle, 
  addToHistory, 
  setLastOutput, 
  clearHistory,
  updateState,
  silentUpdateState
} = commandSlice.actions;

export default commandSlice.reducer;
