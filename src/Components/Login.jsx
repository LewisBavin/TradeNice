import axios from "axios";
import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { accountActions } from "../Slices/AccountSlice";

const Login = ({ account }) => {
  const dispatch = useDispatch();
  const [logins, setLogins] = useState({
    email: "",
    password: "",
  });

  let onChange = (e) => {
    e.preventDefault();
    setLogins({ ...logins, [e.target.name]: [e.target.value] });
  };

  let onSubmit = async (e) => {
    e.preventDefault();

    try {
      let response = (
        await axios.post(`http://localhost:6002/user/login/`, logins)
      ).data;
      let { msg, user } = response;
      dispatch(
        accountActions.setToast(
          user
            ? {
                trigger: true,
                strong: "Success!",
                small: "",
                body: "Welcome Back " + user.name,
                variant: "success"
              }
            : {
                trigger: true,
                strong: "Incorrect Credientials!",
                body: "Please try again",
                variant: "danger"
              }
        )
      );
      user && dispatch(accountActions.logIn({ user }));
    } catch (e) {
      dispatch(accountActions.setToast({
        trigger: true,
        strong: "Error!",
        small: "Connection Error",
        body: "Please Contact Admin",
        variant: "warning"
      }));
    }
  };

  return (
    <>
      <Form onChange={onChange} onSubmit={onSubmit}>
        <Container className="flx col jc-c ai-c">
          Log into Dashboard
          {Object.entries(logins).map(([name, value], i) => {
            return (
              <Container key={i}>
                <Form.Control
                  type={name}
                  name={name}
                  defaultValue={value}
                  placeholder={name}
                ></Form.Control>
              </Container>
            );
          })}
          <Button type="submit">Go</Button>
        </Container>
      </Form>
    </>
  );
};

export default Login;
