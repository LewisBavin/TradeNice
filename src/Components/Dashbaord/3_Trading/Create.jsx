import axios from "axios";
import React, { createRef, useEffect, useState } from "react";
import { readAccount } from "../../../Utilities/Slices/AccountSlice";
import { useDispatch, useSelector } from "react-redux";
import ReactDatePicker from "react-datepicker";
import { differenceInDays, format, formatDate, toDate } from "date-fns";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

const Create = () => {
  const [state, setState] = useState({
    requests: [],
    errs: [],
    showErrors: false,
    validated: false,
    trySubmit: false,
    validate: true,
    requestCounts: [],
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
      success: null,
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
    let { status, err } = (
      await axios.post("http://localhost:6002/user/addRequest", requests, {
        headers: { token: account.user.token },
      })
    ).data;

    setState({
      requests: [],
      errs: [],
      showErrors: false,
      validated: false,
      trySubmit: false,
      validate: true,
      success: status
        ? "Requests uploaded successfully. Counterparties will be notified"
        : err,
    });
  };

  useEffect(
    /* updates errors and validated status, sends to back*/
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
        sendRequests({ requests: state.requests });
      }
    },
    [state.requests, state.trySubmit]
  );

  const requestParams = {
    direction: "Direction",
    userName: "Counterparty Name",
    counter_id: "Counterparty ID",
    start_date: "Start Date",
    end_date: "End Date",
    volume: "Daily Volume",
    total_volume: "Total Volume",
    price: "Price",
    remove: "",
  };

  !state.users ? getUsers() : null;
  let createAdd = !!state.requests.length;

  let handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
  };

  let handleChange = (e, i) => {
    console.log(e.target);
  };

  let addForm = () => {
    let requestCounts = [...state.requestCounts];
    requestCounts.push(null);
    setState({ ...state, requestCounts });
  };

  return (
    <div className="requests container flx col jc-c ai-c">
      <Form className="border border-light" onSubmit={handleSubmit}>
        {state.requestCounts.map((r, i) => {
          return (
            <Form.Group
              key={i}
              onChange={(e) => {
                handleChange(e, i);
              }}
            >
              <Container fluid>
                <Row className="py-2">
                  <Col>
                    <Form.Select
                      name="direction"
                      id={`${i}`}
                      defaultValue="Buy/Sell"
                    >
                      <option disabled>Buy/Sell</option>
                      <option>Buy</option>
                      <option>Sell</option>
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Select defaultValue="From/To" name="user_name">
                      <option disabled>From/To</option>
                      {state.users &&
                        state.users.map((u, k) => (
                          <option key={k} value={u.name}>
                            {u.name}
                          </option>
                        ))}
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Select defaultValue="User ID" name="user_id">
                      <option disabled>User ID</option>
                      {state.users &&
                        state.users.map((u, k) => (
                          <option key={k} value={u.id}>
                            {u.id}
                          </option>
                        ))}
                    </Form.Select>
                  </Col>
                </Row>
                <Row className="py-2">
                  <Col>
                    <div className="flx">
                      <Form.Text className="text-muted">Start Date</Form.Text>
                      <Form.Control
                        value={""}
                        type="date"
                        name="start_date"
                        onClick={() => {}}
                      />
                    </div>
                  </Col>
                  <Col>
                    <div className="flx">
                      <Form.Text className="text-muted">End Date</Form.Text>
                      <Form.Control type="date" name="end_date" />
                    </div>
                  </Col>
                </Row>
                <Row className="py-2">
                  <Col>
                    <Form.Control
                      type="number"
                      name="volume"
                      placeholder="Volume (Th/day)"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      name="total_volume"
                      placeholder="Total Volume (Th)"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      name="price"
                      placeholder="Price (£/Th)"
                    />
                  </Col>
                </Row>
              </Container>
            </Form.Group>
          );
        })}

        <div className="divider py-1 bg-secondary"></div>
        <Button type="submit">Submit</Button>
      </Form>

      <Button onClick={addForm}>+</Button>

      <Form onSubmit={handleSubmit}>
        <Form.Control type="number" />
        <Form.Control type="number" />
        <Form.Control type="number" />
        <Form.Control type="number" />

        <Button type="submit">Submit</Button>
      </Form>
      <form>
        {createAdd ? (
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
        ) : null}
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
      <div key={"k2"} className="flx">
        <div className="header">{!createAdd ? "CREATE" : "ADD"} REQUEST</div>
        <button onClick={addRequest}>+</button>
      </div>
      {state.requests.length ? (
        <button onClick={submitRequests}>Submit Requests</button>
      ) : null}
      {state.success ? (
        <>
          <div className="footer flx">
            <div className="message">{state.success}</div>
            <button>Go to Requests</button>
            <button>View Balance</button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Create;
