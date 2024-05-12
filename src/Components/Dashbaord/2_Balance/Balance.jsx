import { addDays, format, startOfDay, toDate } from "date-fns";
import React, { useState } from "react";
import {
  Accordion,
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";

const Balance = ({ account, users }) => {
  const [transputs, setTransputs] = useState([]);
  const [trades, setTrades] = useState([]);
  const [date, setDate] = useState(
    format(startOfDay(new Date()), "yyyy-MM-dd")
  );

  const mainKeys = ["Inputs", "Outputs"];
  const innerKeys = ["Transputs", "Trades"];
  const babyKeys = ["Nominations", "Allocations"];

  let filterData = (main, inner, baby) => {
    if (inner == "Transputs") {
      return transputs.filter(
        (t) => t.transput == (main == "Inputs" ? "I" : "O")
      );
    }
    return trades.filter((t) =>
      main == "Inputs"
        ? (baby = "Nominations")
          ? (t.user_id == account.user.id && t.direction == "B") ||
            (t.counter_id == account.user.id && t.direction == "B")
          : t
        : t
    );
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

  const balance = mainKeys.reduce((mainAcum, main) => {
    mainAcum[main] = innerKeys.reduce((innerAcum, inner) => {
      innerAcum[inner] = {
        ...babyKeys.reduce((babyAcum, baby) => {
          babyAcum[baby] = {
            details: filterData(main, inner, baby),
            total() {
              return this.details.reduce((acum, t) => acum + t, 0);
            },
          };
          return babyAcum;
        }, {}),
        name: nameData(main, inner),
        totals() {
          let tot = this.Nominations.total();
          return {};
        },
      };
      return innerAcum;
    }, {});
    return mainAcum;
  }, {});

  let cycleDates = (left = true) => {
    setDate(format(addDays(toDate(date), left ? -1 : 1), "yyyy-MM-dd"));
  };

  console.log(balance);

  return (
    <div className="balance flx col ai-c jc-c">
      <div className="dates">
        <Form className="flx">
          <Button onClick={cycleDates}>&larr;</Button>
          <FloatingLabel label="Gas Date">
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </FloatingLabel>
          <Button onClick={() => cycleDates(false)}>&rarr;</Button>
        </Form>
      </div>

      <Container className="balance">
        <Row className="header">
          <Col xs={1}>Balance</Col>
          <Col>
            <Container>
              <Row>
                <Col xs={2}></Col>
                {babyKeys.map((babyKey, i) => (
                  <Col key={i}>{babyKey}</Col>
                ))}
              </Row>
            </Container>
          </Col>
        </Row>
        {Object.entries(balance).map(([mainKey, mainObj], i) => (
          <Row key={i} className={mainKey}>
            <Col xs={1}>{mainKey}</Col>
            <Col>
              <Container>
                <Row>
                  <Col>
                    <Accordion className="total">
                      <Accordion.Item>
                        <Accordion.Header>
                          <Container>
                            <Row>
                              <Col xs={2}>Total</Col>
                              {babyKeys.map((babyKey, i) => (
                                <Col key={i}>
                                  {mainObj.Transputs[babyKey].total() +
                                    mainObj.Trades[babyKey].total()}
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
                                  <Container>
                                    <Row>
                                      <Col xs={2}>{innerObj.name}</Col>
                                      {babyKeys.map((babyKey, i) => (
                                        <Col key={i}>
                                          {innerObj[babyKey].total()}
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
                                          {innerObj[babyKey].details.map(
                                            (transaction, i) => {
                                              <div>jfdklsajflskjfdkla</div>;
                                            }
                                          )}
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
          <Col xs={1}>Net Balance</Col>
          <Col>
            <Container>
              <Row>
                <Col xs={2}></Col>
                <Col>Nomination Net</Col>
                <Col>Allocations Net</Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Balance;
