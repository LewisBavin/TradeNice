import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { accountActions, readAccount } from "../Utilities/AccountSlice";
import { getStore } from "../Utilities/localStorage";


const Login = (props) => {
  const {toggleLogin} = props
  
  return (
    <>
      <div>
        <div>Please Enter your company's username and password</div>
        <button
          onClick={toggleLogin}
        >
          Log In
        </button>
      </div>
    </>
  );h
};

export default Login;
