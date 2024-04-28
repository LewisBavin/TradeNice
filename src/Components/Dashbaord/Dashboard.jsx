import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { accountActions } from "../../Utilities/Slices/AccountSlice";
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

const Dashboard = ({ account }) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    drop: [],
    view: account.view,
  });

  const navMenu = [
    {
      title: "Market Overview",
      inner: [
        {
          title: "Gas Prices",
          header: "UK and EU Gas Spot Prices",
          elem: <Prices />,
        },
        {
          title: "Grid Flows",
          header: "UK National Grid Flows",
          elem: <Flows />,
        },
      ],
    },
    {
      title: "Your Balances",
      inner: [
        {
          title: "Current",
          header: "Your Current and Future Nominated Balances",
          elem: <Noms />,
        },
        {
          title: "Historic",
          header: "Your Historic Allocated Balances",
          elem: <Allocs />,
        },
      ],
    },
    {
      title: "Trading",
      inner: [
        { title: "Create", header: "Create Trade Requests", elem: <Create /> },
        {
          title: "Pending",
          header: "Your Pending Trade Requests",
          elem: <Pending />,
        },
        {
          title: "Agreed Trades",
          header: "Your Matched Counterparty Trades",
          elem: <Agreed />,
        },
        {
          title: "Dispute",
          header: "See an issue with any matched trades? Raise a dispute",
          elem: <Dispute />,
        },
      ],
    },
    {
      title: "Account",
      inner: [
        {
          title: "Account Details",
          header: "Update Account Details",
          elem: <Details />,
        },
        {
          title: "Contact Us",
          header: "We'd Love to hear from you",
          elem: <Contact />,
        },
      ],
    },
  ];

  useEffect(() => {
    setState({ ...state, drop: navMenu.map((m) => false) });
  }, []);

  let showDropdown = (i, hideAll = false) => {
    let drop = [...state.drop];
    drop = drop.map((d, j) => i == j && !hideAll);
    setState({ ...state, drop });
  };

  let setView = (i, j, hide = false) => {
    setState(
      hide
        ? { ...state, view: [i, j], drop: [...state.drop].map((d) => false) }
        : { ...state, view: [i, j] }
    );
    dispatch(accountActions.setView([i, j]));
  };

  let { drop, view } = state;
  let [main, inner] = view;
  let mainTab = navMenu[main];
  let innerTab = mainTab.inner[inner];
  return (
    <div className="dashContainer">
      <Navbar
        onMouseLeave={() => showDropdown(0, true)}
        expand="lg"
        className="bg-body-tertiary"
      >
        <Container>
          <Navbar.Brand href="#home">Trade... nicely</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="dashCollapse">
            <Nav variant="pills">
              <Container>
                {navMenu.map((nav, i) => {
                  return (
                    <NavDropdown
                      title={navMenu[i].title}
                      show={drop[i]}
                      onMouseEnter={() => showDropdown(i)}
                      className={
                        drop.every((t) => !t)
                          ? i == main
                            ? "bg-success"
                            : ""
                          : drop[i]
                          ? "bg-success"
                          : ""
                      }
                    >
                      {nav.inner.map((inner, j) => {
                        return (
                          <Container key={j}>
                            <Row>
                              <NavDropdown.Divider />
                              <NavDropdown.Item
                                onMouseEnter={() => showDropdown(i)}
                                onClick={() => {
                                  setView(i, j);
                                }}
                              >
                                {navMenu[i].inner[j].title}
                              </NavDropdown.Item>
                            </Row>
                          </Container>
                        );
                      })}
                    </NavDropdown>
                  );
                })}

                {mainTab.inner.map((tab, k) => {
                  return (
                    <NavItem
                      onMouseEnter={() => {
                        showDropdown(0, true);
                      }}
                      onClick={() => {
                        setView(main, k);
                      }}
                    >
                      <Nav.Link className="text-nowrap">{tab.title}</Nav.Link>
                    </NavItem>
                  );
                })}
              </Container>
            </Nav>
            <Nav className="me-auto" justify variant="tabs"></Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <Nav variant="pills">
            {navMenu.map((mainTab, k) => {
              return (
                <Nav.Item>
                  <Nav.Link
                    eventKey={k}
                    onClick={() => {
                      setView(main, k);
                    }}
                  >
                    {mainTab.title}
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
        </Row>
        <Row></Row>
      </Container>

      {/*  <div className="contentContainer">
        <div className="contentHeader">{innerTab.header}</div>
        <div className="content">{innerTab.elem}</div>
      </div> */}
    </div>
  );
};

export default Dashboard;
