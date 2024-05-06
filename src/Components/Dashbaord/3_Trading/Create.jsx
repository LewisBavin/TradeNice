import axios from "axios";
import React, { useState } from "react";
import { accountActions, readAccount } from "../../../Slices/AccountSlice";
import { useDispatch, useSelector } from "react-redux";
import { differenceInDays, startOfDay, toDate } from "date-fns";
import {
  Button,
  Row,
  Col,
  Form,
  Container,
  FloatingLabel,
} from "react-bootstrap";

const Create = ({ account, users }) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    requests: [],
    errs: [],
    users
  });


  const requestParams = {
    direction: "",
    counter_id: "",
    user_name: "",
    start_date: "",
    end_date: "",
    volume: "",
    total_volume: "",
    price: "",
  };


  let addRequest = () => {
    let [requests, errs] = [[...state.requests], [...state.errs]];
    requests.push({ ...requestParams });
    errs.push({ ...requestParams });
    setState({
      ...state,
      requests,
      errs,
    });
  };

  let removeRequest = (i) => {
    let [requests, errs] = [[...state.requests], [...state.errs]];
    requests.splice(i, 1);
    errs.splice(i, 1);
    setState({
      ...state,
      requests,
      errs,
    });
  };

  let handleChange = (e, i) => {
    let [requests, errs] = [[...state.requests], [...state.errs]];
    let [request, err] = [requests[i], errs[i]];
    let [name, val, type] = [e.target.name, e.target.value, e.target.type];
    request[name] = val;

    switch (!!val) {
      case false:
        switch (type) {
          case "number":
            switch (name) {
              case "volume":
                err[name] =
                  val < 0 ? "must be +ve non-zero" : "must be none-zero";
                break;
              default:
                err[name] = "must be none-zero";
            }
            break;
          case "date": {
            err[name] = "invalid date";
            break;
          }
          default:
            err[name] = "please select";
        }
        break;
      default:
        err[name] = "";
        switch (type == "date" || name == "volume") {
          case true:
            let start = startOfDay(toDate(request.start_date));
            let end = startOfDay(toDate(request.end_date));
            let today = startOfDay(new Date());

            switch (type == "date") {
              case true:
                if (startOfDay(toDate(val)) < today) {
                  err[name] = "cannot be in past";
                  break;
                }
                switch (name) {
                  case "start_date":
                    if (!request.end_date || start > end) {
                      request.end_date = val;
                    }
                    break;
                  default:
                    if (!request.start_date || start > end) {
                      request.start_date = val;
                    }
                }
                break;
              default:
            }
            break;
          default:
            if (type == "number") {
              request[name] = Number(val);
            }
        }
    }
    if (name == "volume") {
      request[name] = Number(val);
    }
    if (name == "user_name") {
      request.counter_id = state.users.filter((u) => u.name == val)[0].id;
    }
    if (request.volume && request.start_date && request.end_date) {
      request.total_volume = Number(
        (differenceInDays(
          startOfDay(toDate(request.end_date)),
          startOfDay(toDate(request.start_date))
        ) +
          1) *
          request.volume
      );
    }
    setState({ ...state, requests, errs });
  };

  let handleSubmit = (e) => {
    e.preventDefault();
    sendRequests(state.requests);
  };

  let sendRequests = async (requests) => {
    try {
      let { results, err } = (
        await axios.post(
          "http://localhost:6002/user/requests/add",
          { requests },
          {
            headers: { token: account.user.token },
          }
        )
      ).data;
      if (results) {
        let { insertId, affectedRows } = results;
        setState({ ...state, requests: [] });
        dispatch(
          accountActions.setToast({
            trigger: true,
            strong: "Success!",
            small: "requests sumbited",
            body: `Go to pending to view - request ID(s): ${insertId} to ${
              insertId + affectedRows - 1
            }`,
            variant: "success",
            delay: 6000,
          })
        );
      }
      if (err) {
        dispatch(
          accountActions.setToast({
            trigger: true,
            strong: "Error!",
            small: "Bad Form Data",
            body: `Please review your inputs`,
            variant: "danger",
            delay: 6000,
          })
        );
      }
    } catch (e) {
      dispatch(
        accountActions.setToast({
          trigger: true,
          strong: "Error!",
          small: "Connection Error",
          body: `Please contact admin`,
          variant: "warning",
          delay: 6000,
        })
      );
    }
  };

  let areErrors = state.errs.some((err) =>
    Object.values(err).some((val) => !!val)
  );
  let isBlanks = state.requests.some((req) =>
    Object.values(req).some((val) => !val)
  );

  return (
    <>
      <div className="requests container col flx jc-c ai-c">
        <Button onClick={addRequest} variant="outline-success" className="my-1">
          +
        </Button>
        <Button
          hidden={!state.requests.length}
          disabled={isBlanks || areErrors}
          variant={isBlanks || areErrors ? "danger" : "success"}
          onClick={handleSubmit}
          className="my-1"
        >
          Submit
        </Button>
        <Form className="border border-light d-flex">
          {state.requests.map((request, i) => {
            let errs = [...state.errs][i];
            return (
              <Form.Group
                key={i}
                onChange={(e) => {
                  handleChange(e, i);
                }}
              >
                <Container fluid>
                  <FloatingLabel label="direction">
                    <Form.Select
                      name="direction"
                      defaultValue={request.direction}
                    >
                      <option value="" disabled>
                        Buy/Sell
                      </option>
                      <option>Buy</option>
                      <option>Sell</option>
                    </Form.Select>
                    <Form.Text className="text-danger">
                      {errs.direction}
                    </Form.Text>
                  </FloatingLabel>

                  <FloatingLabel label="counterparty">
                    <Form.Select
                      defaultValue={request.user_name}
                      name="user_name"
                    >
                      <option value="" disabled>
                        From/To
                      </option>
                      {state.users &&
                        state.users.map((u, k) => (
                          <option key={k} value={u.name}>
                            {u.name}
                          </option>
                        ))}
                    </Form.Select>
                    <Form.Text className="text-danger">
                      {errs.user_name}
                    </Form.Text>
                  </FloatingLabel>

                  <FloatingLabel label="counter id">
                    <Form.Control
                      defaultValue={request.counter_id}
                      name="counter_id"
                      disabled
                      placeholder="Counter ID"
                    ></Form.Control>
                  </FloatingLabel>

                  <FloatingLabel label="start">
                    <Form.Control
                      type="date"
                      name="start_date"
                      defaultValue={request.start_date}
                    />

                    <Form.Text className="text-danger">
                      {errs.start_date}
                    </Form.Text>
                  </FloatingLabel>

                  <FloatingLabel label="end">
                    <Form.Control
                      type="date"
                      name="end_date"
                      defaultValue={request.end_date}
                    />
                    <Form.Text className="text-danger">
                      {errs.end_date}
                    </Form.Text>
                  </FloatingLabel>

                  <FloatingLabel label="volume Th/day">
                    <Form.Control
                      type="number"
                      name="volume"
                      defaultValue={request.volume}
                      disabled={!request.start_date || !request.end_date}
                      placeholder="Volume"
                    />

                    <Form.Text className="text-danger">{errs.volume}</Form.Text>
                  </FloatingLabel>

                  <FloatingLabel label="price p/Th" className="text-wrap">
                    <Form.Control
                      type="number"
                      name="price"
                      defaultValue={request.price}
                      disabled={!request.start_date || !request.end_date}
                      placeholder="Price"
                    />

                    <Form.Text className="text-danger">{errs.price}</Form.Text>
                  </FloatingLabel>

                  <FloatingLabel label="total vol Th">
                    <Form.Control
                      type="number"
                      name="total_volume"
                      disabled
                      readOnly
                      defaultValue={request.total_volume}
                      placeholder="Total Volume"
                    />
                  </FloatingLabel>
                  <Button
                    onClick={() => {
                      removeRequest(i);
                    }}
                    variant="outline-danger"
                  >
                    -
                  </Button>
                </Container>
              </Form.Group>
            );
          })}
        </Form>
      </div>
    </>
  );
};

export default Create;
