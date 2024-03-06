import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./Utilities/store.js";
import App from "./App.jsx";
import "./Styles/index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
    <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
);
