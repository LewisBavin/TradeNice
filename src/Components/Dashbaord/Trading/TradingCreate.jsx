import axios from "axios";
import React, { useState } from "react";

const TradingCreate = () => {
  const [state, setState] = useState({});
  let getUsers = async () => {
    let users = (await axios.get("http://localhost:6002/user/get/users")).data;
    setState({ ...state, users });
  };
  !state.users ? getUsers() : null;
  console.log(state.users);
  return (
    <>
      <div>CREATE REQUEST</div>
      <input list="buySell" id="buySell1" name="buySell" />
      <datalist id="buySell">
        <option value="BUY"></option>
        <option value="SELL"></option>
      </datalist>
    </>
  );
};

export default TradingCreate;
