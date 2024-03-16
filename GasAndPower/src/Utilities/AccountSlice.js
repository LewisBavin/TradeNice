import { createSlice } from "@reduxjs/toolkit";
import { setStore, getStore } from "./localStorage";

setStore("manualTest", true);
const initialState = { view: 'gasBalance'};

export const accountSlice = createSlice({
  name: "account",
  initialState: initialState,
  reducers: {
    setType: (state, { payload }) => {
      state.type = payload;
      setStore("account", state)
    },
    setLoggedIn: (state) => {
      state.loggedIn = !state.loggedIn;
      setStore("account", state)
    },
    setView: (state, { payload }) => {
      state.view = payload;
      setStore("account", state)
    },
  },
});

export const accountActions = accountSlice.actions;

export const readAccount = (state) => state.account;
export default accountSlice.reducer;
