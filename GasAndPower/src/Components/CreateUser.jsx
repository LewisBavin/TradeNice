import React, { useState } from "react";
import axios from "axios";
import Joi, { valid } from "joi";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { accountActions } from "../Utilities/Slices/AccountSlice";
import sha256 from "sha256";
const schema = Joi.object().keys({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  username: Joi.string().alphanum().min(4).max(10).required(),
  password: Joi.string().alphanum().min(8).required(),
});

const placeholders = {
  email: "YourComapany@email.com",
  username: "Username",
  password: "Password",
};

const CreateUser = ({ account }) => {
  const dispatch = useDispatch();
  const [validation, setValidation] = useState({
    toValidate: placeholders,
    result() {
      let { error } = schema.validate(this.toValidate, { abortEarly: false });
      return !error
        ? {}
        : error.details.reduce((accum, val) => {
            let temp = { ...accum };
            temp[val.context.key] = val.message;
            return temp;
          }, {});
    },
    errMsgs: {},
  });

  let errLength = Object.keys(validation.errMsgs).length;
  let { success } = validation.errMsgs;

  const feildValidation = (e) => {
    let { toValidate } = validation;
    let target = e.target;
    toValidate[target.name] = target.value;
    setValidation({ ...validation, toValidate, errMsgs: validation.result() });
  };

  const postValidation = async (e) => {
    e.preventDefault();
    let feilds = e.target;
    setValidation({
      ...validation,
      toValidate: {
        email: feilds.email.value,
        username: feilds.username.value,
        password: feilds.password.value,
      },
      errMsgs: validation.result(),
    });
    let resp = !errLength
      ? (
          await axios.post(
            `http://localhost:6002/signUp/`,
            validation.toValidate
          )
        ).data
      : { msg: {} };
    setValidation({ ...validation, errMsgs: resp.msg });
  };

  return (
    <>
      <div className="container flx col jc-c">
        <form
          className="flx col jc-c"
          method="GET"
          action=""
          onSubmit={postValidation}
        >
          <div className="feilds flx col">
            {Object.keys(placeholders).map((key, i) => {
              return (
                <div className="feild" key={i}>
                  <input
                    type={key}
                    name={key}
                    id={key}
                    placeholder={placeholders[key]}
                    onChange={feildValidation}
                  />
                  <label htmlFor={key}>{validation.errMsgs[key]}</label>
                </div>
              );
            })}
          </div>
          {!success && (
            <Button
              variant={!errLength ? "success" : "secondary"}
              type="submit"
            >
              {errLength ? "Check Details" : "Submit"}
            </Button>
          )}
        </form>
        {success ? (
          <div>
            <div className="note">{success}</div>
            <Button
              onClick={async () => {
                dispatch(accountActions.setCreate(false));
                let { user, msg } = (
                  await axios.get(
                    `http://localhost:6002/auth/${
                      validation.toValidate.username
                    }/${sha256(validation.toValidate.password + "GasPower")}`
                  )
                ).data;
                console.log({ user, msg });
                dispatch(accountActions.logIn({ user, msg }));
              }}
            >
              Login
            </Button>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CreateUser;
