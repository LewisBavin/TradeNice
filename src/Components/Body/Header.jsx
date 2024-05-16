import React from "react";
import { useDispatch } from "react-redux";
import { accountActions } from "../../Slices/AccountSlice";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import DailyPrice from "../Dashbaord/1_Market/DailyPrice";
import { addDays, startOfDay } from "date-fns";

function Header({ account }) {
  const dispatch = useDispatch();

  const logOut = async (e, type = "this") => {
    await axios.delete(`http://localhost:6002/user/logout/${type}`, {
      headers: { token: account.user.token },
    });
    dispatch(accountActions.logOut());
    dispatch(
      accountActions.setToast({
        trigger: true,
        strong: "Goodbye!",
        small: "see you soon",
        variant: "success",
        body:
          type == "this" ? "this session logged out" : "All devices logged out",
      })
    );
  };

  const showLogin = () => {
    dispatch(accountActions.showLogin());
  };

  return (
    <Navbar>
      <Container className="flx">
        <Navbar.Brand>
          <div>TradeNice :)</div>
        </Navbar.Brand>
        {account.loggedIn && (
          <div className="flx prices jc-c" style={{ width: "100%" }}>
            <DailyPrice dateStr={new Date()} />
            <DailyPrice dateStr={addDays(new Date(), 1)} />
          </div>
        )}
        <Navbar.Collapse>
          <Nav className="me-auto">
            <div className="position-absolute end-1 translate-middle">
              {account.loggedIn ? (
                <NavDropdown
                  className="position-absolute end-0 translate-middle"
                  title={account.user.name}
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Header>
                    {"Welcome " + account.user.name.split(" ")[0] + " :)"}
                  </NavDropdown.Header>
                  <NavDropdown.Divider />

                  <NavDropdown.Item
                    onClick={(e) => {
                      logOut(e);
                    }}
                  >
                    Log Out
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={(e) => {
                      logOut(e, "all");
                    }}
                  >
                    Log Out (Everywhere)
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Item
                  onClick={() => {
                    showLogin();
                  }}
                >
                  Login
                </Nav.Item>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
