import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Power from "./Power";
import Gas from "./Gas";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Home from "./Home";

import { Routes, Route } from "react-router";
import { Link } from "react-router-dom";
import { setStore } from "../Utilities/localStorage";
import {
  setAccountType,
  readAccountType,
  readScreen,
} from "../Utilities/AccountSlice";
import { useSelector, useDispatch } from "react-redux";

function Interface() {
  const dispatch = useDispatch();
  const accountType = useSelector(readAccountType);
  const screen = useSelector(readScreen);

  return (
    <>
      <div className="root-container flx col jc-c ai-c">
        <header className="flx jc-c ai-c">
          <Header />
        </header>
        <main><div className="test"></div></main>
        <footer className="flx jc-c ai-c">
          <Footer />
        </footer>
      </div>
    </>
  );
}

export default Interface;
