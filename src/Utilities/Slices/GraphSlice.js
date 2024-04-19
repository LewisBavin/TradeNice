import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dateRange: { start: new Date().getTime(), end: new Date().getTime() },
};

export const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    setDates: (state, { payload }) => {
      let { start, end } = payload;
      state.dateRange.start = start ? start : null;
      state.dateRange.end = end ? end : start;
    },
  },
});

export const graphActions = graphSlice.actions;
export const dateify = (state) => {
  let {start, end} = {...state.graph.dateRange}
  return {start: new Date(start), end: new Date(end)}
};
export default graphSlice.reducer;
