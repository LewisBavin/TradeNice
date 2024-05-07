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
import { accountActions, readAccount } from "../../../Slices/AccountSlice";

const Agreed = ({ account, users }) => {
  const dispatch = useDispatch();
  const [matched, setMatched] = useState([]);
  const [splits, setSplits] = useState({ Buys: [], Sells: [] });
  const [dates, setDates] = useState({
    start_date: format(new Date(), "yyyy-MM-dd"),
    end_date: format(new Date(), "yyyy-MM-dd"),
  });
  const [err, setErr] = useState(null);

  useEffect(() => {
    let Buys = [...matched].filter(
        (t) =>
          (t.user_id == account.user.user_id && t.direction == "B") ||
          (t.counter_id == account.user.user_id && t.direction == "S")
      ),
      Sells = [...matched].filter(
        (t) =>
          (t.user_id == account.user.user_id && t.direction == "S") ||
          (t.counter_id == account.user.user_id && t.direction == "B")
      );
    setSplits({ Buys, Sells });
  }, [matched]);

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

  let getMatched = async (e) => {
    e.preventDefault();
    let { matched } = (
      await axios.get("http://localhost:6002/user/get/matched", {
        headers: {
          token: account.user.token,
          ...dates,
        },
      })
    ).data;
    setMatched(matched);
  };

  let toggleCheck = (key, i) => {
    let temp = [...splits[key]]
    temp[i].checked = !temp[i].checked
    setSplits({...splits, [key]: temp})
  };

  let addComment = (e, key,i) => {
    let temp = [...splits[key]]
    temp[i].comment = e.target.value
    setSplits({...splits, [key]: temp})
  };

  let userName = (userID) =>
    userID == account.user.user_id
      ? account.user.name
      : users.find((u) => u.id == userID).name;

  let submit = matched.some((t) => t.checked);
  let haultSubmit = matched.some((t) => t.checked && !t.comment);

  let submitChanges = async () => {
    if (submit && !haultSubmit)
      try {
        let { response } = (
          await axios.post(
            "http://localhost:6002/user/requests/raiseDispute",
            { disputes: matched.filter((t) => t.checked) },
            {
              headers: { token: account.user.token },
            }
          )
        ).data;
        if (response) {
          dispatch(
            accountActions.setToast({
              trigger: true,
              strong: "Success!",
              body: "disputes raised with counterparty",
              variant: "success",
              delay: 5000,
            })
          );
        } else {
          dispatch(
            accountActions.setToast({
              trigger: true,
              strong: "Error!",
              body: "Error raising dispures",
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
      <Container>
        <Container className="text-center">
          <Row>
            <Form onSubmit={getMatched}>
              <Row>
                <Col className="text-primary d-flex justify-content-center align-items-center pt-3">
                  Filter Matched Trades
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
                    value={
                      !dates.start_date ? dates.end_date : dates.start_date
                    }
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
          <Row className="justify-content-md-center p-2">
            {submit && (
              <Button
                disabled={haultSubmit}
                variant={haultSubmit ? "danger" : "success"}
                onClick={submitChanges}
              >
                Send Disputes
              </Button>
            )}
          </Row>
        </Container>
      </Container>
      <Container>
        <Accordion>
          {Object.entries(splits).map(([key, arr], j) => {
            return (
              <Accordion.Item key={j}>
                <Accordion.Header>{key}</Accordion.Header>
                <Accordion.Body>
                  {arr.map((t, i) => (
                    <Form key={i} className=" col ai-c jc-c">
                      <div className="flx ai-c jc-c">
                        <FloatingLabel label="Id">
                          <Form.Control disabled defaultValue={t.id} />
                        </FloatingLabel>
                        <FloatingLabel label="User">
                          <Form.Control
                            disabled
                            defaultValue={userName(t.user_id)}
                          />
                        </FloatingLabel>
                        <FloatingLabel label="Dir">
                          <Form.Control disabled defaultValue={t.direction} />
                        </FloatingLabel>
                        <FloatingLabel label="Counter">
                          <Form.Control
                            disabled
                            defaultValue={userName(t.counter_id)}
                          />
                        </FloatingLabel>
                        <FloatingLabel label="Start">
                          <Form.Control
                            disabled
                            defaultValue={format(t.start_date, "yyyy-MM-dd")}
                          />
                        </FloatingLabel>
                        <FloatingLabel label="End">
                          <Form.Control
                            disabled
                            defaultValue={format(t.end_date, "yyyy-MM-dd")}
                          />
                        </FloatingLabel>
                        <FloatingLabel label="Vol / Day">
                          <Form.Control disabled defaultValue={t.volume} />
                        </FloatingLabel>
                        <FloatingLabel label="Price">
                          <Form.Control disabled defaultValue={t.price} />
                        </FloatingLabel>
                        <FloatingLabel label="Tot Vol">
                          <Form.Control
                            disabled
                            defaultValue={t.total_volume}
                          />
                        </FloatingLabel>
                        <FloatingLabel
                          label="Matched"
                          style={{ minWidth: "160px" }}
                        >
                          <Form.Control
                            disabled
                            defaultValue={format(
                              t.timestamp,
                              "yyyy-MM-dd HH:mm:ss"
                            )}
                          />
                        </FloatingLabel>
                        <Form.Check
                          type="checkbox"
                          label={String(!t.disputed ? "dispute" : "disputed")}
                          value={!t.disputed ? t.checked : true}
                          disabled={t.disputed}
                          onChange={() => toggleCheck(key, i)}
                        ></Form.Check>
                      </div>
                      {t.checked && (
                        <div>
                          <FloatingLabel label="Notify counterparty of your dispute, if they agree the trade will be removed from the system. Enter your comments here:">
                            <Form.Control
                              value={t.comment ? t.comment : ""}
                              onChange={(e)=>addComment(e,key, i)}
                            />
                          </FloatingLabel>
                        </div>
                      )}
                    </Form>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Container>
    </div>
  );
};

export default Agreed;
