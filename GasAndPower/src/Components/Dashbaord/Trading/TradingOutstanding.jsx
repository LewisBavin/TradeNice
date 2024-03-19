import React from "react";
import { systemRequests } from "../../../Utilities/systemTransactions";

import Requests from "../Requests";

const TradingOutstanding = ({ userID }) => {
  const yours = systemRequests.filter((nom) => nom.userID === userID);
  const theirs = systemRequests.filter((nom) => nom.counterID === userID);

  return (
    <>
      <div className="requestsContainer flx jc-sb">
        <div>
          <div className="header">Your Requests</div>
          <Requests reqs={yours} />
        </div>
        <div>
          <div className="header">Counterparty Requests</div>
          <Requests reqs={theirs} counterParty={true} />
        </div>
      </div>
    </>
  );
};

export default TradingOutstanding;
