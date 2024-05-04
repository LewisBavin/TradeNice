import axios from "axios";
import React, { useState } from "react";
import { accountActions, readAccount } from "../../../Slices/AccountSlice";
import { useDispatch, useSelector } from "react-redux";
import { differenceInDays, startOfDay, toDate } from "date-fns";
import { Button, Row, Col, Form, Container } from "react-bootstrap";

const Create = ({account}) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    requests: [],
    errs: [],
    users: account.users,
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

  let getUsers = async () => {
    let users = (
      await axios.get("http://localhost:6002/user/get/users", {
        headers: { token: account.user.token },
      })
    ).data.users;
    setState({ ...state, users });
    dispatch(accountActions.setUsers(users));
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

  !state.users ? getUsers() : null;

  let areErrors = state.errs.some((err) =>
    Object.values(err).some((val) => !!val)
  );
  let isBlanks = state.requests.some((req) =>
    Object.values(req).some((val) => !val)
  );

  return (
    <>
      <div className="requests container flx col jc-c ai-c">
        <Form
          className={state.requests.length ? "border border-light" : ""}
          onSubmit={handleSubmit}
        >
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
                  <Row>
                    <Col className="position-relative">
                      <Button
                        onClick={() => {
                          removeRequest(i);
                        }}
                        variant="outline-danger"
                        className="position-absolute top-50 start-50 translate-middle"
                      >
                        -
                      </Button>
                    </Col>
                    <Col xs={10}>
                      <Row className="py-2">
                        <Col>
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
                        </Col>
                        <Col>
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
                        </Col>
                        <Col>
                          <Form.Control
                            defaultValue={request.counter_id}
                            name="counter_id"
                            disabled
                            placeholder="Counter ID"
                          ></Form.Control>
                        </Col>
                      </Row>
                      <Row className="py-2">
                        <Col>
                          <div className="flx">
                            <Form.Text className="text-muted">
                              Start Date
                            </Form.Text>
                            <Form.Control
                              type="date"
                              name="start_date"
                              defaultValue={request.start_date}
                            />
                          </div>
                          <Form.Text className="text-danger">
                            {errs.start_date}
                          </Form.Text>
                        </Col>
                        <Col>
                          <div className="flx">
                            <Form.Text className="text-muted">
                              End Date
                            </Form.Text>
                            <Form.Control
                              type="date"
                              name="end_date"
                              defaultValue={request.end_date}
                            />
                          </div>
                          <Form.Text className="text-danger">
                            {errs.end_date}
                          </Form.Text>
                        </Col>
                      </Row>
                      <Row className="py-2">
                        <Col>
                          <div className="flx">
                            <Form.Control
                              type="number"
                              name="volume"
                              defaultValue={request.volume}
                              disabled={
                                !request.start_date || !request.end_date
                              }
                              placeholder="Volume"
                            />
                            <Form.Text className="text-muted">Th/day</Form.Text>
                          </div>
                          <Form.Text className="text-danger">
                            {errs.volume}
                          </Form.Text>
                        </Col>

                        <Col>
                          <div className="flx">
                            <Form.Text className="text-muted">£</Form.Text>
                            <Form.Control
                              type="number"
                              name="price"
                              defaultValue={request.price}
                              disabled={
                                !request.start_date || !request.end_date
                              }
                              placeholder="Price"
                            />
                            <Form.Text className="text-muted">/Th</Form.Text>
                          </div>
                          <Form.Text className="text-danger">
                            {errs.price}
                          </Form.Text>
                        </Col>
                        <Col>
                          <div className="flx">
                            <Form.Control
                              type="number"
                              name="total_volume"
                              disabled
                              readOnly
                              defaultValue={request.total_volume}
                              placeholder="Total Volume"
                            />
                            <Form.Text className="text-muted">Th</Form.Text>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Container>
                <div className="divider py-1 bg-secondary"></div>
              </Form.Group>
            );
          })}
          <Container fluid>
            <Row>
              <Col>
                <Button
                  onClick={addRequest}
                  variant="outline-success"
                  className=""
                >
                  +
                </Button>
              </Col>
              <Col>
                <Button
                  hidden={!state.requests.length}
                  disabled={isBlanks || areErrors}
                  type="Submit"
                  variant={isBlanks || areErrors ? "danger" : "success"}
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </div>
    </>
  );
};

export default Create;
