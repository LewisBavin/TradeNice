import { createSlice } from "@reduxjs/toolkit";
import { getStore, setStore } from "../Utilities/localStorage";

const initialState = !getStore("graph") ? {} : getStore("graph");

export const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    setDates: (state, { payload }) => {
      let { start, end } = payload;
      state.dateRange.start = start ? start : null;
      state.dateRange.end = end ? end : start;
    },
    setWap: (state, { payload }) => {
      state.wap = payload;
    },
    setAll: (state, { payload }) => {
      state.prices = payload;
      setStore("graph", state);
    },
  },
});

export const graphActions = graphSlice.actions;
export const readGraph = (state) => state.graph;
export const getSavedPrices = (state) => state.graph.prices;
export default graphSlice.reducer;
