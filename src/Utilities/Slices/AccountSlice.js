import { createSlice } from "@reduxjs/toolkit";
import { setStore, getStore } from "../localStorage";
import { gasUsers } from "../systemUsers";
import { arrObjByKeyVal } from "../usefulFuncs";

const initial = {
  loggedIn: false,
  msg: null,
  user: null,
  create: false,
  view: { main: 0, inner: 0 },
};
const initialState = !getStore("account") ? initial : getStore("account");

export const accountSlice = createSlice({
  name: "account",
  initialState: initialState,
  reducers: {
    logIn: (state, { payload }) => {
      state.user = payload;
      state.loggedIn = !!state.user;
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
    setCreate: (state, { payload }) => {
      state.create = payload;
      setStore("account", state);
    },
    setType: (state, { payload }) => {
      state.type = payload;
      setStore("account", state);
    },
    setRequests: (state, { payload }) => {
      state.requests = payload;
      setStore("account", state);
    },
    setUsers: (state, { payload }) => {
      state.users = payload;
      setStore("account", state);
    },
    setLoggedIn: (state) => {
      state.loggedIn = !state.loggedIn;
      setStore("account", state);
    },
    showLogin: (state) =>{
      state.loggedIn = false;
      state.create = false
      setStore("account", state)

    },
    setView: (state, { payload }) => {
      state.view = payload;
      setStore("account", state);
    },
    authoriseUser: (state, { payload }) => {
      const { password, userInput } = payload;
      const user = arrObjByKeyVal(gasUsers, "name", userInput);
      state.user = user && user.password === password && user;
      state.loggedIn = user && true;
      setStore("account", state);
    },
  },
});

export const accountActions = accountSlice.actions;
export const readAccount = (state) => state.account;
export default accountSlice.reducer;
