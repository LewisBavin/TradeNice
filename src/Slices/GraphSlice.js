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
    setAll: (state, {payload}) =>{

      state.all = payload
      setStore("graph", state)
    },
    initialiseGridPrices: (state, { payload }) => {
      state.prices = payload;

    },
  },
});

export const graphActions = graphSlice.actions;
export const readGraph = (state) => state.graph;
export const getSavedPrices = (state) => state.graph.prices;
export default graphSlice.reducer;
