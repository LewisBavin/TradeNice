import React, { useEffect, useRef, useState } from "react";
import { getGridPrices } from "../../../Utilities/apiCalls";
import Plot from "react-plotly.js";
import { add, format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { dateify, graphActions } from "../../../Utilities/Slices/GraphSlice";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import enGB from "date-fns/locale/en-GB";
import { setDefaultOptions } from "date-fns";
setDefaultOptions(enGB);

const GasPrices = () => {
  let dispatch = useDispatch();
  const range = useSelector(dateify);
  const [points, setPoints] = useState({ uk: {}, eu: {} });
  const [view, setView] = useState("daily");
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

  let dateRef = useRef();

  return (
    <>
      <div className="views flx jc-sa">
        <div className="view flx col ai-c jc-c">
          <div className="header">Show Hourly</div>
          <DatePicker
            dateFormat={"dd-MM-yyyy"}
            selected={range.start}
            onChange={datePick}
          />
        </div>
        <div className="view flx col ai-c jc-c">
          <div className="header">Show Daily</div>
        </div>
      </div>
      <div className="plotContainer">
        <Plot
          data={[
            {
              ...points.uk,
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "red" },
              name: "UK Grid: £/therm",
            },
            {
              ...points.eu,
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "blue" },
              name: "EU Grid: €/therm",
            },
          ]}
          layout={{
            width: 1000,
            height: 500,
            title: "Showing Gas Day: " + format(range.start, "dd-MM-yyyy"),
            yaxis: { title: "Gas Grid Prices" },
          }}
        />
        <div className="plotControls flx jc-c">
          <div className="header"></div>
          <button onClick={() => dStep1(-1)}>
            {format(add(range.start, { days: -1 }), "dd-MMM")}
          </button>
          <button onClick={() => dStep1(+1)}>
            {format(add(range.start, { days: +1 }), "dd-MMM")}
          </button>
        </div>
      </div>
    </>
  );
};

export default GasPrices;
