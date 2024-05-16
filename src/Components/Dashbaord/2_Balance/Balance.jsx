import axios from "axios";
import { addDays, format, startOfDay, toDate } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import DailyPrice from "../1_Market/DailyPrice";
import { getStore } from "../../../Utilities/localStorage";
import { numberWithCommas } from "../../../Utilities/usefulFuncs";
import { number } from "joi";

const Balance = ({ account, users }) => {
  const mainKeys = ["Inputs", "Outputs"];
  const innerKeys = ["Transputs", "Trades"];
  const babyKeys = ["Nominations", "Allocations"];
  const [transputs, setTransputs] = useState([]);
  const [trades, setTrades] = useState([]);
  const [date, setDate] = useState(
    format(startOfDay(new Date()), "yyyy-MM-dd")
  );

  let filterData = (main, inner, baby) => {
    if (inner == "Transputs") {
      return transputs.filter(
        (t) => t.transput == (main == "Inputs" ? "I" : "O")
      );
    }

    return trades
      .filter((t) =>
        main == "Inputs"
          ? (t.user_id == account.user.user_id && t.direction == "B") ||
            (t.counter_id == account.user.user_id && t.direction == "S")
          : (t.user_id == account.user.user_id && t.direction == "S") ||
            (t.counter_id == account.user.user_id && t.direction == "B")
      )
      .filter((t) => (baby == "Allocations" ? t.accepted : t));
  };

  let nameData = (main, inner) => {
    return main == "Inputs"
      ? inner == "Transputs"
        ? "Grid Inputs"
        : "Trade Buys"
      : inner == "Transputs"
      ? "Grid Offtakes"
      : "Trade Sells";
  };

  useEffect(() => {
    (async function getData() {
      let { trades, transputs } = (
        await axios.get("http://localhost:6002/user/get/requests/valid", {
          headers: {
            token: account.user.token,
            start_date: date,
            end_date: date,
          },
        })
      ).data;

      setTrades(trades);
      setTransputs(transputs);
    })();
  }, [date]);

  const balance = mainKeys.reduce((mainAcum, main) => {
    mainAcum[main] = innerKeys.reduce((innerAcum, inner) => {
      innerAcum[inner] = {
        ...babyKeys.reduce((babyAcum, baby) => {
          babyAcum[baby] = {
            details: filterData(main, inner, baby),
            total() {
              return this.details.reduce((acum, t) => acum + t.volume, 0);
            },
          };
          return babyAcum;
        }, {}),
        name: nameData(main, inner),
      };
      return innerAcum;
    }, {});
    return mainAcum;
  }, {});

  let cycleDates = (left = true) => {
    setDate(format(addDays(toDate(date), left ? -1 : 1), "yyyy-MM-dd"));
  };

  let toggleShow = (e) => {
    e.currentTarget.classList.toggle("show");
  };

  let userNames = (id) =>
    String(
      id
        ? id == account.user.user_id
          ? account.user.name
          : users.find((u) => u.id == id).name
        : ""
    );

  let ref = useRef();

  return (
    <div className="balance flx col ai-c jc-c">
      <div className="dates">
        <Form className="flx">
          <Button className="normal" onClick={cycleDates}>
            &larr;
          </Button>
          <FloatingLabel label="Gas Date">
            <Form.Control
              type="date"
              placeholder="yyyy-dd-mm"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </FloatingLabel>
          <Button className="normal" onClick={() => cycleDates(false)}>
            &rarr;
          </Button>
        </Form>
      </div>

      <Container className="balance accordionContainer flx col">
        <Row className="header">
          <Col>
            <Container>
              <Row>
                <Col xs={2}>
                  {" "}
                  <DailyPrice dateStr={date} small={"EoD"} />
                </Col>
                {babyKeys.map((babyKey, i) => (
                  <Col className="highlight" key={i}>
                    {babyKey + " (therms)"}
                  </Col>
                ))}
              </Row>
            </Container>
          </Col>
        </Row>
        {Object.entries(balance).map(([mainKey, mainObj], i) => (
          <Row key={i} className={mainKey}>
            <Col>
              <Container>
                <Row>
                  <Col>
                    <Accordion className="total">
                      <Accordion.Item>
                        <Accordion.Header>
                          <Container>
                            <Row className="totals">
                              <Col xs={2}>{"Total " + mainKey}</Col>
                              {babyKeys.map((babyKey, i) => (
                                <Col key={i}>
                                  {numberWithCommas(
                                    mainObj.Transputs[babyKey].total() +
                                      mainObj.Trades[babyKey].total()
                                  )}
                                </Col>
                              ))}
                            </Row>
                          </Container>
                        </Accordion.Header>
                        <Accordion.Body>
                          {Object.values(mainObj).map((innerObj, i) => (
                            <Accordion key={i} className="inner">
                              <Accordion.Item>
                                <Accordion.Header>
                                  <Container className="breakdowns">
                                    <Row>
                                      <Col xs={2}>{innerObj.name}</Col>
                                      {babyKeys.map((babyKey, i) => (
                                        <Col key={i}>
                                          {numberWithCommas(
                                            innerObj[babyKey].total()
                                          )}
                                        </Col>
                                      ))}
                                    </Row>
                                  </Container>
                                </Accordion.Header>
                                <Accordion.Body>
                                  <Container>
                                    <Row>
                                      <Col xs={2}></Col>
                                      {babyKeys.map((babyKey, i) => (
                                        <Col key={i}>
                                          <div className="flx col ai-c">
                                            {innerObj[babyKey].details.map(
                                              (t, i) => (
                                                <div className="flx" key={i}>
                                                  {numberWithCommas(t.volume)}
                                                  <div
                                                    onMouseEnter={toggleShow}
                                                    onMouseLeave={toggleShow}
                                                    className="detailsContainer"
                                                  >
                                                    <Button className="small flx jc-c ai-c">
                                                      i
                                                    </Button>
                                                    <Form className="details">
                                                      <div className="details">
                                                        <FloatingLabel label="ID">
                                                          <Form.Control
                                                            disabled
                                                            value={t.id}
                                                          />
                                                        </FloatingLabel>
                                                        <FloatingLabel label="Requested by">
                                                          <Form.Control
                                                            disabled
                                                            value={userNames(
                                                              t.user_id
                                                            )}
                                                          />
                                                          <FloatingLabel label="Direction">
                                                            <Form.Control
                                                              disabled
                                                              value={
                                                                t.direction ||
                                                                t.transput
                                                              }
                                                            />
                                                          </FloatingLabel>
                                                        </FloatingLabel>
                                                        <FloatingLabel
                                                          label={
                                                            babyKey ==
                                                            "Nominations"
                                                              ? "Counterparty"
                                                              : "Accepted By"
                                                          }
                                                        >
                                                          <Form.Control
                                                            disabled
                                                            value={
                                                              userNames(
                                                                t.counter_id
                                                              ) || "GRID"
                                                            }
                                                          />
                                                        </FloatingLabel>
                                                        <FloatingLabel label="Start">
                                                          <Form.Control
                                                            disabled
                                                            value={format(
                                                              toDate(
                                                                t.start_date
                                                              ),
                                                              "yyyy-MM-dd"
                                                            )}
                                                          />
                                                        </FloatingLabel>
                                                        <FloatingLabel label="End">
                                                          <Form.Control
                                                            disabled
                                                            value={format(
                                                              toDate(
                                                                t.end_date
                                                              ),
                                                              "yyyy-MM-dd"
                                                            )}
                                                          />
                                                        </FloatingLabel>
                                                        <FloatingLabel label="Daily Volume">
                                                          <Form.Control
                                                            disabled
                                                            value={numberWithCommas(
                                                              t.volume
                                                            )}
                                                          />
                                                        </FloatingLabel>
                                                        <FloatingLabel
                                                          label={
                                                            babyKey ==
                                                            "Nominations"
                                                              ? "Created"
                                                              : "Accepted"
                                                          }
                                                        >
                                                          <Form.Control
                                                            disabled
                                                            value={format(
                                                              toDate(
                                                                t.timestamp
                                                              ),
                                                              "yyyy-MM-dd hh:MM:ss"
                                                            )}
                                                          />
                                                        </FloatingLabel>
                                                      </div>
                                                    </Form>
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </Col>
                                      ))}
                                    </Row>
                                  </Container>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          ))}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        ))}
        <Row className="nets">
          <Col>
            <Container>
              <Row className="totals">
                <Col xs={2}>Net Balance (th)</Col>
                {babyKeys.map((key, i) => (
                  <Col key={i}>
                    {numberWithCommas(
                      balance.Inputs.Trades[key].total() +
                        balance.Inputs.Transputs[key].total() -
                        balance.Outputs.Trades[key].total() -
                        balance.Outputs.Transputs[key].total()
                    )}
                  </Col>
                ))}
              </Row>
            </Container>
          </Col>
        </Row>
        <Row className="imbalance">
          <Col>
            <Container>
              <Row className="totals">
                <Col xs={2}>Imabalancing (£)</Col>
                {babyKeys.map((key, i) => (
                  <Col key={i}>
                    {"£" +
                      numberWithCommas(
                        Math.round(
                          (balance.Inputs.Trades[key].total() +
                            balance.Inputs.Transputs[key].total() -
                            balance.Outputs.Trades[key].total() -
                            balance.Outputs.Transputs[key].total()) *
                            getStore("average")
                        ) / 100
                      )}
                  </Col>
                ))}
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Balance;
