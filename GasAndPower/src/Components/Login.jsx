import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { accountActions, readAccount } from "../Utilities/AccountSlice";
import { getStore } from "../Utilities/localStorage";
import { gasUsers } from "../Utilities/dummyData";

const Login = (props) => {
  const { toggleLogin, account } = props;
  const dispatch = useDispatch();
  const authorise = ()=>{
    dispatch(accountActions.authoriseUser({ userInput: "gas00", password: "password" }))
  }



  return (
    <>
      <div>
        <div>Please Enter your company's username and password</div>
        <label htmlFor="user">UserName</label>
        <input type="text" name="user" id="username" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button onClick={authorise}>Login</button>
      </div>
    </>
  );
  h;
};

export default Login;
