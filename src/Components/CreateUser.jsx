import React, { useEffect, useState } from "react";
import axios from "axios";
import Joi, { valid } from "joi";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { accountActions } from "../Utilities/Slices/AccountSlice";
import sha256 from "sha256";
import { Container, Form } from "react-bootstrap";
import MyToast from "./MyToast";

const schema = Joi.object().keys({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  name: Joi.string().alphanum().min(6).max(12).required(),
  password: Joi.string().alphanum().min(8).required(),
});

const placeholders = {
  email: "YourComapany@email.com",
  name: "Username",
  password: "Password",
};

const CreateUser = ({ account }) => {
  const dispatch = useDispatch();
  const [errs, setErrs] = useState({ email: "", name: "", password: "" });
  const [feilds, setFeilds] = useState({ email: "", name: "", password: "" });
  const [toast, setToast] = useState({ trigger: false });

  useEffect(() => {
    toast.trigger &&
      setTimeout(() => {
        setToast({ ...toast, trigger: false });
      }, 4000);
  }, [toast]);

  let updateFeilds = async (e) => {
    let [name, value] = [e.target.name, e.target.value];
    let temp = { ...feilds, [name]: value };
    let { error } = schema.validate(temp, { abortEarly: false });
    let msg = !error
      ? ""
      : error.details.reduce((accum, val) => {
          accum += val.context.key == name ? val.message : "";
          return accum;
        }, "");
    setErrs({ ...errs, [name]: msg });
    setFeilds({ ...feilds, [name]: value });
  };

  let submitDetails = async (e) => {
    e.preventDefault();
    let form = e.target,
      name = form.name.value,
      email = form.email.value,
      password = form.password.value;
    try {
      let { returnMsg, user, returnErr } = (
        await axios.post(`http://localhost:6002/signUp/`, {
          name,
          email,
          password,
        })
      ).data;
      returnErr ? setErrs({ ...returnErr, password: "" }) : null;
      if (returnMsg && user) {
        setToast({
          ...toast,
          trigger: true,
          strong: "Success!",
          small: "Account created successfully",
          body: returnMsg,
        });
      }
    } catch (e) {
      setToast({
        ...toast,
        trigger: true,
        strong: "Error!",
        small: "Database Error",
        body: "Account not created",
      });
    }
  };

  let haultSubmit =
    Object.values(feilds).some((f) => !f) ||
    Object.values(errs).some((f) => !!f);

  return (
    <>
      <Form onSubmit={submitDetails}>
        <Container className="flx col jc-c ai-c">
          {Object.keys(feilds).map((feild, i) => {
            return (
              <Container key={i}>
                <Form.Control
                  type={feild}
                  name={feild}
                  placeholder={placeholders[feild]}
                  value={feilds[feild]}
                  autoComplete="off"
                  onChange={(e) => {
                    updateFeilds(e);
                  }}
                ></Form.Control>
                <Form.Text className="text-danger">{errs[feild]}</Form.Text>
              </Container>
            );
          })}
          <Button
            type="submit"
            disabled={haultSubmit}
            variant={haultSubmit ? "danger" : "success"}
          >
            Submit Details
          </Button>
        </Container>
      </Form>
      {toast.trigger ? <MyToast toastSettings={toast} /> : null}
    </>
  );
};

export default CreateUser;
