import axios from "axios";
import React, { useEffect, useState } from "react";
import { accountActions } from "../../../Slices/AccountSlice";
import { useDispatch } from "react-redux";
import {
  addDays,
  differenceInDays,
  format,
  startOfDay,
  toDate,
} from "date-fns";
import { Button, Form, Container, FloatingLabel } from "react-bootstrap";

const Noms = ({ account, users }) => {
  const WD = startOfDay(new Date());
  const DA = startOfDay(addDays(WD, 1));
  const dispatch = useDispatch();
  const [refresh, toggleRefresh] = useState(true);
  const [transputs, setTransputs] = useState({
    Input: {
      start_date: format(WD, "yyyy-MM-dd"),
      end_date: format(WD, "yyyy-MM-dd"),
      transput: "Input",
      volume: 0,
      total_volume: 0,
      wd: {},
      da: {},
    },
    Output: {
      start_date: format(WD, "yyyy-MM-dd"),
      end_date: format(WD, "yyyy-MM-dd"),
      transput: "Output",
      volume: 0,
      total_volume: 0,
      wd: {},
      da: {},
    },
  });

  useEffect(() => {
    refresh &&
      (async function getNoms() {
        try {
          let resultsWD = (
            await axios.get("http://localhost:6002/user/get/nominations", {
              headers: {
                token: account.user.token,
                datestring: format(WD, "yyyy-MM-dd"),
              },
            })
          ).data.results;
          let resultsDA = (
            await axios.get("http://localhost:6002/user/get/nominations", {
              headers: {
                token: account.user.token,
                datestring: format(DA, "yyyy-MM-dd"),
              },
            })
          ).data.results;

          resultsWD && resultsDA
            ? (function NominationsRefreshed() {
              dispatch(
                accountActions.setToast({
                  trigger: true,
                  strong: "Success!",
                  body: "Within-day & Day-ahead nominations refreshed",
                  variant: "success",
                  delay: 3000,
                })
              );
                setTransputs({
                  Input: {
                    ...transputs.Input,
                    wd: resultsWD.find((r) => r.transput == "I") || {},
                    da: resultsDA.find((r) => r.transput == "I") || {},
                  },
                  Output: {
                    ...transputs.Output,
                    wd: resultsWD.find((r) => r.transput == "O") || {},
                    da: resultsDA.find((r) => r.transput == "O") || {},
                  },
                });
              })()
            : dispatch(
                accountActions.setToast({
                  trigger: true,
                  strong: "Error!",
                  body: "Couldn't get your latest nominations",
                  small: "databese error!",
                  variant: "danger",
                  delay: 3000,
                })
              );
        } catch (e) {
          dispatch(
            accountActions.setToast({
              trigger: true,
              strong: "Error!",
              body: "Couldn't get your latest nominations",
              small: "databese error!",
              variant: "danger",
              delay: 3000,
            })
          );
        }

        toggleRefresh(false);
      })();
  }, [refresh]);

  let sendRequests = async (key) => {
    try {
      let { results, err } = (
        await axios.post(
          "http://localhost:6002/user/nominations/add",
          { transputs: { [key]: transputs[key] } },
          {
            headers: { token: account.user.token },
          }
        )
      ).data;
      if (results) {
        dispatch(
          accountActions.setToast({
            trigger: true,
            strong: "Success!",
            small: "requests sumbited",
            body: "Input & Output nominations uploaded!",
            variant: "success",
            delay: 3000,
          })
        );
        toggleRefresh(true);
      }
      if (err) {
        dispatch(
          accountActions.setToast({
            trigger: true,
            strong: "Error!",
            small: "Bad Form Data",
            body: `Please review your inputs`,
            variant: "danger",
            delay: 4000,
          })
        );
      }
    } catch (e) {
      dispatch(
        accountActions.setToast({
          trigger: true,
          strong: "Error!",
          small: "Connection Error",
          body: `Please contact admin`,
          variant: "warning",
          delay: 6000,
        })
      );
    }
  };

  let updateValues = (e, key, i) => {
    let [name, val] = [e.target.name, e.target.value];
    let { start_date, end_date, volume, total_volume } = { ...transputs[key] },
      start = toDate(name == "start_date" ? val : start_date),
      end = toDate(name == "end_date" ? val : end_date);
    start < WD ? (start = WD) : null;
    start > end ? (end = start) : null;
    let vol = name == "volume" ? (!val ? 0 : val) : volume,
      tot = vol * (differenceInDays(end, start) + 1);
    setTransputs({
      ...transputs,
      [key]: {
        ...transputs[key],
        start_date: format(start, "yyyy-MM-dd"),
        end_date: format(end, "yyyy-MM-dd"),
        volume: vol,
        total_volume: tot,
      },
    });
  };

  return (
    <>
      <div className="requests container flx col jc-c ai-c">
        <Button onClick={() => toggleRefresh(true)}>Get Latest Noms</Button>

        <div className="flx">
          {Object.entries(transputs).map(([key, values], i) => (
            <div className="transput flx col" style={{ gap: "2rem" }} key={i}>
              <Form className="flx col">
                <Form.Text>{`Current ${key} Nominations`}</Form.Text>
                <Form.Text>{`(Therms)`}</Form.Text>
                <Form.Text>{`Within-Day: ${
                  !values.wd.volume ? 0 : values.wd.volume
                }`}</Form.Text>
                <Form.Text>{`Day-Ahead: ${
                  !values.da.volume ? 0 : values.da.volume
                }`}</Form.Text>
              </Form>
              <Container>
                <Form className="border border-light">
                  <Form.Text>Create New Nomination</Form.Text>
                  <Container>
                    <FloatingLabel label="Transput Type">
                      <Form.Control disabled readOnly defaultValue={key} />
                    </FloatingLabel>
                    <FloatingLabel label="Location Point">
                      <Form.Control disabled readOnly defaultValue="Grid" />
                    </FloatingLabel>
                    <FloatingLabel label="Start">
                      <Form.Control
                        type="date"
                        name="start_date"
                        value={values.start_date}
                        onChange={(e) => updateValues(e, key, i)}
                      />
                    </FloatingLabel>
                    <FloatingLabel label="End">
                      <Form.Control
                        type="date"
                        name="end_date"
                        value={values.end_date}
                        onChange={(e) => updateValues(e, key, i)}
                      />
                    </FloatingLabel>
                    <FloatingLabel label="Volume (Th/day)">
                      <Form.Control
                        type="number"
                        name="volume"
                        value={Number(values.volume || 0)}
                        onChange={(e) => updateValues(e, key, i)}
                        placeholder="Volume"
                      />
                    </FloatingLabel>
                    <FloatingLabel label="Total Vol (Th)">
                      <Form.Control
                        type="number"
                        name="total_volume"
                        value={Number(values.total_volume || 0)}
                        disabled
                        readOnly
                        placeholder="Total Volume"
                      />
                    </FloatingLabel>
                  </Container>
                  <Button
                    onClick={() => sendRequests(key)}
                  >{`Submit ${key} Noms`}</Button>
                </Form>
              </Container>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Noms;
