import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  preferences: {
    typing: {
      typesetting: {
        timeLimit: 60,
        punc: false,
        num: false,
        capitalize: "small", // capital, small, word, sentence
        mode: "timeLimit",
        words: 50,
      },
    },
    tape: {
      move: "letter", //letter,word
    },
    keyboard: {
      layout: "alphabet", //alphabet, alphanumeric, all
      delay: 0,
    },
  },
};
export const timeLimitOptions = [15, 30, 60, 120];
export const modeOptions = ["timeLimit", "words", "quote"];
export const wordOptions = [25, 50, 100, 150];
export const captializeOptions = ["capital", "small", "word", "sentence"];
export const LayoutOptions = ["alphabet", "alphanumeric", "all"];
export const delayOptions = [0, 100, 250, 500, 1000, 2000];
export const tapeModeOptions = ["letter", "word"];
export const typingSlice = createSlice({
  name: "user",
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
    },
    silentUpdateState: (state, action) => {
      return { ...state, ...action.payload };
    },
    setKeyboardLayout: (state, action) => {
      if (!("keyboard" in state.preferences))
        state.preferences.keyboard = initialState.preferences.keyboard;
      state.preferences.keyboard.layout = action.payload;
    },
    setKeyboardDelay: (state, action) => {
      if (!("keyboard" in state.preferences))
        state.preferences.keyboard = initialState.preferences.keyboard;
      state.preferences.keyboard.delay = action.payload;
    },
    setTypingMode: (state, action) => {
      state.preferences.typing.typesetting.mode = action.payload;
    },
    setWords: (state, action) => {
      state.preferences.typing.typesetting.words = action.payload;
    },
    setTapeModeMovePref: (state, action) => {
      state.preferences.tape.move = action.payload;
    },
  },
});

export const {
  setTimeLimit,
  setPunctuation,
  setNumbers,
  setCapitalization,
  silentUpdateState,
  setKeyboardLayout,
  setKeyboardDelay,
  setTypingMode,
  setWords,
  setTapeModeMovePref,
} = typingSlice.actions;

export const selectTypingSettings = (state) =>
  state.user.preferences.typing.typesetting;
export const selectKeyboardLayout = (state) =>
  state.user.preferences.keyboard.layout;
export const selectKeyboardDelay = (state) =>
  state.user.preferences.keyboard.delay;
export const selectTapeMode = (state) => state.user.preferences.tape;
export default typingSlice.reducer;
