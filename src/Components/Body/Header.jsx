import React from "react";
import { getStore } from "../../Utilities/localStorage";
import { useDispatch } from "react-redux";
import { accountActions } from "../../Utilities/Slices/AccountSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

function Header({ account }) {
  const dispatch = useDispatch();

  const logOut = async () => {
    console.log(account.user.token);
    await axios.delete(`http://localhost:6002/user/logout/this`, {
      headers: { token: account.user.token },
    });
    dispatch(accountActions.logOut());
  };

  return (
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
            <div>TradeNice :)</div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <div className="position-absolute end-0 translate-middle">
                {account.user && (
                  <NavDropdown
                    className="m-4"
                    title="Account"
                    id="basic-nav-dropdown"
                  >
                    <NavDropdown.Header>{"Welcome " + account.user.name.split(' ')[0] + " :)"}</NavDropdown.Header>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>Update Details</NavDropdown.Item>
                    <NavDropdown.Item>Contact Us</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logOut}>
                      Log Out
                    </NavDropdown.Item>
                    <NavDropdown.Item>Log Out (Everywhere)</NavDropdown.Item>
                  </NavDropdown>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}

export default Header;
