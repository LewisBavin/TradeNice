import { createSlice } from "@reduxjs/toolkit";
import { setStore, getStore } from "../localStorage";
import { gasUsers } from "../systemUsers";
import { arrObjByKeyVal } from "../usefulFuncs";

const initialState = { view: "tabBalance" };

export const accountSlice = createSlice({
  name: "account",
  initialState: initialState,
  reducers: {
    setType: (state, { payload }) => {
      state.type = payload;
      setStore("account", state);
    },
    setLoggedIn: (state) => {
      state.loggedIn = !state.loggedIn;
      setStore("account", state);
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
