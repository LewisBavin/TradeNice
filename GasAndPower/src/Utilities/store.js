import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./Slices/AccountSlice";
import systemReducer from "./Slices/SystemSlice";
import graphSlice from "./Slices/GraphSlice";

export const store = configureStore(
  {
    reducer: {
      account: accountReducer,
      system: systemReducer,
      graph: graphSlice,
    },
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
