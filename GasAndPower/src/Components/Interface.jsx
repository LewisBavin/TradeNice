import React from "react";
import Header from "./Body/Header";
import Footer from "./Body/Footer";
import Dashboard from "./Dashbaord/Dashboard";
import Login from "./Login";
import Home from "./Body/Home";

import { Routes, Route } from "react-router";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { accountActions, readAccount } from "../Utilities/Slices/AccountSlice";
import { graphActions } from "../Utilities/Slices/GraphSlice";

function Interface() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const account = useSelector(readAccount);
  const toggleLogin = () => {
    dispatch(accountActions.setLoggedIn());
    navigate("/");
  };

  return (
    <>
      <div className="root-container flx col ai-c jc-c">
        <header>
          <Header account={account} />
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={<Home toggleLogin={toggleLogin} account={account} />}
            ></Route>
          </Routes>
        </main>
        <footer className="flx jc-c ai-c">
          <Footer />
        </footer>
      </div>
    </>
  );
}

export default Interface;
