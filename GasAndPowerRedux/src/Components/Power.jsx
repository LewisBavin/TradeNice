import React from "react";
import { useState } from "react";
import Dashboard from "./Dashboard";
import { Link } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

const Power = () => {
  const [counter, setCounter] = useState(0);

  return (
    <>
      This is Power
    </>
  );
};

export default Power;
