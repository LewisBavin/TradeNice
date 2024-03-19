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
  reducers: {},
});

export const systemActions = systemSlice.actions;
export const getRequests = (state) => state.requests;
export const getGasUsers = (state) => state.gasUsers;
export const getSystemRequests = (state) => state.requests;
export default systemSlice.reducer;
