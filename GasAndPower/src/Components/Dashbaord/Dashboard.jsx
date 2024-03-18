import React from "react";
import GasBalance from "./GasBalance";
import GasAllocs from "./GasAllocs";
import GasSettings from "./GasSettings";
import GasNoms from "./GasNoms";
import GasTrading from "./Trading/GasTrading";
import TradingDispute from "./Trading/TradingDispute";
import TradingVerified from "./Trading/TradingVerified";
import TradingCreate from "./Trading/TradingCreate";
import TradingOutstanding from "./Trading/TradingOutstanding";
import { useState } from "react";

const Dashboard = () => {
  const [view, setView] = useState({ idx: 0 });
  const dashTabs = [
    {
      name: "Balance",
      element: <GasBalance />,
      childTabs: [
        { name: "Outstanding", element: <TradingOutstanding /> },
        { name: "Verified", element: <TradingVerified /> },
        { name: "Create Request", element: <TradingCreate /> },
        { name: "Disputes", element: <TradingDispute /> },
      ],
    },
    { name: "Nominations", element: <GasNoms /> },
    { name: "Trading", element: <GasTrading /> },
    { name: "Allocations", element: <GasAllocs /> },
    { name: "Settings", element: <GasSettings /> },
  ];

  return (
    <>
      <div className="dashNavContainer flx">
        {dashTabs.map((tab, idx) => {
          console.log(tab.childTabs);
          return (
            <div
              className="dashNav"
              key={idx}
              onClick={() => setView({ ...view, idx })}
            >
              <div className="dashNav title">{tab.name}</div>
              {tab.childTabs &&
                view.idx == idx &&
                tab.childTabs.map((childTab, idx) => {
                  return childTab.element;
                })}
            </div>
          );
        })}
        {dashTabs[view.idx].element}
      </div>
    </>
  );
};

export default Dashboard;
