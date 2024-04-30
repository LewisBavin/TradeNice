import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row, Container, Form, Button } from "react-bootstrap";
import { format, startOfDay, toDate } from "date-fns";

const Pending = ({ account }) => {
  const [dates, setDates] = useState({
    start_date: format(new Date(2024, 3, 29), "yyyy-MM-dd"),
    end_date: format(new Date(2024, 4, 12), "yyyy-MM-dd"),
  });
  const [err, setErr] = useState(null);
  const [requests, setRequests] = useState({ inputs: [], outputs: [] });
  const [edited, edit] = useState([]);
  const [actions, setActions] = useState({
    edit: [],
    accept: [],
    reject: [],
    delete: [],
  });

  let updateDates = (e) => {
    let temp = { ...dates, [e.target.name]: e.target.value };
    let msg = null;
    let start = toDate(temp.start_date),
      end = toDate(temp.end_date),
      today = startOfDay(new Date());

    if (start == "Invalid Date" || end == "Invalid Date") {
      msg = "plese select valid dated";
    }
    if (start > end) {
      msg = "start must be before end";
    }
    /* if (start < today || end < today) {
      msg = "dates in the past will have timed out.";
    } */
    setDates(temp);
    setErr(msg);
  };

  let getRequests = async (e) => {
    e.preventDefault();
    let { status, err, inputs, outputs } = (
      await axios.get("http://localhost:6002/user/get/Requests", {
        headers: {
          token: account.user.token,
          ...dates /* start_date: toDate(dates.start_date), end_date: toDate(dates.end_date) */,
        },
      })
    ).data;
    setRequests({ inputs, outputs });
  };
  let { inputs, outputs } = requests;
  let { groupedUserBids, groupedCounterOffers } = inputs.reduce(
    (acum, req) => {
      req.direction == "B"
        ? (acum.groupedUserBids[req.counter_id] =
            acum.groupedUserBids[req.counter_id] || []).push(req)
        : (acum.groupedCounterOffers[req.user_id] =
            acum.groupedCounterOffers[req.user_id] || []).push(req);
      return acum;
    },
    { groupedUserBids: {}, groupedCounterOffers: {} }
  );
  let { groupedUserOffers, groupedCounterBids } = outputs.reduce(
    (acum, req) => {
      req.direction == "S"
        ? (acum.groupedUserOffers[req.counter_id] =
            acum.groupedUserOffers[req.counter_id] || []).push(req)
        : (acum.groupedCounterBids[req.user_id] =
            acum.groupedCounterBids[req.user_id] || []).push(req);
      return acum;
    },
    { groupedUserOffers: {}, groupedCounterBids: {} }
  );

  let reqAction = (e, i = 0) => {
    let action = e.target.value;
    let push = [...actions[action]];
    push.push(i);
    setActions({ ...actions, [action]: push });
  };
  console.log(actions.edit);
  let requestElement = (req, user = true) => {
    let { id, volume, total_volume, price } = { ...req };
    let editable = actions.edit.filter((i) => id == i).length;
    let edits = edited.filter((i) => i.id == id);
    let isEdited = edits.length;
    isEdited ? ({ volume, total_volume, price } = edits[0]) : null;

    return (
      <Form>
        <Row>
          <Col xs={1}>
            <Form.Control
              name="id"
              disabled
              value={req.id}
              onChange={(e) => {
                reqAction(e, id);
              }}
            />
          </Col>
          <Col xs={1}>
            <Form.Control
              name="direction"
              disabled
              value={req.direction}
              onChange={(e) => {
                reqAction(e, id);
              }}
            />
          </Col>
          <Col xs={2}>
            <Form.Control
              type="date"
              name="start_date"
              disabled
              onChange={(e) => {
                reqAction(e, id);
              }}
              value={format(req.start_date, "yyyy-MM-dd")}
            />
          </Col>
          <Col xs={2}>
            <Form.Control
              type="date"
              name="end_date"
              disabled
              onChange={(e) => {
                reqAction(e, id);
              }}
              value={format(req.end_date, "yyyy-MM-dd")}
            />
          </Col>
          <Col xs={2}>
            <Form.Control
              disabled={!user || !editable}
              name="volume"
              type="number"
              onChange={(e) => {
                reqAction(e, id);
              }}
              value={volume}
            />
          </Col>
          <Col xs={1}>
            <Form.Control
              disabled={!user || !editable}
              name="price"
              type="number"
              onChange={(e) => {
                reqAction(e, id);
              }}
              value={price}
            />
          </Col>
          <Col xs={2}>
            <Form.Control
              name="total_volume"
              type="number"
              disabled
              onChange={(e) => {
                reqAction(e, id);
              }}
              value={total_volume}
            />
          </Col>
          <Col xs={1}>
            <Form.Select
              onChange={(e) => {
                reqAction(e, id);
              }}
              value=""
            >
              <option value="" disabled>
                &darr;
              </option>
              {user && <option value="edit">edit</option>}
              {user && <option value="delete">delete</option>}
              {!user && <option value="accept">accept</option>}
              {!user && <option value="reject">reject</option>}
            </Form.Select>
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <>
      <Container className="text-center">
        <Row>
          <Form onSubmit={getRequests}>
            <Row>
              <Col className="text-danger d-flex justify-content-center align-items-center">
                {err}
              </Col>
            </Row>
            <Row className="d-flex justify-content-center py-3">
              <Col xs={3} className="d-flex align-items-center">
                <Form.Text className="text-muted">Start Date</Form.Text>
                <Form.Control
                  type="date"
                  name="start_date"
                  value={!dates.start_date ? dates.end_date : dates.start_date}
                  onChange={updateDates}
                />
              </Col>
              <Col xs={3} className="d-flex align-items-center">
                <Form.Text className="text-muted">End Date</Form.Text>
                <Form.Control
                  type="date"
                  name="end_date"
                  value={!dates.end_date ? dates.start_date : dates.end_date}
                  onChange={updateDates}
                />
              </Col>
              <Col xs={1} className="d-flex align-items-center">
                <Button
                  type="submit"
                  disabled={!!err}
                  variant={!!err ? "danger" : "success"}
                >
                  Go
                </Button>
              </Col>
            </Row>
          </Form>
        </Row>
      </Container>
      <Container>
        <Container>
          <Row>Inputs</Row>
          <Container>
            <Row>Your Bids</Row>
            {Object.entries(groupedUserBids).map(([name, reqs], i) => (
              <Container key={i}>
                <Row>{name}</Row>
                {reqs.map((req, i) => (
                  <Row key={i}>{requestElement(req)}</Row>
                ))}
              </Container>
            ))}
          </Container>
          <Container>
            <Row>Counterparty Offers</Row>
            {Object.entries(groupedCounterOffers).map(([name, reqs], i) => (
              <Container key={i}>
                <Row>{name}</Row>
                {reqs.map((req, i) => (
                  <Row key={i}>{requestElement(req, false)}</Row>
                ))}
              </Container>
            ))}
          </Container>
        </Container>
        <Container>
          <Row>Outputs</Row>
          <Container>
            <Row>Your Offers</Row>
            {Object.entries(groupedUserOffers).map(([name, reqs], i) => (
              <Container key={i}>
                <Row>{name}</Row>
                {reqs.map((req, i) => (
                  <Row key={i}>{requestElement(req)}</Row>
                ))}
              </Container>
            ))}
          </Container>
          <Container>
            <Row>Counterparty Bids</Row>
            {Object.entries(groupedCounterBids).map(([name, reqs], i) => (
              <Container key={i}>
                <Row>{name}</Row>
                {reqs.map((req, i) => (
                  <Row key={i}>{requestElement(req, false)}</Row>
                ))}
              </Container>
            ))}
          </Container>
        </Container>
      </Container>
    </>
  );
};

export default Pending;
