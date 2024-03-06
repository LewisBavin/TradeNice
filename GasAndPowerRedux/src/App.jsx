import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Styles/App.scss";
import "react-toastify/dist/ReactToastify.css";
import Interface from "./Components/Interface";
import { apiTokens } from "./Utilities/apiTokens";

function App() {
  return (
    <>
      <Interface />
      <ToastContainer />
    </>
  );
}

export default App;
