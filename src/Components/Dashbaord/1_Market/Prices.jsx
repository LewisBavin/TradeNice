import React, { useEffect, useRef, useState } from "react";
import { getGridPricesAll } from "../../../Utilities/apiCalls";
import Plot from "react-plotly.js";
import { add, format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import {
  getSavedPrices,
  graphActions,
} from "../../../Utilities/Slices/GraphSlice";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import enGB from "date-fns/locale/en-GB";
import { setDefaultOptions } from "date-fns";
setDefaultOptions(enGB);

const Prices = () => {
  const dispatch = useDispatch();
  const gridPrices = useSelector(getSavedPrices);

  !gridPrices &&
    (async function getPrices() {
      let allPrices = (await getGridPricesAll()).data.records;
      let { uk, eu } = allPrices.reduce(
        (accum, val) => {
          let key = val.PriceArea == "SYSTEM" ? "uk" : "eu";
          accum[key].x.push(val.HourUTC);
          accum[key].y.push(val.SpotPriceEUR / 100);
          return accum;
        },
        { uk: { x: [], y: [] }, eu: { x: [], y: [] } }
      );
      dispatch(graphActions.initialiseGridPrices({ uk, eu }));
    })();

  /*   let dispatch = useDispatch();
  const range = useSelector(dateify);
  const [points, setPoints] = useState({ uk: {}, eu: {} });
  const [multiRange, setMulti] = useState();
  let { uk, eu } = points;
  let { start, end } = range;

  const timeifyAndSave = ({ start, end }) => {
    dispatch(
      graphActions.setDates({ start: start.getTime(), end: end.getTime() })
    );
  };

  const timeify = (date) => date.getTime();

  const datePick = (date, action = true) => {
    timeifyAndSave({ start: date, end: date });
  };

  const doublePick = (date, action = true) => {
    timeifyAndSave({ start: date, end: date });
  };

  let dStep1 = (n = 0) => {
    range.start = add(range.start, { days: n });
    range.end = add(range.end, { days: n });
    timeifyAndSave(range);
  };

  let dateRef = useRef(); */

  return (
    <>
      <div className="views flx jc-sa">
        <div className="view flx col ai-c jc-c">
          <div className="header">Show Hourly</div>
        </div>
        <div className="view flx col ai-c jc-c">
          <div className="header">Show Daily</div>
        </div>
      </div>
      <div className="plotContainer">
        {!gridPrices ? (
          <>
            <div>Nope</div>
          </>
        ) : (
          <Plot
            data={[
              {
                ...gridPrices.uk,
                type: "scatter",
                mode: "lines",
                marker: { color: "red" },
                name: "UK Grid: £/therm",
              },
              {
                ...gridPrices.eu,
                type: "scatter",
                mode: "lines",
                marker: { color: "blue" },
                name: "EU Grid: €/therm",
              },
            ]}
            layout={{
              width: 1000,
              height: 500,
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
              },
            }}
          />
        )}
        <div className="plotControls flx jc-c">
          <div className="header"></div>
        </div>
      </div>
    </>
  );
};

export default Prices;
