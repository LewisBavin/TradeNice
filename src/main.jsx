import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./Slices/_store.js";
import App from "./App.jsx";
import "./Styles/index.css";


import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";
import "./Styles/App.scss";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
    <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
);
