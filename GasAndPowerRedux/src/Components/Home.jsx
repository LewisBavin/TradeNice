import React from "react";
import { setAccountType, readAccountType } from "../Utilities/AccountSlice";
import { useSelector, useDispatch } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  const accountType = useSelector(readAccountType);
  return (
    <>
      <button id="gasPortal" onClick={() => {}}>
        Gas
      </button>
    </>
  );
};

export default Home;
