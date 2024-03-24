import { createSlice } from "@reduxjs/toolkit";
import { getGasPrices } from "../apiTokens";
import { current } from "@reduxjs/toolkit";

const initialState = {
  gasPricesss: [1, 2, 33],
  plot: {
    startString: new Date().toString(),
    end: null,
    range: null,
    points: { x: [], y: [] },
  },
};

const initialState2 = {
  lol: "lol",
  lmao: "lmao",
  hehe: 23,
  haha: [1, 2, 3],
};

export const graphSlice = createSlice({
  name: "graph",
  initialState: initialState2,
  reducers: {
    setGasPrices: (state, { payload }) => {
      let tempState = current(state);
      tempState.haha = [4, 5, 6];
      state = tempState;
      /*  let getPrices = async () => {
        records = (await getGasPrices(payload)).data.records;
        console.log("slice", records);
      };
      getPrices(); */
    },
    logState: (state, { payload }) => {
      console.log(current(state));
    },
  },
});

export const graphActions = graphSlice.actions;
export default graphSlice.reducer;
