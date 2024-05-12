let test = (
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
                                here is a boring list of all the trade details
                                in the systerm
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
                                here is a boring list of all the trade details
                                in the systerm
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
                              <Col xs={2}>Trade Sells</Col>
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
                                here is a boring list of all the trade details
                                in the systerm
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
                                    <Col xs={2}>Grid Offtakes</Col>
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
);
