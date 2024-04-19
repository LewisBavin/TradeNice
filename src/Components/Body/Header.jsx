import React from "react";
import { getStore } from "../../Utilities/localStorage";
import { useDispatch } from "react-redux";
import { accountActions } from "../../Utilities/Slices/AccountSlice";
import { useNavigate } from "react-router-dom";

function Header(props) {
  const { account, toggleLogin } = props;

  return (
    <>
      <div className="flx col">
        <div className="flx">
          <div>GBPS - Gas & Power Balancing System </div>
          {account.user && account.loggedIn && <>Welcome {account.user.name}</>}
          <div className="flx">
            <button onClick={toggleLogin}>Log Out</button>
            <button>Switch to Power</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
