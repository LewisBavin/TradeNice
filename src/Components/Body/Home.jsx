import React from "react";
import { accountActions } from "../../Slices/AccountSlice";
import { useSelector, useDispatch } from "react-redux";
import Dashboard from "../Dashbaord/Dashboard";
import axios from "axios";
import CreateUser from "../CreateUser";
import Login from "../Login";
import { Container } from "react-bootstrap";

const Home = ({ account }) => {
  const dispatch = useDispatch();

  const logIn = async (e) => {
    e.preventDefault();
    let feilds = e.target;
    let email = feilds.email.value;
    let password = feilds.password.value;
    let user = (
      await axios.post(`http://localhost:6002/user/login/`, { email, password })
    ).data.user;

    dispatch(accountActions.logIn(user));
  };

  const showCreate = () => {
    dispatch(accountActions.showCreate(true));
  };

  return (
    <>
      {!account.loggedIn ? (
        <Container className="loginContainer flx ai-c jc-c">
          {account.create && <CreateUser account={account} />}
          {!account.create && <Login account={account} />}
        </Container>
      ) : (
        <Container className="dashContainer">
          <Dashboard account={account} />
        </Container>
      )}

      {/*  {!account.loggedIn ? (
        account.create ? null : (
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
            <button onClick={showCreate}>Don't have an account?</button>
          </div>
        )
      ) : null} */}
    </>
  );
};

export default Home;
