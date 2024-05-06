import { createSlice } from "@reduxjs/toolkit";
import { setStore, getStore } from "../Utilities/localStorage";

const initial = {
  loggedIn: false,
  user: null,
  create: false,
  view: { main: 0, inner: 0 },
  toast: {trigger: false}
};
const initialState = !getStore("account") ? initial : getStore("account");

export const accountSlice = createSlice({
  name: "account",
  initialState: initialState,
  reducers: {
    setToast: (state, {payload}) =>{
      state.toast = payload
      setStore ("account", state)
    },
    showLogin: (state) => {
      state.loggedIn = false;
      state.create = false;
      setStore("account", state);
    },
    showCreate: (state) => {
      state.create = true;
      setStore("account", state);
    },
    logIn: (state, { payload }) => {
      state.user = payload.user
      state.loggedIn = true
      state.create = false
      setStore("account", state);
    },
    logOut: (state) => {
      Object.keys(state).forEach((key) => {
        if (initial.hasOwnProperty(key)) {
          state[key] = initial[key];
        } else {
          delete state[key];
        }
      });
      setStore("account", state);
    },
    setView: (state, { payload }) => {
      state.view = payload;
      setStore("account", state);
    },
    setUsers: (state, { payload }) => {
      state.users = payload;
      setStore("account", state);
    },
    setRequests: (state, { payload }) => {
      state.requests = payload;
      setStore("account", state);
    },
  },
});

export const accountActions = accountSlice.actions;
export const readAccount = (state) => state.account;
export default accountSlice.reducer;
