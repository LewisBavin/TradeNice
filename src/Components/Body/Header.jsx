import React from "react";
import { getStore } from "../../Utilities/localStorage";
import { useDispatch } from "react-redux";
import { accountActions } from "../../Utilities/Slices/AccountSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Header({ account }) {
  const dispatch = useDispatch();
  
  const logOut = async () => {
    await axios.delete(`http://localhost:6002/user/logout/this`,account.user.token)
    dispatch(accountActions.logOut());
  };

  <button onClick={logOut}>logout</button>;

  return (
    <>
      <div className="flx col">
        <div className="flx jc-sb">
          <div>GBPS - Gas & Power Balancing System </div>

          <div className="flx">
            {account.user && (
              <>
                Welcome {account.user.name.toUpperCase()}
                <button onClick={logOut}>logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
