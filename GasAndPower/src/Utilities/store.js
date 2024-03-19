import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./Slices/AccountSlice";
import systemReducer from "./Slices/SystemSlice";

export const store = configureStore(
  {
    reducer: {
      account: accountReducer,
      system: systemReducer,
    },
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
