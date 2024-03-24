import React, { useEffect, useState } from "react";
import { getGasPrices } from "../../../Utilities/apiTokens";
import Plot from "react-plotly.js";
import { add, format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { graphActions } from "../../../Utilities/Slices/GraphSlice";

const GasPrices = () => {
  const [startDay, setStart] = useState(new Date());
  const [points, setPoints] = useState({ x: [], y: [] });
  let dispatch = useDispatch();

  useEffect(() => {
    let setPrces = async () => {
      let gasPrices = (await getGasPrices(startDay)).data;
      let data = gasPrices.records;
      data.map((dat) => {
        points.x.push(dat.HourUTC.replace("T", " "));
        points.y.push(dat.SpotPriceEUR);
      });
      setPoints(points);
    };
    setPrces();
  }, [startDay]);

  let clearPoints = () => {
    setPoints = {};
  };

  dispatch(graphActions.setGasPrices(new Date().toString()));
  dispatch(graphActions.logState());

  let changeStart = () => {
    setStart(add(startDay, { days: -1 }));
  };
  return (
    <>
      <div className="plotControls">
        <div className="header">plot controls</div>
        <button onClick={changeStart}>D-1</button>
      </div>
      <Plot
        data={[
          {
            ...points,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "red" },
          },
        ]}
        layout={{ width: 1000, height: 500, title: "A Fancy Plot" }}
      />
    </>
  );
};

export default GasPrices;
