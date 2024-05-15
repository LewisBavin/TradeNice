import React, { useEffect, useRef, useState } from "react";
import Plot from "react-plotly.js";
import {
  format,
  startOfMonth,
  startOfYear,
  toDate,
  endOfMonth,
  endOfYear,
  addDays,
  startOfDay,
} from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { readGraph } from "../../../Slices/GraphSlice";
import "react-datepicker/dist/react-datepicker.css";
import enGB from "date-fns/locale/en-GB";
import { setDefaultOptions } from "date-fns";
import { Button, Form, Spinner, FloatingLabel } from "react-bootstrap";
setDefaultOptions(enGB);

const Prices = ({ allPrices }) => {
  const [dates, setDates] = useState({
    start: format(startOfDay(new Date()), "yyyy-MM-dd"),
    end: format(startOfDay(new Date()), "yyyy-MM-dd"),
  });
  const [prices, setPrices] = useState();
  const [all, setAll] = useState();
  const [rangeType, setRangeType] = useState({
    hourly: {
      val: true,
      step: 1,
      func(start) {
        return {
          start: format(toDate(start), "yyyy-MM-dd"),
          end: format(toDate(start), "yyyy-MM-dd"),
        };
      },
    },
    daily: {
      val: false,
      step: 24,
      func(start) {
        return {
          start: format(startOfMonth(start), "yyyy-MM-dd"),
          end: format(endOfMonth(start), "yyyy-MM-dd"),
        };
      },
    },
    monthly: {
      val: false,
      step: 744,
      func(start) {
        return {
          start: format(startOfYear(start), "yyyy-MM-dd"),
          end: format(endOfYear(start), "yyyy-MM-dd"),
        };
      },
    },
  });
  const [selectedRadio, setSelected] = useState(rangeType.hourly);

  let changeRadio = (e, key) => {
    let radios = { ...rangeType };
    Object.entries(radios).forEach(
      ([rKey, obj]) => (radios[rKey] = { ...obj, val: key == rKey })
    );
    let selected = Object.values(radios).find((obj) => obj.val);
    setSelected(selected);
    setRangeType(radios);
    setDates(selected.func(dates.start));
  };

  useEffect(() => {
    allPrices && !all && setAll(allPrices);
  });

  useEffect(() => {
    let filter = { ...all };
    let { step } = selectedRadio;
    Object.keys(filter).forEach((key) => {
      filter[key] = filter[key]
        .filter(
          (points, i) =>
            toDate(points.x) >= toDate(dates.start) &&
            toDate(points.x) <= addDays(toDate(dates.end), 1) &&
            !(i % step)
        )
        .reduce(
          (acum, points) => {
            acum.x.push(points.x);
            acum.y.push(points.y);
            return acum;
          },
          { x: [], y: [] }
        );
    });
    setPrices(filter);
  }, [dates, all]);

  let updateDates = (e) => {
    setDates(selectedRadio.func(e.target.value));
  };

  let cycleDates = (left = true) => {
    setDates(
      selectedRadio.func(
        addDays(toDate(left ? dates.start : dates.end), left ? -1 : 1)
      )
    );
  };

  return (
    <div className="plotContainer flx col jc-c ai-c">
      {!all ? (
        <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          getting prices...
        </Button>
      ) : (
        <>
          <div className="dates flx col jc-c ai-c">
            <div className="flx">
              {Object.keys(rangeType).map((key, i) => (
                <Form.Check
                  key={i}
                  type="radio"
                  name="dateRange"
                  label={key}
                  checked={rangeType[key].val}
                  onChange={(e) => {
                    changeRadio(e, key);
                  }}
                ></Form.Check>
              ))}
            </div>
            <Form onSubmit={updateDates} onChange={updateDates} className="flx">
              <FloatingLabel label="start">
                <Form.Control
                  type="date"
                  name="start"
                  value={dates.start}
                  onChange={() => {}}
                />
              </FloatingLabel>

              <FloatingLabel label="end">
                <Form.Control
                  disabled
                  readOnly
                  type="date"
                  name="end"
                  value={dates.end}
                />
              </FloatingLabel>
            </Form>
            <div className="navs flx jc-c">
              <Button onClick={cycleDates}>&larr;</Button>
              <Button onClick={() => cycleDates(false)}>&rarr;</Button>
            </div>
          </div>

          <Plot
            data={[
              {
                ...prices.uk,
                type: "scatter",
                mode: "lines",
                marker: { color: "red" },
                name: "UK Grid: £/therm",
              },
              {
                ...prices.eu,
                type: "scatter",
                mode: "lines",
                marker: { color: "blue" },
                name: "EU Grid: €/therm",
              },
            ]}
            config={{ responsive: true }}
            layout={{
              title: "Grid Gas Prices",
              xaxis: {},
              legend: {},
              yaxis: {
                title: "Gas Grid Prices",
                autorange: true,
              },
            }}
          />
        </>
      )}
    </div>
  );
};

export default Prices;
