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

  const mainKeys = ["Nominated", "Allocated"];
  const innerKeys = ["Inputs", "Outputs"];

  let filterData = (type, main, inner) => {
    if (type == "transputs") {
      return transputs.filter(
        (t) => t.transput == (main == "inputs" ? "I" : "O")
      );
    }
    return trades
      .filter((t) =>
        (main = "inputs")
          ? (t.user_id == account.user.user_id && t.directoin == "B") ||
            (t.counter_id == account.user.user_id && t.directoin == "S")
          : (t.user_id == account.user.user_id && t.directoin == "S") ||
            (t.counter_id == account.user.user_id && t.directoin == "B")
      )
      .filter((t) => (inner == "allocated" ? t.accepted == 1 : t));
  };

  const balance = mainKeys.reduce((mainAcum, main) => {
    mainAcum[main] = innerKeys.reduce((innerAcum, inner) => {
      innerAcum[inner] = {
        transputs: filterData("transputs", main, inner),
        transputsTotal() {
          return this.transputs.reduce((acum, t) => acum + t.volume, 0);
        },
        trades: filterData("trades", main, inner),
        tradesTotal() {
          return this.trades.reduce((acum, t) => acum + t.volume, 0);
        },
        total() {
          return this.tradesTotal() + this.transputsTotal();
        },
      };

      return innerAcum;
    }, {});
    mainAcum[main] = {
      ...mainAcum[main],
      ["Net Total:"]:
        mainAcum[main].Inputs.total() - mainAcum[main].Outputs.total(),
    };
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
                <Col>Nominations</Col>
                <Col>Allocations</Col>
              </Row>
            </Container>
          </Col>
        </Row>
        <Row className="inputs">
          <Col xs={1}>Inputs</Col>
          <Col>
            <Container>
              <Row>
                <Col>
                  <Accordion className="mainAccordion">
                    <Accordion.Item>
                      <Accordion.Header>
                        <Container>
                          <Row>
                            <Col xs={2}>Total</Col>
                            <Col>net noms</Col>
                            <Col>net allocs</Col>
                          </Row>
                        </Container>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Accordion>
                          <Accordion.Item>
                            <Accordion.Header>
                              <Container>
                                <Row>
                                  <Col xs={2}>Trade Buys</Col>
                                  <Col>nom total </Col>
                                  <Col>all total</Col>
                                </Row>
                              </Container>
                            </Accordion.Header>
                            <Accordion.Body>
                              <Container>
                                <Row>
                                  <Col xs={2}></Col>
                                  <Col>
                                    here is a boring list of all the trade
                                    details in the systerm
                                  </Col>
                                  <Col>
                                    similarly but for allocs lets see what the
                                    layout looks like
                                  </Col>
                                </Row>
                              </Container>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>

                        <Container>
                          <Row>
                            <Col>
                              <Accordion>
                                <Accordion.Item>
                                  <Accordion.Header>
                                    <Container>
                                      <Row>
                                        <Col xs={2}>Grid Inputs</Col>
                                        <Col>nom total </Col>
                                        <Col>all total</Col>
                                      </Row>
                                    </Container>
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <Container>
                                      <Row>
                                        <Col xs={2}></Col>
                                        <Col>
                                          here is a boring list of all the trade
                                          details in the systerm
                                        </Col>
                                        <Col>
                                          similarly but for allocs lets see what
                                          the layout looks like
                                        </Col>
                                      </Row>
                                    </Container>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            </Col>
                          </Row>
                        </Container>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
        <Row className="outputs">
          <Col xs={1}>Outputs</Col>
          <Col>
            <Container>
              <Row>
                <Col>
                  <Accordion className="mainAccordion">
                    <Accordion.Item>
                      <Accordion.Header>
                        <Container>
                          <Row>
                            <Col xs={2}>Total</Col>
                            <Col>net noms</Col>
                            <Col>net allocs</Col>
                          </Row>
                        </Container>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Accordion>
                          <Accordion.Item>
                            <Accordion.Header>
                              <Container>
                                <Row>
                                  <Col xs={2}>Trade Buys</Col>
                                  <Col>nom total </Col>
                                  <Col>all total</Col>
                                </Row>
                              </Container>
                            </Accordion.Header>
                            <Accordion.Body>
                              <Container>
                                <Row>
                                  <Col xs={2}></Col>
                                  <Col>
                                    here is a boring list of all the trade
                                    details in the systerm
                                  </Col>
                                  <Col>
                                    similarly but for allocs lets see what the
                                    layout looks like
                                  </Col>
                                </Row>
                              </Container>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>

                        <Container>
                          <Row>
                            <Col>
                              <Accordion>
                                <Accordion.Item>
                                  <Accordion.Header>
                                    <Container>
                                      <Row>
                                        <Col xs={2}>Grid Inputs</Col>
                                        <Col>nom total </Col>
                                        <Col>all total</Col>
                                      </Row>
                                    </Container>
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <Container>
                                      <Row>
                                        <Col xs={2}></Col>
                                        <Col>
                                          here is a boring list of all the trade
                                          details in the systerm
                                        </Col>
                                        <Col>
                                          similarly but for allocs lets see what
                                          the layout looks like
                                        </Col>
                                      </Row>
                                    </Container>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            </Col>
                          </Row>
                        </Container>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
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
