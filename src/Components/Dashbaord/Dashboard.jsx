import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { accountActions } from "../../Slices/AccountSlice";
import {
  Accordion,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  NavbarText,
  NavItem,
  Row,
  Col,
} from "react-bootstrap";
import Prices from "./1_Market/Prices";
import Flows from "./1_Market/Flows";
import Noms from "./2_Balance/Noms";
import Allocs from "./2_Balance/Allocs";
import Create from "./3_Trading/Create";
import Pending from "./3_Trading/Pending";
import Agreed from "./3_Trading/Agreed";
import Dispute from "./3_Trading/Dispute";
import Details from "./4_Account/Details";
import Contact from "./4_Account/Contact";
import { useEffect } from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import axios from "axios";

const Dashboard = ({ account }) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    view: !account.view ? { main: 0, inner: 0 } : account.view,
  });
  const [users, setUsers] = useState(account.users);

  useEffect(() => {
    if (!users) {
      (async function getUsers() {
        let users = (
          await axios.get("http://localhost:6002/user/get/users", {
            headers: { token: account.user.token },
          })
        ).data.users;
        if (users) {
          setUsers(users);
          dispatch(accountActions.setUsers(users));
        } else {
          dispatch(
            accountActions.setToast({
              trigger: true,
              strong: "Session error",
              variant: "danger",
              body: "Please log out and in again",
            })
          );
        }
      })();
    }
  }, [users]);

  const navMenu = [
    {
      title: "Trading",
      inner: [
        {
          title: "Create Trades",
          header: "Post Bids & Offers to Desired Counterparties",
          elem: <Create account={account} users={users} />,
        },
        {
          title: "Pending Trades",
          header: "Edit Your Pending Trades & Action Counterparty Trades",
          elem: <Pending account={account} users={users} />,
        },
        {
          title: "Agreed Trades",
          header: "View Your Matched Trades",
          elem: <Agreed account={account} users={users} />,
        },
        {
          title: "Dispute",
          header: "See An Issue With A Trade? Raise A Dispute",
          elem: <Dispute account={account} users={users} />,
        },
      ],
    },
    {
      title: "Your Balances",
      inner: [
        {
          title: "Current",
          header: "Your Current and Future Nominated Balances",
          elem: <Noms account={account} />,
        },
        {
          title: "Historic",
          header: "Your Historic Allocated Balances",
          elem: <Allocs account={account} />,
        },
      ],
    },
    {
      title: "Market Overview",
      inner: [
        {
          title: "Gas Prices",
          header: "UK and EU Gas Spot Prices",
          elem: <Prices account={account} />,
        },
        {
          title: "Grid Flows",
          header: "UK National Grid Flows",
          elem: <Flows account={account} />,
        },
      ],
    },

    {
      title: "Account",
      inner: [
        {
          title: "Account Details",
          header: "Update Account Details",
          elem: <Details account={account} />,
        },
        {
          title: "Contact Us",
          header: "We'd Love to hear from you",
          elem: <Contact account={account} />,
        },
      ],
    },
  ];

  let setTabs = (i, j = 0, external = false) => {
    let view = { main: i, inner: j };
    setState({ ...state, view });
    external && dispatch(accountActions.setView(view));
  };

  let lastTabs = () => {
    let view = account.view;
    setState({ ...state, view });
  };

  let { view } = state;
  let { main, inner } = view;
  let mainTab = navMenu[main];
  let content = navMenu[account.view.main].inner[account.view.inner];

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-body-tertiary mx-5"
        style={{ borderRadius: "30px" }}
        onMouseLeave={() => {
          lastTabs();
        }}
      >
        <Container>
          <Col xs={2}>
            <Navbar.Brand
              href="#home"
              className="text-center text-wrap fs-8"
              xs={2}
            >
              {content.header}
            </Navbar.Brand>
          </Col>
          <Col>
            <Container className="text-center text-nowrap px-5">
              <Nav
                variant="pills"
                className="justify-content-md-center outer fs-6 py-1"
              >
                <Row
                  className="py-0"
                  style={{
                    backgroundColor: "grey",
                  }}
                >
                  {navMenu.map((tab, i) => {
                    return (
                      <Col key={i}>
                        <Nav.Item
                          style={{
                            backgroundColor: "darkgrey",
                          }}
                          onMouseEnter={() => {
                            setTabs(i);
                          }}
                        >
                          <Nav.Link active={i == main}>{tab.title}</Nav.Link>
                        </Nav.Item>
                      </Col>
                    );
                  })}
                </Row>
              </Nav>
              <Nav
                variant="pills"
                className="justify-content-md-center inner fs-7 py-1"
              >
                <Row
                  className="py-0"
                  style={{
                    backgroundColor: "grey",
                  }}
                >
                  {mainTab.inner.map((tab, j) => {
                    return (
                      <Col key={j}>
                        <Nav.Item
                          style={{
                            backgroundColor: "grey",
                          }}
                          onMouseEnter={() => {
                            setTabs(main, j);
                          }}
                        >
                          <Nav.Link
                            active={j == inner}
                            eventKey={j}
                            onClick={() => {
                              setTabs(main, j, true);
                            }}
                          >
                            {tab.title}
                          </Nav.Link>
                        </Nav.Item>
                      </Col>
                    );
                  })}
                </Row>
              </Nav>
            </Container>
          </Col>
        </Container>
      </Navbar>
      <Container className="content">
        <div className="contents">{content.elem}</div>
      </Container>
    </>
  );
};

export default Dashboard;
