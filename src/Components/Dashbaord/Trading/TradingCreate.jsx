import axios from "axios";
import React, { createRef, useEffect, useState } from "react";
import {
  accountActions,
  readAccount,
} from "../../../Utilities/Slices/AccountSlice";
import { useDispatch, useSelector } from "react-redux";
import ReactDatePicker from "react-datepicker";
import { differenceInDays, format, formatDate, toDate } from "date-fns";
import Popup from "reactjs-popup";
import { valid } from "joi";

const TradingCreate = () => {
  const [state, setState] = useState({
    requests: [],
    errs: [],
    showErrors: false,
    validated: false,
    trySubmit: false,
    validate: true,
  });
  let account = useSelector(readAccount);

  let getUsers = async () => {
    let users = (
      await axios.get("http://localhost:6002/user/get/users", {
        headers: { token: account.user.token },
      })
    ).data.users;
    setState({ ...state, users });
  };

  let addRequest = () => {
    let requests = [...state.requests];
    requests.push({
      direction: "",
      counter_id: "",
      userName: "",
      start_date: "",
      end_date: "",
      volume: "",
      total_volume: 0,
      price: "",
    });
    setState({
      ...state,
      requests,
      showErrors: false,
      trySubmit: false,
      validate: true,
    });
  };

  let removeRequest = (i) => {
    let requests = [...state.requests];
    requests.splice(i, 1);
    setState({
      ...state,
      requests,
      showErrors: false,
      trySubmit: false,
      validate: true,
    });
  };

  let updateRequest = (args) => {
    let requests = [...state.requests];
    let { e, i, date, name } = args;
    let request = requests[i];
    if (date && name) {
      request[name] = format(date, "yyyy-MM-dd");
    } else {
      request[e.currentTarget.name] = e.currentTarget.value;
      if (e.currentTarget.name == "userName") {
        request.counter_id = state.users.filter(
          (u) => u.name == request.userName
        )[0].id;
      }
      if (e.currentTarget.name == "counter_id") {
        request.userName = state.users.filter(
          (u) => u.id == request.counter_id
        )[0].name;
      }
    }
    request = setDependencies(request);
    setState({ ...state, requests, validate: true });
  };

  let setDependencies = (request) => {
    let { userName, counter_id, start_date, end_date, volume, price } = request;
    if (!!start_date && !!end_date) {
      let d1 = toDate(request.start_date),
        d2 = toDate(request.end_date);
      let diff = differenceInDays(Math.max(d1, d2), Math.min(d1, d2));
      diff++;
      request.total_volume = diff * volume;
    }
    if (price !== "") {
      request.price = Math.round((price * 100) / 100);
    }
    return request;
  };

  let submitRequests = () => {
    let requests = [...state.requests];
    setState({ ...state, requests, trySubmit: true });
  };

  let sendRequests = async (requests) => {
    console.log(requests)
    let result = await axios.post("http://localhost:6002/user/addRequest", requests, {
      headers: { token: account.user.token },
    });

    console.log(result.data);
  };

  useEffect(
    /* updates errors and validated status*/
    () => {
      if (state.validate) {
        let requests = [...state.requests];
        let errs = requests.reduce((acum, init, i) => {
          let request = requests[i];
          let {
            direction,
            userName,
            counter_id,
            start_date,
            end_date,
            volume,
            price,
          } = request;
          let err = "";
          err +=
            direction == "Buy" || direction == "Sell"
              ? ""
              : "Direction not set. ";
          err += userName && counter_id ? "" : "Counterparty not set. ";
          err +=
            start_date && end_date
              ? toDate(start_date) > toDate(end_date)
                ? "Start must not be more then End. "
                : ""
              : "Invalid dates. ";
          err += volume ? "" : "Volume must be non-zero. ";
          err += price !== "" ? "" : "Price not set.";
          acum.push(err);
          return acum;
        }, []);
        let validated = !!errs.length && errs.every((err) => err == "");
        let validate = !validated;
        let showErrors = state.trySubmit && !validated;
        setState({ ...state, errs, validated, showErrors, validate });
        return;
      }
      if (state.trySubmit) {
        console.log("submitting to back");
        sendRequests(state.requests);
      }
    },
    [state.requests, state.trySubmit]
  );

  !state.users ? getUsers() : null;

  return (
    <div key={"k"} className="container flx col jc-c ai-c">
      <form>
        <div className="requests row">
          <div className="col">Direction</div>
          <div className="col">Counterparty</div>
          <div className="col">Counter Id</div>
          <div className="col">Start Date</div>
          <div className="col">End Date</div>
          <div className="col">Daily Volume</div>
          <div className="col">Total Volume</div>
          <div className="col">Price</div>
          <div className="col"></div>
        </div>
        {state.requests.map((request, i) => {
          return (
            <>
              <div key={i} className="requests row" id={"request_" + i}>
                <div className="col">
                  <label htmlFor={"direction_" + i}></label>
                  <select
                    value={request.direction}
                    name="direction"
                    id={"direction_" + i}
                    onChange={(e) => {
                      updateRequest({ e, i });
                    }}
                  >
                    <option value="">buy/sell</option>
                    <option value="Buy">Buy</option>
                    <option value="Sell">Sell</option>
                  </select>
                </div>
                <div className="col">
                  <label htmlFor={"userName_" + i}></label>
                  <select
                    value={request.userName}
                    name="userName"
                    id={"userName_" + i}
                    onChange={(e) => {
                      updateRequest({ e, i });
                    }}
                  >
                    <option value="">from/to</option>
                    {state.users.map((u, i) => (
                      <option key={i} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <label htmlFor={"counter_id_" + i}></label>
                  <select
                    value={request.counter_id}
                    name="counter_id"
                    id={"counter_id_" + i}
                    onChange={(e) => {
                      updateRequest({ e, i });
                    }}
                  >
                    <option value=""></option>
                    {state.users.map((u, i) => (
                      <option key={i} value={u.id}>
                        {u.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <ReactDatePicker
                    id={"start_date_" + i}
                    value={request.start_date}
                    dateFormat={"yyyy-mm-dd"}
                    autoComplete="off"
                    name="start_date"
                    placeholderText="yyyy-mm-dd"
                    onChange={(date) => {
                      updateRequest({ date, name: "start_date", i });
                    }}
                    className="requestInput"
                  />
                </div>
                <div className="col">
                  <ReactDatePicker
                    id={"end_date_" + i}
                    autoComplete="off"
                    value={request.end_date}
                    placeholderText="yyyy-mm-dd"
                    dateFormat={"yyyy-mm-dd"}
                    onChange={(date) => {
                      updateRequest({ date, name: "end_date", i });
                    }}
                    className="requestInput"
                  />
                </div>
                <div className="col">
                  <input
                    autoComplete="off"
                    id={"volume_" + i}
                    type="number"
                    name="volume"
                    placeholder="th/day"
                    value={request.volume}
                    className="requestInput"
                    onChange={(e) => {
                      updateRequest({ e, i });
                    }}
                  />
                </div>
                <div className="col">
                  <input
                    autoComplete="off"
                    placeholder="th"
                    id={"totalVolume_" + i}
                    type="number"
                    name="total_volume"
                    readOnly
                    disabled
                    value={request.total_volume}
                    className="requestInput"
                  />
                </div>
                <div className="col">
                  <input
                    id={"price_" + i}
                    autoComplete="off"
                    type="number"
                    name="price"
                    placeholder="£/th"
                    value={request.price}
                    className="requestInput"
                    onChange={(e) => {
                      updateRequest({ e, i });
                    }}
                  />
                </div>
                <div className="col">
                  <button
                    className="col"
                    onClick={(e) => {
                      e.preventDefault();
                      removeRequest(i);
                    }}
                  >
                    remove
                  </button>
                </div>
              </div>
              <div key={"_" + i} className="requests row err">
                {state.showErrors ? <div>{state.errs[i]}</div> : null}
              </div>
            </>
          );
        })}
      </form>
      <div className="flx">
        <div className="header">CREATE REQUEST</div>
        <button onClick={addRequest}>+</button>
        {state.requests.length ? (
          <button onClick={submitRequests}>Submit Requests</button>
        ) : null}
      </div>
    </div>
  );
};

export default TradingCreate;
