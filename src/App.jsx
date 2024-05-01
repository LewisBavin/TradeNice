import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "reactjs-popup/dist/index.css";

import Interface from "./Components/Interface";

function App() {
  return (
    <>
      <Interface />
      <ToastContainer />
    </>
  );
}

export default App;
