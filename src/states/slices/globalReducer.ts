/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

export interface GlobalState {
  open: boolean;
  chatStarted: boolean;
  searchModal: boolean;
  messages: Array<string>;
  input: string;
}

const initialState: GlobalState = {
  open: false,
  chatStarted: false,
  searchModal: false,
  messages: [],
  input: "",
};

export const GlobalSlice = createSlice({
  initialState,
  name: "globalstate",
  reducers: {
    setOpen: (state, action) => {
      state.open = action.payload;
    },
    setChatStarted: (state, action) => {
      state.chatStarted = action.payload;
    },
    setSearcModal: (state, action) => {
      state.searchModal = action.payload;
    },
    setMessage: (state, action) => {
      state.messages = action.payload;
    },
    setSelectedInput: (state, action) => {
      state.input = action.payload;
    },
  },
});

export const {
  setOpen,
  setChatStarted,
  setSearcModal,
  setMessage,
  setSelectedInput,
} = GlobalSlice.actions;

export const SelectOpenState = (state: RootState) => state.globalstate.open;
export const startChat = (state: RootState) => state.globalstate.chatStarted;
export const openModal = (state: RootState) => state.globalstate.searchModal;
export const getMessages = (state: RootState) => state.globalstate.messages;
export const selectInput = (state: RootState) => state.globalstate.input;
export const GlobalReducer = GlobalSlice.reducer;
