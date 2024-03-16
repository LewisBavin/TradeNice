import React from "react";
import { useState } from "react";
import { getStore } from "../../Utilities/localStorage";
import { gasUsers } from "../../Utilities/dummyData";
import DashHeader from "./DashHeader";

const Dashboard = () => {
  const account = getStore("account");
  const system = gasUsers;

  return (
    <>
      <DashHeader />
    </>
  );
};

export default Dashboard;
