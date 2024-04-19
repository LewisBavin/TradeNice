import React from "react";
import Request from "./Request";
import { gasUsers } from "../../Utilities/systemUsers";
import { actionButtons } from "../Buttons";

const Requests = ({ reqs, reverse, yourID }) => {
  const users = gasUsers.map(({ id, name }) => {
    return { id, name };
  });
  const b = actionButtons;

  const buysSells = ["input", "output"];
  reverse && buysSells.reverse();

  const buttons = reverse
    ? [b.requestAccept, b.requestReject]
    : [b.requestEdit, b.requestWithdraw];

  return (
    <>
      {buysSells.map((direction, i) => {
        return (
          <div key={i} className={direction}>
            <div className="header">
              {direction == "input" ? "Buys" : "Sells"}
            </div>
            <div className="requestsAll">
              {users.map((user, j) => {
                const reqByCounter = reqs.filter((req) => {
                  return reverse
                    ? req.userID == user.id && req.direction == direction
                    : req.counterID == user.id && req.direction == direction;
                });
                return (
                  reqByCounter.length > 0 && (
                    <div key={j} className="counterParty">
                      <div className="header">{user.name}</div>
                      <div className="requests">
                        {reqByCounter.map((req, k) => {
                          return (
                            <Request req={req} key={k} buttons={buttons} />
                          );
                        })}
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Requests;
