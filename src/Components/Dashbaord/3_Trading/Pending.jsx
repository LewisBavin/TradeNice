import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row, Container, Form, Button } from "react-bootstrap";
import { differenceInDays, format, startOfDay, toDate } from "date-fns";

const Pending = ({ account }) => {
  const [dates, setDates] = useState({
    start_date: format(new Date(2024, 3, 29), "yyyy-MM-dd"),
    end_date: format(new Date(2024, 4, 12), "yyyy-MM-dd"),
  });
  const [err, setErr] = useState(null);
  const [requests, setRequests] = useState({ inputs: [], outputs: [] });
  const [submit, setSubmit] = useState(false);
  const [submits, setSubmits] = useState({});

  useEffect(() => {
    let temp = [...requests.inputs, ...requests.outputs];
    let submits = temp.reduce(
      (accum, req) => {
        req.edit ? accum.edits.push(req.edit) : null;
        req.remove ? accum.removes.push(req) : null;
        req.accept ? accum.accepts.push(req) : null;
        req.reject ? accum.rejects.push(req) : null;
        return accum;
      },
      { edits: [], removes: [], rejects: [], accepts: [] }
    );
    setSubmit(Object.keys(submits).some((key) => submits[key].length));
    setSubmits(submits);
  }, [requests]);

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

  let reqRevert = (e, id) => {
    let eVal = e.target.value;
    let eName = e.target.name;
    let temp = { inputs: [...requests.inputs], outputs: [...requests.outputs] };
    let req =
      temp.inputs.find((el) => id == el.id) ||
      temp.outputs.find((el) => id == el.id);
    req.remove ? delete req.remove : null;
    req.accept ? delete req.accept : null;
    req.reject ? delete req.reject : null;
    req.edit ? delete req.edit : null;
    setRequests({ ...requests, ...temp });
  };

  let reqAction = (e, id) => {
    let eVal = e.target.value;
    let eName = e.target.name;

    let temp = { inputs: [...requests.inputs], outputs: [...requests.outputs] };
    let req =
      temp.inputs.find((el) => id == el.id) ||
      temp.outputs.find((el) => id == el.id);

    if (eName == "action") {
      req.edit = eVal == "edit";
      req.remove = eVal == "remove";
      req.accept = eVal == "accept";
      req.reject = eVal == "reject";
      req[eVal] = eVal;
    }
    if (!!req.edit) {
      let edits =
        req.edit == "edit"
          ? { ...req, [eName]: eVal }
          : { ...req.edit, [eName]: eVal };
      edits.total_volume =
        (differenceInDays(edits.end_date, edits.start_date) + 1) * edits.volume;
      req.edit = { ...edits };
    }
    setRequests({ ...requests, ...temp });
  };

  let requestElement = (req, user = true) => {
    let {
      id,
      direction,
      start_date,
      end_date,
      volume,
      total_volume,
      price,
      edit,
      accept,
      reject,
      cancel,
      remove,
    } = req;
    req.edit ? ({ volume, total_volume, price } = req.edit) : null;

    let styles = {
      accept: "text-success",
      reject: "text-warning",
      remove: "text-danger strikethrough",
      edit: "text-primary",
    };
    let style = Object.keys(styles).find((style) => !!req[style]);
    return (
      <Form>
        <Row>
          <Col xs={1}>
            <Form.Control
              name="id"
              disabled
              value={id}
              className={style && styles[style]}
              onChange={(e) => {
                reqAction(e, id);
              }}
            />
          </Col>
          <Col xs={1}>
            <Form.Control
              name="direction"
              disabled
              value={direction}
              className={style && styles[style]}
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
              className={style && styles[style]}
              value={format(start_date, "yyyy-MM-dd")}
              onChange={(e) => {
                reqAction(e, id);
              }}
            />
          </Col>
          <Col xs={2}>
            <Form.Control
              type="date"
              name="end_date"
              disabled
              className={style && styles[style]}
              value={format(end_date, "yyyy-MM-dd")}
              onChange={(e) => {
                reqAction(e, id);
              }}
            />
          </Col>
          <Col xs={2}>
            <Form.Control
              disabled={!user || !edit}
              name="volume"
              type="number"
              value={volume}
              className={style && styles[style]}
              onChange={(e) => {
                reqAction(e, id);
              }}
            />
          </Col>

          <Col>
            <Form.Control
              disabled={!user || !edit}
              name="price"
              type="number"
              className={style && styles[style]}
              value={price}
              onChange={(e) => {
                reqAction(e, id);
              }}
            />
          </Col>

          <Col xs={2}>
            <Form.Control
              name="total_volume"
              type="number"
              disabled
              className={style && styles[style]}
              value={total_volume}
              onChange={(e) => {
                reqAction(e, id);
              }}
            />
          </Col>
          <Col xs={1}>
            <Form.Select
              name="action"
              className="text-center"
              onChange={(e) => {
                reqAction(e, id);
              }}
              defaultValue={style ? style : ""}
            >
              <option value="" disabled>
                &darr;
              </option>
              {user && <option value="edit">edit</option>}
              {user && <option value="remove">remove</option>}
              {!user && <option value="accept">accept</option>}
              {!user && <option value="reject">reject</option>}
            </Form.Select>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center pb-3">
          <Col xs={1}>
            {(req.edit || req.accept || req.remove || req.reject) && (
              <Button
                onClick={(e) => {
                  reqRevert(e, id);
                }}
              >
                Cancel
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    );
  };
  let submitChanges = async () => {
    if (submits.removes.length) {
      await axios.post(
        "http://localhost:6002/user/requests/remove",
        { submits },
        {
          headers: { token: account.user.token },
        }
      );
    }
    if (submits.rejects.length) {
      await axios.post(
        "http://localhost:6002/user/requests/reject",
        { submits },
        {
          headers: { token: account.user.token },
        }
      );
    }
    if (submits.accepts.length) {
      await axios.post(
        "http://localhost:6002/user/requests/accept",
        { submits },
        {
          headers: { token: account.user.token },
        }
      );
    }
  };
  return (
    <>
      <Container className="text-center">
        <Row>
          <Form onSubmit={getRequests}>
            <Row>
              <Col className="text-primary d-flex justify-content-center align-items-center pt-3">
                Filter bids & offers
              </Col>
            </Row>
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
        <Row className="justify-content-md-center px-5">
          {submit && (
            <Button variant="success" onClick={submitChanges}>
              Save Changes
            </Button>
          )}
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
