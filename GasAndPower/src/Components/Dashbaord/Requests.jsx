import React from "react";
import Request from "./Request";
import { getGasUsers } from "../../Utilities/Slices/SystemSlice";



const Requests = ({ reqs, counterParty }) => {

    console.log('test')
  const buys = reqs.filter((req) => {
    return req.direction === "input";
  });
  const sells = reqs.filter((req) => {
    return req.direction == "output";
  });
  console.log("reqs", reqs);
  console.log("buys: ", buys, "sells: ", sells);

  return (
    <div className={"requests flx col" + (counterParty ? "-r" : "")}>
      <div className="inputs">
        <div className="header">Buys</div>
        <div className="counterParty">
          <div className="header">counter</div>
          <div className="requestList">
            {buys.map((req, i) => {
              return (
                <ul key={i}>
                  <Request />
                </ul>
              );
            })}
          </div>
        </div>
      </div>
      <div className="inputs">
        <div className="header">Sells</div>
      </div>
    </div>
  );
};

export default Requests;
