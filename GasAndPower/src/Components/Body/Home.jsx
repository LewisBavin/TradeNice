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
    let username = feilds.username.value;
    let password = sha256(feilds.password.value + salt);
    let { user, msg } = (
      await axios.get(`http://localhost:6002/auth/${username}/${password}`)
    ).data;
    dispatch(accountActions.logIn({ user, msg }));
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
                  name="username"
                  id="username"
                  placeholder="Username"
                />
                <input
                  type="text"
                  name="password"
                  id="password"
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
