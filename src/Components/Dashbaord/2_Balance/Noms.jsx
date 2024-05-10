import axios from "axios";
import React, { useEffect, useState } from "react";
import { accountActions } from "../../../Slices/AccountSlice";
import { useDispatch } from "react-redux";
import { differenceInDays, format, startOfDay, toDate } from "date-fns";
import { Button, Form, Container, FloatingLabel } from "react-bootstrap";

const Noms = ({ account, users }) => {
  const dispatch = useDispatch();
  const [refresh, toggleRefresh] = useState(false)
  const [transputs, setTransputs] = useState({
    Input: {
      start_date: format(new Date(), "yyyy-MM-dd"),
      end_date: format(new Date(), "yyyy-MM-dd"),
      transput: "Input",
      volume: 0,
      total_volume: 0,
    },
    Output: {
      start_date: format(new Date(), "yyyy-MM-dd"),
      end_date: format(new Date(), "yyyy-MM-dd"),
      transput: "Output",
      volume: 0,
      total_volume: 0,
    },
  });

  useEffect(()=>{

    refresh && (async function getNoms(){
        toggleRefresh(false)
    })()

  },[refresh])

  let sendRequests = async () => {
    try {
      let { results, err } = (
        await axios.post(
          "http://localhost:6002/user/nominations/add",
          { transputs },
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
        toggleRefresh(true)
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
    start < toDate(new Date()) ? (start = toDate(new Date())) : null;
    start > end ? (end = start) : null;
    let vol = name == "volume" ? (!val ? 0 : val) : volume,
      tot = vol * (differenceInDays(end, start) + 1);
    setTransputs({
      ...transputs,
      [key]: {
        start_date: format(start, "yyyy-MM-dd"),
        end_date: format(end, "yyyy-MM-dd"),
        volume: vol,
        total_volume: tot,
      },
    });
  };

  return (
    <>
      <div className="requests container col flx jc-c ai-c">
        <Form className="border border-light d-flex">
          {Object.entries(transputs).map(([key, values], i) => {
            return (
              <Form.Group key={i}>
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
              </Form.Group>
            );
          })}
        </Form>
        <Button onClick={sendRequests}>Submit Nominations</Button>
      </div>
    </>
  );
};

export default Noms;
