import React from "react";
import { getStore } from "../../Utilities/localStorage";
import { useDispatch } from "react-redux";
import { accountActions } from "../../Utilities/AccountSlice";
import { useNavigate } from "react-router-dom";

function Header(props) {

  return (
    <>
      <div className="flx col">
        <div className="flx">
          <div>GBPS - Gas & Power Balancing System</div>
          <div className="flx">
            <button onClick={props.toggleLogin}>Log Out</button>
            <button>Switch to Power</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;