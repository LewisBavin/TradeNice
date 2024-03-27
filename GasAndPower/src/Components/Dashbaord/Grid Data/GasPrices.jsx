import React, { useEffect, useRef, useState } from "react";
import { getGridPrices, gridPricesAll } from "../../../Utilities/apiCalls";
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

const GasPrices = () => {
  const dispatch = useDispatch();
  const gridPrices = useSelector(getSavedPrices);

  if (!gridPrices) {
    let allPrices = gridPricesAll.data.records;
    let prices = {
      uk: allPrices.filter((obj) => obj.PriceArea == "SYSTEM"),
      eu: allPrices.filter((obj) => obj.PriceArea == "DK1"),
    };

    Object.entries(prices).forEach(([key, value]) => {
      let [x, y] = value.reduce(
        (accum, val) => {
          accum[0].push(val.HourUTC);
          accum[1].push(val.SpotPriceEUR);
          return accum;
        },
        [[], []]
      );
      prices[key] = { x, y };
    });
    dispatch(graphActions.initialiseGridPrices(prices));
  }

  /*   let allPrices = gridPricesAll.data.records;
    let prices = {
      uk: allPrices.filter((obj) => obj.PriceArea == "SYSTEM"),
      eu: allPrices.filter((obj) => obj.PriceArea == "DK1"),
    };

    Object.entries(prices).forEach(([key, value]) => {
      let [x, y] = value.reduce(
        (accum, val) => {
          accum[0].push(val.HourUTC);
          accum[1].push(val.SpotPriceEUR);
          return accum;
        },
        [[], []]
      );
      prices[key] = { x, y };
      dispatch(graphActions.initialiseGridPrices(prices))
    }); */

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

  useEffect(() => {
    let setGasPrces = async () => {
      let prices = (await getGridPrices(start, end)).data.records;
      let pricesUK = prices.filter((dat) => dat.PriceArea == "SYSTEM");
      let pricesEU = prices.filter((dat) => dat.PriceArea == "DK1");
      uk = { x: [], y: [] };
      eu = { x: [], y: [] };
      pricesUK.forEach((dat) => {
        uk.x.push(dat.HourUTC.replace("T", " "));
        uk.y.push(dat.SpotPriceEUR / 100);
      });
      pricesEU.forEach((dat) => {
        eu.x.push(dat.HourUTC.replace("T", " "));
        eu.y.push(dat.SpotPriceEUR / 100);
      });
      setPoints({ uk, eu });
    };
    setGasPrces();
  }, [range]);

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
              title: "Showing Gas Day:",
              xaxis: {
                rangeselector: {
                  buttons: [
                    {
                      step: "month",
                      stepmode: "backward",
                      count: 1,
                      label: "1m",
                    },
                    {
                      step: "month",
                      stepmode: "backward",
                      count: 6,
                      label: "6m",
                    },
                    {
                      step: "year",
                      stepmode: "todate",
                      count: 1,
                      label: "YTD",
                    },
                    {
                      step: "year",
                      stepmode: "backward",
                      count: 1,
                      label: "1y",
                    },
                    {
                      step: "all",
                    },
                  ],
                },
                rangeslider: {},
              },
              yaxis: { title: "Gas Grid Prices" },
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

export default GasPrices;
