import React from "react";
import axios from "axios";
const CreateUser = ({ account }) => {
  return (
    <>
      <form
        className="flx col"
        method="GET"
        action=""
        onSubmit={async (e) => {
          e.preventDefault();
          let feilds = e.target;
          let data = (
            await axios.post(`http://localhost:6002/signUp/`, {
              email: feilds.email.value,
              username: feilds.username.value,
              password: feilds.password.value,
            })
          ).data;
        }}
      >
        <div className="feilds">
          <div>
            <label className="label right" htmlFor="email">
              email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Company eMail"
            />
          </div>
          <div>
            <label className="label right" htmlFor="username">
              username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
            />
          </div>
          <div>
            <label className="label right" htmlFor="password">
              password
            </label>
            <input
              type="text"
              name="password"
              id="password"
              placeholder="Password"
            />
          </div>
        </div>
        <button type="submit">Go</button>
      </form>
    </>
  );
};

export default CreateUser;
