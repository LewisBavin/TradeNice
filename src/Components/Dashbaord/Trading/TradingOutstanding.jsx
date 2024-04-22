import React from "react";
import Requests from "../Requests";
import { getRequests} from "../../../Utilities/Slices/SystemSlice";
import { useSelector } from "react-redux";

const TradingOutstanding = ({ userID }) => {
  const systemRequests = useSelector(getRequests);

  const withdraw = 1

  const yours = systemRequests.filter((nom) => nom.userID === userID);
  const theirs = systemRequests.filter((nom) => nom.counterID === userID);

  return (
    <>
      <div className="requestsContainer flx jc-sb">
        <div className="column">
          <div className="header">Your Requests</div>
          <Requests reqs={yours} />
        </div>
        <div className="column">
          <div className="header">Counterparty Requests</div>
          <Requests reqs={theirs} reverse={true} />
        </div>
      </div>
    </>
  );
};

export default TradingOutstanding;
