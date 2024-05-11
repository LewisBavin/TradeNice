import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { accountActions } from "../../Slices/AccountSlice";
import { Row, Col } from "react-bootstrap";
import Prices from "./1_Market/Prices";
import Flows from "./1_Market/Flows";
import Noms from "./2_Balance/Noms";

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
import axios from "axios";
import { getGridPricesAll } from "../../Utilities/apiCalls";
import { graphActions, readGraph } from "../../Slices/GraphSlice";
import Balance from "./2_Balance/Balance";

const Dashboard = ({ account }) => {
  const dispatch = useDispatch();
  const graph = useSelector(readGraph);
  const [state, setState] = useState({
    view: !account.view ? { main: 0, inner: 0 } : account.view,
  });
  const [users, setUsers] = useState(account.users);
  const [prices, setPrices] = useState(graph.prices);

  useEffect(() => {
    !prices &&
      (async function getPrices() {
        let allPrices = (await getGridPricesAll()).data.records;
        let prices = allPrices.reduce(
          (accum, val) => {
            accum[val.PriceArea == "SYSTEM" ? "uk" : "eu"].push({
              x: val.HourUTC,
              y: val.SpotPriceEUR / 100,
            });
            return accum;
          },
          { uk: [], eu: [] }
        );
        setPrices(prices);
        dispatch(graphActions.setAll(prices));
      })();
  }, [prices]);

  useEffect(() => {
    !users &&
      (async function getUsers() {
        let gotUsers = (
          await axios.get("http://localhost:6002/user/get/users", {
            headers: { token: account.user.token },
          })
        ).data.users;
        if (gotUsers) {
          setUsers(gotUsers);
          dispatch(accountActions.setUsers(gotUsers));
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
  }, [users]);

  const navMenu = [
    {
      title: "Your Balances",
      inner: [
        {
          title: "Net Balances",
          header: "Your Overall Gas Balances",
          elem: <Balance account={account} />,
        },
        {
          title: "Transput Nominations",
          header:
            "Nominate your projected production inputs and offtakes into the Grid",
          elem: <Noms account={account} />,
        },
      ],
    },
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
          header: "View Your Matched Trades & Raise Disputes",
          elem: <Agreed account={account} users={users} />,
        },
        {
          title: "Dispute",
          header: "Check Dispute Statuses",
          elem: <Dispute account={account} users={users} />,
        },
      ],
    },

    {
      title: "Market Overview",
      inner: [
        {
          title: "Gas Prices",
          header: "UK and EU Gas Spot Prices",
          elem: <Prices account={account} allPrices={prices} />,
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
        {users && <div className="contents">{content.elem}</div>}
      </Container>
    </>
  );
};

export default Dashboard;
