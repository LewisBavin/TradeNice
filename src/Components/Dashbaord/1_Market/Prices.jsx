import React, { useEffect, useRef, useState } from "react";
import { getGridPricesAll } from "../../../Utilities/apiCalls";
import Plot from "react-plotly.js";
import { add, format, toDate } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import {
  getSavedPrices,
  graphActions,
  readGraph,
} from "../../../Slices/GraphSlice";
import "react-datepicker/dist/react-datepicker.css";
import enGB from "date-fns/locale/en-GB";
import { setDefaultOptions } from "date-fns";
import { setStore } from "../../../Utilities/localStorage";
import { Button, Form, Spinner, Row, Col } from "react-bootstrap";
setDefaultOptions(enGB);

const Prices = () => {
  const dispatch = useDispatch();
  const graph = useSelector(readGraph);
  const [dates, setDates] = useState({
    start: format(new Date(), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd"),
  });
  const [prices, setPrices] = useState(graph.prices);
  const [all, setAll] = useState({});
  const [filtered, setFiltered] = useState({
    uk: { x: [], y: [] },
    eu: { x: [], y: [] },
  });
  const [rangeType, setRangeType] = useState({
    hourly: "on",
    daily: "off",
    monthly: "off",
    yearly: "off",
    all: "off",
    custom: "off",
  });

  useEffect(() => {
    !prices &&
      (async function getPrices() {
        let allPrices = (await getGridPricesAll()).data.records;

        let prices = allPrices.reduce(
          (accum, val) => {
            let key = val.PriceArea == "SYSTEM" ? "uk" : "eu";
            accum[key].x.push(val.HourUTC);
            accum[key].y.push(val.SpotPriceEUR / 100);
            return accum;
          },
          { uk: { x: [], y: [] }, eu: { x: [], y: [] } }
        );
        let test = allPrices.reduce(
          (accum, val) => {
            accum[val.PriceArea == "SYSTEM" ? "uk" : "eu"].push({
              x: val.HourUTC,
              y: val.SpotPriceEUR / 100,
            });
            return accum;
          },
          { uk: [], eu: [] }
        );
        console.log(test);
        setPrices(prices);
        setAll(test);
        dispatch(graphActions.setAll(test));
        dispatch(graphActions.initialiseGridPrices(prices));
      })();
  }, [prices]);

  useEffect(() => {
    let filter = { ...all };
    Object.keys(filter).forEach(
      (key) =>
        (filter[key] = filter[key].filter(
          (points, i) => toDate(points.x) >= toDate(dates.start)
        ))
    );
    console.log(filter);
  }, [dates]);

  let updateDates = (e) => {
    setDates({ ...dates, [e.target.name]: e.target.value });
  };

  let changeRadio = (e, key) => {
    let radios = { ...rangeType };
    Object.keys(radios).forEach((k) => (radios[k] = k == key ? "on" : "off"));
    setRangeType(radios);
  };

  return (
    <div className="plotContainer flx col jc-c ai-c">
      <div className="dates flx col jc-c ai-c">
        <div className="flx">
          {Object.keys(rangeType).map((key, i) => (
            <Form.Check
              key={i}
              type="radio"
              name="dateRange"
              label={key}
              value={rangeType[key]}
              onClick={(e) => {
                changeRadio(e, key);
              }}
            ></Form.Check>
          ))}
        </div>
        <Form onSubmit={updateDates} onChange={updateDates}>
          <Row className="d-flex justify-content-center py-3">
            <Col xs={5} className="d-flex align-items-center">
              <Form.Text className="text-muted">Start Date</Form.Text>
              <Form.Control
                type="date"
                name="start"
                value={dates.start}
                onChange={() => {}}
              />
            </Col>
            <Col xs={5} className="d-flex align-items-center">
              <Form.Text className="text-muted">End Date</Form.Text>
              <Form.Control
                type="date"
                name="end"
                value={dates.end}
                onChange={() => {}}
              />
            </Col>
            <Col xs={1} className="d-flex align-items-center">
              <Button type="submit">Go</Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="navs flx jc-c">
        <Button>&larr;</Button>
        <Button>&rarr;</Button>
      </div>
      {prices ? (
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
          layout={{
            width: 1250,
            height: 650,
            title: "Grid Gas Prices",
            xaxis: {
              rangeselector: {
                buttons: [
                  {
                    step: "year",
                    stepmode: "backward",
                    count: 1,
                    label: "Yearly",
                  },
                  {
                    step: "month",
                    stepmode: "backward",
                    count: 1,
                    label: "Monthly",
                  },
                  {
                    step: "day",
                    stepmode: "backward",
                    count: 1,
                    label: "Daily",
                  },
                  {
                    step: "hour",
                    stepmode: "backward",
                    count: 1,
                    label: "Hourly",
                  },
                  {
                    step: "all",
                    label: "show all",
                  },
                  {
                    step: "day",
                    stepmode: "todate",
                    count: 1,
                    label: "Today",
                  },
                ],
              },
              rangeslider: {},
            },
            yaxis: {
              title: "Gas Grid Prices",
              autorange: true,
            },
          }}
        />
      ) : (
        <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          grabbing...
        </Button>
      )}
    </div>
  );
};

export default Prices;
