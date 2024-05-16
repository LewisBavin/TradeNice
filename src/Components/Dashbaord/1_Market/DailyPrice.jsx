import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSavedPrices,
  graphActions,
  graphSlice,
} from "../../../Slices/GraphSlice";
import { add, addDays, format, startOfDay, toDate } from "date-fns";
import { Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { setStore } from "../../../Utilities/localStorage";

const DailyPrice = ({ dateStr, small }) => {
  const prices = useSelector(getSavedPrices);
  const dispatch = useDispatch();
  let date = startOfDay(toDate(dateStr));

  let average =
    (prices ? prices.uk : [])
      .filter(
        (points) =>
          toDate(points.x) >= date && toDate(points.x) < addDays(date, 1)
      )
      .reduce((acum, price) => acum + price.y * 100, 0) / 24;

  setStore("average", average);
  return (
    <div>
      <Form className="flx col jc-c ai-c" style={{ width: "fit-content" }}>
        <FloatingLabel label={"WAP - " + format(dateStr, "yyyy-MM-dd")}>
          <Form.Control
            disabled
            value={
              average == 0
                ? "not enough future data"
                : Math.round(average * 100, 2) / 100 + " p/th"
            }
          />
        </FloatingLabel>
      </Form>
    </div>
  );
};

export default DailyPrice;
