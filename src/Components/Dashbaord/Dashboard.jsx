import React from "react";
import TradingDispute from "./3_Trading/Dispute";
import TradingVerified from "./3_Trading/Agreed";
import TradingCreate from "./3_Trading/Create";
import TradingOutstanding from "./3_Trading/Pending";
import { useState } from "react";
import GasPrices from "./1_Market/Prices";
import { useDispatch } from "react-redux";
import { accountActions } from "../../Utilities/Slices/AccountSlice";
import Dropdown from "react-bootstrap/Dropdown";
import {
  DropdownMenu,
  DropdownToggle,
  NavbarText,
  NavItem,
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
          title: "View Requests",
          header: "Your Pending Trade Requests",
          elem: <Pending />,
        },
        { title: "Agreed", header: "Your Matched Trades", elem: <Agreed /> },
        { title: "Dispute", header: "Raise a Dispute", elem: <Dispute /> },
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
    console.log([...state.drop].map((d) => false));
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
    <>
      <div className="dashContainer">
        <Navbar
          onMouseLeave={() => showDropdown(0, true)}
          expand="lg"
          className="bg-body-tertiary"
        >
          <Container>
            <Navbar.Brand href="#home">Trade... nicely</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="dashCollapse" className="flx col">
              <Nav className="me-auto">
                {navMenu.map((nav, i) => {
                  return (
                    <NavDropdown
                      title={navMenu[i].title}
                      key={i}
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
                          <NavDropdown.Item
                            key={j}
                            onMouseEnter={() => showDropdown(i)}
                            onClick={() => {
                              setView(i, j);
                            }}
                          >
                            {navMenu[i].inner[j].title}
                          </NavDropdown.Item>
                        );
                      })}
                    </NavDropdown>
                  );
                })}
              </Nav>
              <Nav
                activeKey="/home"
                className="me-auto"
                onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
              >
                {mainTab.inner.map((tab, j) => {
                  return (
                    <>
                      <NavItem
                        onMouseEnter={() => {
                          showDropdown(0, true);
                        }}
                        onClick={() => {
                          setView(main, j);
                        }}
                        className="px-2 pt-2"
                      >
                        {tab.title}
                      </NavItem>
                    </>
                  );
                })}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="contentContainer">
          <div className="contentHeader">{innerTab.header}</div>
          <div className="content">{innerTab.elem}</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
