import { createSlice } from "@reduxjs/toolkit";
import { getGasPrices } from "../apiCalls";
import { current } from "@reduxjs/toolkit";

const initialState = {
  gasPrices: [],
  plot: {
    startString: new Date().toString(),
    end: null,
    range: null,
    points: { x: [], y: [] },
  },
};

export const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    setGasPrices: (state, { payload }) => {
      state.gasPrices = payload
    },
    logState: (state, { payload }) => {
      console.log(current(state).gasPrices.gasPrices[0]);
    },
    checkGasPrices: (state) =>{
      return state.gasPrices === null
    }
  },
});

export const graphActions = graphSlice.actions;
export default graphSlice.reducer;
