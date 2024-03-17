import React from "react";
import { useState } from "react";
import { getStore } from "../../Utilities/localStorage";
import { gasUsers } from "../../Utilities/dummyData";
import DashHeader from "./DashHeader";

const Dashboard = (props) => {
  const {account} = props

  return (
    <>
      <DashHeader account = {account} />
    </>
  );
};

export default Dashboard;
