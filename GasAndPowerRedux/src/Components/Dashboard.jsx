import React from "react";
import { useState } from "react";

const Dashboard = () => {
  const [counter, setCounter] = useState(0);

  return (
    <>
      <div className="routerpage">this is gas/dash</div>
      {counter}
      <button onClick={() => setCounter(1)}>counterrrr</button>
    </>
  );
};

export default Dashboard;