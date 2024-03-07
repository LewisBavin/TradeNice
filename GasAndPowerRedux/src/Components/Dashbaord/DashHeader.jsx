import React from "react";
import { passID } from "../../Utilities/passElementId";
import { accountActions, readAccount } from "../../Utilities/AccountSlice";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../Body/Footer";
import GasBalance from "./gasBalance";
import GasAllocs from "./GasAllocs";
import GasSettings from "./GasSettings";
import GasNoms from "./GasNoms";

const DashHeader = () => {
  const { view } = useSelector(readAccount);
  const dispatch = useDispatch();
  const show = {
    gasBalance: <GasBalance />,
    gasAllocs: <GasAllocs />,
    gasNoms: <GasNoms />,
    gasSettings: <GasSettings />,
  };
  const changeView = (e) => {
    dispatch(accountActions.setView(e.target.id));
  };

  return (
    <>
      <div className="flx">
        <div id="gasBalance" className="dash select" onClick={changeView}>
          Balance
        </div>
        <div id="gasNoms" className="dash select" onClick={changeView}>
          Nominations
        </div>
        <div id="gasAllocs" className="dash select" onClick={changeView}>
          Allocations
        </div>
        <div id="gasSettings" className="dash select" onClick={changeView}>
          Settings
        </div>
      </div>
      {show[view]}
    </>
  );
};

export default DashHeader;
