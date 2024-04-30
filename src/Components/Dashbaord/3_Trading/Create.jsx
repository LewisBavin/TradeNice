import axios from "axios";
import React, { useState } from "react";
import {
  accountActions,
  readAccount,
} from "../../../Utilities/Slices/AccountSlice";
import { useDispatch, useSelector } from "react-redux";
import { differenceInDays, startOfDay, toDate } from "date-fns";
import {
  Button,
  Row,
  Col,
  Form,
  Container,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import MyToast from "../../MyToast";

const Create = () => {
  const dispatch = useDispatch();
  let account = useSelector(readAccount);
  const [state, setState] = useState({
    requests: [],
    errs: [],
    users: account.users,
    toast: {},
  });

  const [show, setShow] = useState(false);

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

            switch (type == "date") {
              case true:
                let today = startOfDay(new Date());
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
                request.total_volume = Number(
                  (differenceInDays(end, start) + 1) * val
                );
            }
            break;
          default:
            if (type == "number") {
              request[name] = Number(val);
            }
            if (name == "user_name") {
              request.counter_id = state.users.filter(
                (u) => u.name == val
              )[0].id;
            }
        }
    }
    if (name == "volume") {
      request[name] = Number(val);
    }
    setState({ ...state, requests, errs });
  };

  let handleSubmit = (e) => {
    e.preventDefault();
    sendRequests(state.requests);
  };

  let sendRequests = async (requests) => {
    try {
      let { status, err } = (
        await axios.post(
          "http://localhost:6002/user/addRequest",
          { requests },
          {
            headers: { token: account.user.token },
          }
        )
      ).data;
      let strong = !!err ? "Error! Bad Form Data" : "Success!";
      let body = !!err ? "Requests failed to submit" : "Requests submitted!";
      let variant = !!err ? "danger" : "success";
      let toast = { ...state.toast, strong, body, variant, showToast: true };
      setState({ ...state, toast });
    } catch (e) {
      let strong = "Connection Error!";
      let body = "Couldn't connect to database. Requests not submitted";
      let variant = "danger";
      let toast = { ...state.toast, strong, body, variant, showToast: true };
      setState({ ...state, toast });
    } finally {
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
        <Form className="border border-light" onSubmit={handleSubmit}>
          {state.requests.map((request, i) => {
            let errs = [...state.errs][i];

            return (
              <Form.Group key={i}>
                <Container fluid>
                  <Row>
                    <Col className="position-relative">
                      <Button
                        onClick={()=>{removeRequest(i)}}
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
                            value={request.direction}
                            onChange={(e) => {
                              handleChange(e, i);
                            }}
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
                            value={request.user_name}
                            name="user_name"
                            onChange={(e) => {
                              handleChange(e, i);
                            }}
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
                          <Form.Select
                            value={request.counter_id}
                            name="counter_id"
                            disabled
                            onChange={(e) => {
                              handleChange(e, i);
                            }}
                          >
                            <option value="" disabled>
                              Counter ID
                            </option>
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
                            <Form.Text className="text-muted">
                              Start Date
                            </Form.Text>
                            <Form.Control
                              type="date"
                              name="start_date"
                              value={request.start_date}
                              onChange={(e) => {
                                handleChange(e, i);
                              }}
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
                              value={request.end_date}
                              onChange={(e) => {
                                handleChange(e, i);
                              }}
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
                              value={request.volume}
                              disabled={
                                !request.start_date || !request.end_date
                              }
                              placeholder="Volume"
                              onChange={(e) => {
                                handleChange(e, i);
                              }}
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
                              value={request.price}
                              disabled={
                                !request.start_date || !request.end_date
                              }
                              placeholder="Price"
                              onChange={(e) => {
                                handleChange(e, i);
                              }}
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
                              value={request.total_volume}
                              placeholder="Total Volume"
                              onChange={(e) => {
                                handleChange(e, i);
                              }}
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
              <Col className="position-relative">
                <Button
                  hidden={!state.requests.length}
                  disabled={isBlanks || areErrors}
                  type="Submit"
                  variant={isBlanks || areErrors ? "danger" : "success"}
                  className="position-absolute start-50 translate-middle-x"
                >
                  Submit
                </Button>
                <Button
                  onClick={addRequest}
                  variant="outline-success"
                  className="position-absolute end-0"
                >
                  +
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </div>
      {state.toast.showToast && <MyToast toastSettings={{ ...state.toast }} />}
    </>
  );
};

export default Create;
