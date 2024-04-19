import React from "react";
import { accountActions } from "../../Utilities/Slices/AccountSlice";
import Login from "../Login";
import { useSelector, useDispatch } from "react-redux";
import Dashboard from "../Dashbaord/Dashboard";

const Home = (props) => {
  const dispatch = useDispatch();
  const { account } = props;
  function setTypeById(e) {
    dispatch(accountActions.setType(e.target.id));
  }

  const toggleLogin = () => {
    dispatch(accountActions.setLoggedIn());
    navigate("/");
  };

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
          <Login toggleLogin={toggleLogin} account={account} />
        </>
      )}
      {account.type && account.loggedIn && (
        <>
          <Dashboard toggleLogin={toggleLogin} account={account} />
        </>
      )}
    </>
  );
};

export default Home;
