import React from "react";
import { accountActions, readAccount } from "../../Utilities/AccountSlice";
import Login from "../Login";
import { useSelector, useDispatch } from "react-redux";
import Dashboard from "../Dashbaord/Dashboard";

const Home = () => {
  const dispatch = useDispatch();
  const account = useSelector(readAccount);
  function setTypeById(e) {
    dispatch(accountActions.setType(e.target.id));
  }

  const toggleLogin = () => {
    dispatch(accountActions.setLoggedIn());
    navigate("/");
  };
  console.log(account);

  return (
    <>
      {!account.type && !account.loggedIn && (
        <>
          <button id="gasPortal" onClick={setTypeById}>
            Gas
          </button>
          <button id="powerPortal" onClick={setTypeById}>
            Power
          </button>
        </>
      )}
      {account.type && !account.loggedIn && (
        <>
          <Login toggleLogin={toggleLogin} />
        </>
      )}
      {account.type && account.loggedIn && (
        <>
          <Dashboard toggleLogin={toggleLogin} />
        </>
      )}
    </>
  );
};

export default Home;
