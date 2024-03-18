import React, { useState } from "react";
import TradingCreate from "./TradingCreate";
import TradingDispute from "./TradingDispute";
import TradingOutstanding from "./TradingOutstanding";
import TradingVerified from "./TradingVerified";
import { arrObjByKeyVal } from "../../../Utilities/usefulFuncs";

const GasTrading = () => {
  const [view, setView] = useState({ idx: 0 });
  const tradingTabs = [
    { name: "Outstanding", element: <TradingOutstanding /> },
    { name: "Verified", element: <TradingVerified /> },
    { name: "Create Request", element: <TradingCreate /> },
    { name: "Disputes", element: <TradingDispute /> },
  ];

  return (
    <>
      <div className="dashNav inner flx">
        {tradingTabs.map((tab, idx) => {
          return (
            <div
              key={idx}
              className="dash select inner"
              onClick={() => setView({ ...view, idx })}
            >
              {tab.name}
            </div>
          );
        })}
      </div>
      {tradingTabs[view.idx].element}
    </>
  );
};

export default GasTrading;
