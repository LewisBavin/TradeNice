import { addDays, format, startOfDay, toDate } from "date-fns";
import React, { useState } from "react";
import { Accordion, Button, FloatingLabel, Form } from "react-bootstrap";

const Balance = ({ account, users }) => {
  const [transputs, setTransputs] = useState([]);
  const [trades, setTrades] = useState([]);
  const [date, setDate] = useState(
    format(startOfDay(new Date()), "yyyy-MM-dd")
  );

  const innerKeys = ["Inputs", "Outputs"];
  const mainKeys = ["Nominated", "Allocated"];

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
      <div className="content flx">
        {Object.entries(balance).map(([key, main], i) => (
          <Accordion>
            <Accordion.Item>
              <Accordion.Header>{key}</Accordion.Header>
              <Accordion.Body>
                {Object.entries(main).map(([innerKey, inner], j) => (
                  <Accordion>
                    <Accordion.Item className="flx">
                      <Accordion.Header>{innerKey}</Accordion.Header>
                      <Accordion.Body>
                        <div>jfdsklfjaskldfjlk</div>
                        <div>jfdsklafjdslakjfklds</div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default Balance;
