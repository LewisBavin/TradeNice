import React from "react";
import { accountActions } from "../../Utilities/Slices/AccountSlice";
import Login from "../Login";
import { useSelector, useDispatch } from "react-redux";
import Dashboard from "../Dashbaord/Dashboard";
import axios from "axios";
import sha256 from "sha256";
const salt = "GasPower";
import CreateUser from "../CreateUser";

const Home = ({ account }) => {
  const dispatch = useDispatch();

  const logIn = async (e) => {
    e.preventDefault();
    let feilds = e.target;
    let email = feilds.email.value;
    let password = feilds.password.value;
    let user= (
      await axios.post(`http://localhost:6002/user/login/`,{email, password})
    ).data.user;


    dispatch(accountActions.logIn(user));
  };

  const setCreate = () => {
    dispatch(accountActions.setCreate(true));
  };

  return (
    <>
      {!account.loggedIn ? (
        account.create ? (
          <CreateUser account={account} />
        ) : (
          <div className="loginContainer">
            <div className="header">Log in to Dashboard</div>
            <div className="login">
              <form method="GET" action="" onSubmit={logIn}>
                <input
                  type="text"
                  name="email"
                  id="loginEmail"
                  placeholder="eMail"
                />
                <input
                  type="text"
                  name="password"
                  id="loginPassword"
                  placeholder="Password"
                />
                <button type="submit">Go</button>
              </form>
              <div className="alert">{!!account.msg && account.msg}</div>
            </div>
            <button onClick={setCreate}>Don't have an account?</button>
          </div>
        )
      ) : (
        <Dashboard account={account} />
      )}
    </>
  );
};

export default Home;
