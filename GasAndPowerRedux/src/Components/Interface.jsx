import React from "react";
import Header from "./Body/Header";
import Footer from "./Body/Footer";
import Dashboard from "./Dashbaord/Dashboard";
import Login from "./Login";
import Home from "./Body/Home";

import { Routes, Route } from "react-router";
import { Link } from "react-router-dom";
import { setStore } from "../Utilities/localStorage";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { accountActions } from "../Utilities/AccountSlice";

function Interface() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleLogin = () => {
    dispatch(accountActions.setLoggedIn());
    navigate("/");
  };

  return (
    <>
      <div className="root-container flx col ai-c jc-c">
        <header className="flx jc-c ai-c">
          <Header toggleLogin={toggleLogin} />
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={<Home toggleLogin={toggleLogin} />}
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
