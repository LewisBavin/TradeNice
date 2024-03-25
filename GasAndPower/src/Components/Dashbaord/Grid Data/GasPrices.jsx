import React, { useEffect, useState } from "react";
import {
  getElecPrices,
  getGasPrices,
  getGridPrices,
} from "../../../Utilities/apiCalls";
import Plot from "react-plotly.js";
import { add, format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { graphActions } from "../../../Utilities/Slices/GraphSlice";

const GasPrices = () => {
  let today = new Date();
  const [range, setRange] = useState({ start: today, end: today });
  const [points, setPoints] = useState({ uk: {}, eu: {} });
  const [view, setView] = useState("daily");
  let { uk, eu } = points;
  let { start, end } = range;

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

  let changeStart = (n = 0) => {
    setStart(add(startDay, { days: n }));
  };

  let changeRangeDaily = (n = 0) => {
    setRange({ start: add(start, { days: n }), end: add(end, { days: n }) });
  };
  return (
    <>
      <div className="views flx jc-sa">
        <div className="view">Show Hourly</div>
        <div className="view">Show Daily</div>
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
          <button onClick={() => changeRangeDaily(-1)}>
            {format(add(range.start, { days: -1 }), "dd-MMM")}
          </button>
          <button onClick={() => changeRangeDaily(+1)}>
            {format(add(range.start, { days: +1 }), "dd-MMM")}
          </button>
        </div>
      </div>
    </>
  );
};

export default GasPrices;
