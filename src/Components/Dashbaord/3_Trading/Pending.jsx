import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Col,
  Row,
  Container,
  Form,
  Button,
  Accordion,
  FloatingLabel,
} from "react-bootstrap";
import { differenceInDays, format, startOfDay, toDate } from "date-fns";
import { useDispatch } from "react-redux";
import { accountActions } from "../../../Slices/AccountSlice";

const Pending = ({ account, users }) => {
  const dispatch = useDispatch();
  const [dates, setDates] = useState({
    start_date: format(new Date(), "yyyy-MM-dd"),
    end_date: format(new Date(), "yyyy-MM-dd"),
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
    if (start < today || end < today) {
      msg = "dates in the past will have timed out.";
    }
    setDates(temp);
    setErr(msg);
  };

  let getRequests = async (e) => {
    e.preventDefault();
    let { status, err, inputs, outputs } = (
      await axios.get("http://localhost:6002/user/get/Requests/pending", {
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
    let temp = { inputs: [...requests.inputs], outputs: [...requests.outputs] };
    let inputs = [...temp.inputs],
      outputs = [...temp.outputs];
    let inputReq = inputs[inputs.findIndex((el) => id == el.id)];
    let outputReq = inputs[inputs.findIndex((el) => id == el.id)];
    let req = !inputReq ? outputReq : inputReq;
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

  let requestElement = (req, user = true, i) => {
    let {
      id,
      direction,
      start_date,
      end_date,
      volume,
      total_volume,
      price,
      edit,
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
      <Form
        key={i}
        className="flx jc-c ai-c"
        onChange={(e) => {
          reqAction(e, id);
        }}
      >
        <FloatingLabel label="Id">
          <Form.Control
            name="id"
            disabled
            defaultValue={id}
            className={style && styles[style]}
          />
        </FloatingLabel>

        <FloatingLabel label="Dir">
          <Form.Control
            name="direction"
            disabled
            defaultValue={direction}
            className={style && styles[style]}
          />
        </FloatingLabel>

        <FloatingLabel label="Start">
          <Form.Control
            type="date"
            name="start_date"
            disabled
            className={style && styles[style]}
            defaultValue={format(start_date, "yyyy-MM-dd")}
          />
        </FloatingLabel>

        <FloatingLabel label="End">
          <Form.Control
            type="date"
            name="end_date"
            disabled
            className={style && styles[style]}
            defaultValue={format(end_date, "yyyy-MM-dd")}
          />
        </FloatingLabel>

        <FloatingLabel label="Vol / Day">
          <Form.Control
            disabled={!user || !edit}
            name="volume"
            type="number"
            value={volume}
            className={style && styles[style]}
          />
        </FloatingLabel>

        <FloatingLabel label="Price">
          <Form.Control
            disabled={!user || !edit}
            name="price"
            type="number"
            className={style && styles[style]}
            value={price}
          />
        </FloatingLabel>

        <FloatingLabel label="Tot Vol">
          <Form.Control
            name="total_volume"
            type="number"
            disabled
            className={style && styles[style]}
            value={total_volume}
          />
        </FloatingLabel>

        <Form.Select
          name="action"
          className="text-center text-info"
          style={{ maxWidth: "120px" }}
          value={style ? style : ""}
          onChange={() => {}}
        >
          <option
            disabled={!style}
            onClick={(e) => {
              reqRevert(e, id);
            }}
            value=""
          >
            {style ? "Cancel" : "Action"}
          </option>
          {user && (
            <option value="edit">{style ? <>Edit &darr;</> : "Edit"}</option>
          )}
          {user && (
            <option value="remove">
              {style ? <>Remove &darr;</> : "Remove"}
            </option>
          )}
          {!user && (
            <option value="accept">
              {style ? <>Accept &darr;</> : "Accept"}
            </option>
          )}
          {!user && (
            <option value="reject">
              {style ? <>Reject &darr;</> : "Reject"}
            </option>
          )}
        </Form.Select>
      </Form>
    );
  };

  let submitChanges = async () => {
    try {
      let response = (
        await axios.post(
          "http://localhost:6002/user/requests/changes",
          { submits },
          {
            headers: { token: account.user.token },
          }
        )
      ).data;
      if (response) {
        let body = Object.keys(response).reduce((accum, val) => {
          let rows = response[val].affectedRows;
          accum = `${accum}
          ${rows} ${val} actioned successfully.`;

          return accum;
        }, "");
        setRequests({ inputs: [], outputs: [] });

        dispatch(
          accountActions.setToast({
            trigger: true,
            strong: "Success!",
            body,
            variant: "success",
            delay: 5000,
          })
        );
      } else {
        dispatch(
          accountActions.setToast({
            trigger: true,
            strong: "Error!",
            body: "Nothing was changed",
            variant: "danger",
          })
        );
      }
    } catch (e) {
      dispatch(
        accountActions.setToast({
          trigger: true,
          strong: "Error!",
          small: "connection error",
          body: "please contact admin",
          variant: "warning",
        })
      );
    }
  };

  return (
    <div className="flx jc-c ai-c col">
      <Container className="dates">
        <div className="flx jc-c text-warning">{err}</div>
        <Form
          className="d-flex justify-content-md-center"
          onSubmit={getRequests}
        >
          <FloatingLabel label="start">
            <Form.Control
              type="date"
              name="start_date"
              value={!dates.start_date ? dates.end_date : dates.start_date}
              onChange={updateDates}
            />
          </FloatingLabel>

          <FloatingLabel label="end">
            <Form.Control
              type="date"
              name="end_date"
              value={!dates.end_date ? dates.start_date : dates.end_date}
              onChange={updateDates}
            />
          </FloatingLabel>
          <Button
            type="submit"
            disabled={!!err}
            variant={!!err ? "danger" : "success"}
          >
            Go
          </Button>
        </Form>

        <Container>
          <Row className="justify-content-md-center p-2">
            {submit && (
              <Button variant="success" onClick={submitChanges}>
                Save Changes
              </Button>
            )}
          </Row>
        </Container>
      </Container>
      <div className="accordionContainer">
        <div className="Inputs">
          <Accordion className="total">
            <Accordion.Item>
              <Accordion.Header>Inputs</Accordion.Header>
              <Accordion.Body>
                <Accordion className="inner">
                  <Accordion.Item>
                    <Accordion.Header>Your Bids</Accordion.Header>
                    <Accordion.Body>
                      {Object.entries(groupedUserBids).map(([id, reqs], i) => (
                        <Accordion key={i}>
                          <Accordion.Item>
                            <Accordion.Header>
                              {users.find((user) => user.id == id).name}
                            </Accordion.Header>
                            <Accordion.Body>
                              {reqs.map((req, i) =>
                                requestElement(req, true, i)
                              )}
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item>
                    <Accordion.Header>Counterparty Offers</Accordion.Header>
                    <Accordion.Body>
                      {Object.entries(groupedCounterOffers).map(
                        ([id, reqs], i) => (
                          <Accordion key={i}>
                            <Accordion.Item>
                              <Accordion.Header>
                                {users.find((user) => user.id == id).name}
                              </Accordion.Header>
                              <Accordion.Body>
                                {reqs.map((req, i) =>
                                  requestElement(req, false, i)
                                )}
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        )
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
        <div className="Outputs">
          <Accordion className="total">
            <Accordion.Item>
              <Accordion.Header>Outputs</Accordion.Header>
              <Accordion.Body>
                <Accordion className="inner">
                  <Accordion.Item>
                    <Accordion.Header>Your Offers</Accordion.Header>
                    <Accordion.Body>
                      {Object.entries(groupedUserOffers).map(
                        ([id, reqs], i) => (
                          <Accordion key={i}>
                            <Accordion.Item>
                              <Accordion.Header>
                                {users.find((user) => user.id == id).name}
                              </Accordion.Header>
                              <Accordion.Body>
                                {reqs.map((req, i) =>
                                  requestElement(req, true, i)
                                )}
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        )
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item>
                    <Accordion.Header>Counterparty Bids</Accordion.Header>
                    <Accordion.Body>
                      {Object.entries(groupedCounterBids).map(
                        ([id, reqs], i) => (
                          <Accordion key={i}>
                            <Accordion.Item>
                              <Accordion.Header>
                                {users.find((user) => user.id == id).name}
                              </Accordion.Header>
                              <Accordion.Body>
                                {reqs.map((req, i) =>
                                  requestElement(req, false, i)
                                )}
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        )
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Pending;
