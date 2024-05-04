import React, { useEffect, useState } from "react";
import Header from "./Components/Body/Header";
import Footer from "./Components/Body/Footer";
import Home from "./Components/Body/Home";

import { Routes, Route } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { accountActions, readAccount } from "./Slices/AccountSlice";
import MyToast from "./Components/MyToast";

function Interface() {
  const dispatch = useDispatch();
  const [toast, setToast] = useState({ trigger: false });
  let account = useSelector(readAccount);

  useEffect(() => {
    toast.trigger &&
      setTimeout(
        () => {
          setToast({ trigger: false });
          dispatch(accountActions.setToast({ trigger: false }));
        },
        !account.toast.delay ? 2000 : account.toast.delay
      );
    !toast.trigger && account.toast.trigger && setToast(account.toast);
  });

  return (
    <>
      <div className="root-container flx col ai-c jc-c">
        <header>
          <Header account={account} />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home account={account} />}></Route>
          </Routes>
          {toast.trigger && <MyToast toastSettings={toast} />}
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
}

export default Interface;
