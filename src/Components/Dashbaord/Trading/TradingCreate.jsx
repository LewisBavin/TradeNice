import axios from "axios";
import React, { createRef, useEffect, useState } from "react";
import {
  accountActions,
  readAccount,
} from "../../../Utilities/Slices/AccountSlice";
import { useDispatch, useSelector } from "react-redux";
import ReactDatePicker from "react-datepicker";
import { differenceInDays, format, formatDate, toDate } from "date-fns";

const TradingCreate = () => {
  const [state, setState] = useState({ requests: [] });
  let account = useSelector(readAccount);

  let getUsers = async () => {
    let users = (
      await axios.get("http://localhost:6002/user/get/users", {
        headers: { token: account.user.token },
      })
    ).data.users;
    setState({ ...state, users });
  };

  !state.users ? getUsers() : null;

  let addRequest = () => {
    let requests = state.requests;
    requests.push({
      direction: "",
      counter_id: "",
      userName: "",
      start_date: "",
      end_date: "",
      volume: "",
      totalVolume: 0,
      price: "",
    });
    setState({ ...state, requests });
  };

  let removeRequest = (i) => {
    let requests = [...state.requests];
    requests.splice(i, 1);
    setState({ ...state, requests });
  };

  let updateRequest = (args) => {
    let requests = [...state.requests];
    let { e, i, date, name } = args;
    let request = requests[i];
    if (date && name) {
      request[name] = format(date, "yyyy-MM-dd");
    } else {
      request[e.currentTarget.name] = e.currentTarget.value;
    }
    request = setDependencies(request);
    setState({ ...state, requests });
  };

  let setDependencies = (request) => {
    let { userName, start_date, end_date, volume } = request;
    if (!!userName) {
      request.counter_id = state.users.filter((u) => u.name == userName)[0].id;
    }
    if (!!start_date && !!end_date) {
      let d1 = toDate(request.start_date),
        d2 = toDate(request.end_date);
      let diff = differenceInDays(Math.max(d1, d2), Math.min(d1, d2));
      diff++;
      console.log(diff, volume);
      request.totalVolume = diff * volume;
    }
    return request;
  };

  return (
    <>
      <form>
        {state.requests.map((r, i) => {
          return (
            <div key={i} className="requests flx jc-sa" id={"request_" + i}>
              <div>
                {!i && <div>Direction</div>}
                <label htmlFor={"direction_" + i}></label>
                <select
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
              <div>
                {!i && <div>Counterparty</div>}

                <label htmlFor={"userName_" + i}></label>
                <select
                  name="userName"
                  id={"userName_" + i}
                  onChange={(e) => {
                    updateRequest({ e, i });
                  }}
                >
                  <option value=""></option>
                  {state.users.map((u, i) => (
                    <option key={i} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                {!i && <div>Counter Id</div>}
                <label htmlFor={"counter_id_" + i}></label>
                <select
                  name="userName"
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
              <div>
                {!i && <div>Start Date</div>}
                <ReactDatePicker
                  id={"start_date_" + i}
                  value={state.requests[i].start_date}
                  dateFormat={"yyyy-mm-dd"}
                  name="start_date"
                  onChange={(date) => {
                    updateRequest({ date, name: "start_date", i });
                  }}
                  className="requestInput"
                />
              </div>
              <div>
                {!i && <div>End Date</div>}
                <ReactDatePicker
                  id={"end_date_" + i}
                  value={state.requests[i].end_date}
                  dateFormat={"yyyy-mm-dd"}
                  onChange={(date) => {
                    updateRequest({ date, name: "end_date", i });
                  }}
                  className="requestInput"
                />
              </div>
              <div>
                {!i && <div>Daily Volume</div>}
                <input
                  id={"volume_" + i}
                  type="number"
                  name="volume"
                  value={state.requests[i].dailyVolume}
                  className="requestInput"
                  onChange={(e) => {
                    updateRequest({ e, i });
                  }}
                />
              </div>
              <div>
                {!i && <div>Total Volume</div>}
                <input
                  id={"totalVolume_" + i}
                  type="number"
                  name="totalVolume"
                  readOnly
                  disabled
                  value={state.requests[i].totalVolume}
                  className="requestInput"
                />
              </div>
              <div>
                {!i && <div>Price</div>}
                <input
                  id={"price_" + i}
                  type="number"
                  name="price"
                  value={state.requests[i].price}
                  className="requestInput"
                  onChange={(e) => {
                    updateRequest({ e, i });
                  }}
                />
              </div>
              <div>
                {!i && <div>Remove</div>}
                <button
                  className="requestInput"
                  onClick={(e) => {
                    e.preventDefault();
                    removeRequest(i);
                  }}
                >
                  remove
                </button>
              </div>
            </div>
          );
        })}
      </form>
      <div className="flx">
        <div className="header">CREATE REQUEST</div>
        <button onClick={addRequest}>+</button>
      </div>
      <button>Submit Requests</button>
    </>
  );
};

export default TradingCreate;
