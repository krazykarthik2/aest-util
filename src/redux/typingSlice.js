import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  preferences: {
    typing: {
      typesetting: {
        timeLimit: 60,
        punc: false,
        num: false,
        capitalize: "small" // capital, small, word, sentence
      }
    }
  }
};

export const typingSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTimeLimit: (state, action) => {
      state.preferences.typing.typesetting.timeLimit = action.payload;
    },
    setPunctuation: (state, action) => {
      state.preferences.typing.typesetting.punc = action.payload;
    },
    setNumbers: (state, action) => {
      state.preferences.typing.typesetting.num = action.payload;
    },
    setCapitalization: (state, action) => {
      state.preferences.typing.typesetting.capitalize = action.payload;
    }
  }
});

export const { setTimeLimit, setPunctuation, setNumbers, setCapitalization } = typingSlice.actions;

export const selectTypingSettings = (state) => state.user.preferences.typing.typesetting;

export default typingSlice.reducer;
