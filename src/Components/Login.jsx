import axios from "axios";
import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

const Login = ({ account }) => {
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
    let response = (
      await axios.post(`http://localhost:6002/user/login/`, logins)
    ).data;
  };

  let removePlaceholder = () => {};

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
                  onClick={removePlaceholder}
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
