import { createSlice } from "@reduxjs/toolkit";
import { setStore, getStore } from "./localStorage";

setStore("manualTest", true);
const initialState = { accountType: null, screen: null };

export const accountSlice = createSlice({
  name: "account",
  initialState: initialState,
  reducers: {
    setAccountType: (state, { payload }) => {
      state.Type = payload;
    },
  },
  setScreen: (state, { payload }) => {
    state.screen = payload;
  },
});

export const { setAccountType } = accountSlice.actions;
export const readAccountType = (state) => state.account.Type;
export const readScreen = (state) => state.account.screen;
export default accountSlice.reducer;
