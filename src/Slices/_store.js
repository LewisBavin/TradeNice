import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./AccountSlice";
import graphReducer from "./GraphSlice";

export const store = configureStore(
  {
    reducer: {
      account: accountReducer,
      graph: graphReducer,
    },
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
