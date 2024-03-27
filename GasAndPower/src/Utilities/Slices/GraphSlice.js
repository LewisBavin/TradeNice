import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    setDates: (state, { payload }) => {
      let { start, end } = payload;
      state.dateRange.start = start ? start : null;
      state.dateRange.end = end ? end : start;
    },
    initialiseGridPrices: (state, { payload }) => {
      state.prices = payload;
    },
  },
});

export const graphActions = graphSlice.actions;
export const getSavedPrices = (state) => state.graph.prices;
export default graphSlice.reducer;
