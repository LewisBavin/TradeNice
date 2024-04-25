import React from "react";
import TradingDispute from "./Trading/TradingDispute";
import TradingVerified from "./Trading/TradingVerified";
import TradingCreate from "./Trading/TradingCreate";
import TradingOutstanding from "./Trading/TradingOutstanding";
import { useState } from "react";
import GasPrices from "./Grid Data/GasPrices";
import { useDispatch } from "react-redux";
import { accountActions } from "../../Utilities/Slices/AccountSlice";

const Dashboard = ({ account }) => {
  let { user } = account;
  const dispatch = useDispatch();
  let id = user.user_id;
  const [view, setView] = useState(
    !account.view
      ? { idx: 0, subIdx: 0 }
      : { idx: account.view.idx, subIdx: account.view.subIdx }
  );

  const changeView = (idx, subIdx = 0) => {
    setView({ ...view, idx, subIdx });
    dispatch(accountActions.setView({ ...view, idx, subIdx }));
  };

  const toggleSelected = (e) => {
    let node = e.currentTarget;
    let childs = node.parentNode.childNodes;
    childs.forEach((child) => child.classList.remove("selected"));
    node.classList.add("selected");
  };

  const dashTabs = [
    {
      name: "Grid Overviews",
      childTabs: [
        { name: "Gas Prices", element: <GasPrices /> },
        { name: "Grid Flow", element: <GasPrices /> },
      ],
    },
    {
      name: "Balance",
      childTabs: [{ name: "Outstanding", element: <TradingOutstanding /> }],
    },
    {
      name: "Nominations",
      childTabs: [{ name: "Outstanding", element: <TradingOutstanding /> }],
    },
    {
      name: "Trading",
      childTabs: [
        { name: "Outstanding", element: <TradingOutstanding userID={id} /> },
        { name: "Verified", element: <TradingVerified account={account} /> },
        {
          name: "Create Request",
          element: <TradingCreate account={account} />,
        },
        { name: "Disputes", element: <TradingDispute account={account} /> },
      ],
    },
    {
      name: "Allocations",
      childTabs: [{ name: "Outstanding", element: <TradingOutstanding /> }],
    },
    {
      name: "Settings",
      childTabs: [{ name: "Outstanding", element: <TradingOutstanding /> }],
    },
  ];

  return (
    <>
      <div className="dash container flx col">
        <div className="dashTabs flx">
          {dashTabs.map((tab, idx) => {
            return (
              <div
                className="dashTab flx"
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  changeView(idx);
                  toggleSelected(e);
                }}
              >
                <div className="title">{tab.name}</div>
                <div className="dashTabs inner">
                  {tab.childTabs &&
                    tab.childTabs.map((childTab, subIdx) => {
                      return (
                        <div
                          className="dashTab inner"
                          key={subIdx}
                          onClick={(e) => {
                            e.stopPropagation();
                            changeView(idx, subIdx);
                            toggleSelected(e);
                          }}
                        >
                          <div className="title inner">{childTab.name}</div>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="dashContent container">
          <div className="content">
            {dashTabs[view.idx].childTabs[view.subIdx].element}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
