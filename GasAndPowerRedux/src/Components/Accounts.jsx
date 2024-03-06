import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Power from "./Power";
import Gas from "./Gas";
import Dashboard from "./Dashboard";

import { Routes, Route } from "react-router";
import { Link } from "react-router-dom";
import Interface from "./Interface";

const Accounts = () => {
  return (
    <>
      <button>
        <Link to="Gas">Gas</Link>
      </button>
      <button>
        <Link to="Power">Power</Link>
      </button>
      <button>
        <Link to="/">Home</Link>
      </button>
      <Routes>
        <Route path="Gas" element={<Gas />}></Route>
        <Route path="Power" element={<Power />}></Route>
        <Route path="/" element={null}></Route>
      </Routes>
    </>
  );
};

export default Accounts;
