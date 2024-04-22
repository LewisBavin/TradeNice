import { createSlice } from "@reduxjs/toolkit";
import { setStore, getStore } from "../localStorage";
import { gasUsers } from "../systemUsers";
import { systemRequests } from "../systemTransactions";

const initialState = {
  gasUsers: gasUsers.map(({ id, name }) => {
    return { id, name };
  }),
  requests: systemRequests,
};

export const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {withdraw: (state, {payload})=>{
  }},
});

export const systemActions = systemSlice.actions;
export const getRequests = (state) => state.system.requests;
export const getUsers = (state) => state.system.gasUsers;
export const read = (state) => state.system;
export default systemSlice.reducer;
