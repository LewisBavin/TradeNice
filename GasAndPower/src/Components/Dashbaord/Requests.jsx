import React from "react";
import Request from "./Request";
import { gasUsers } from "../../Utilities/systemUsers";

const Requests = ({ reqs, reverse, yourID }) => {
  const users = gasUsers.map(({ id, name }) => {
    return { id, name };
  });

  const counterParties = gasUsers.map(({ id, name }) => {
    return { id, name };
  });

  const buys = reqs.filter((req) => {
    return req.direction === "input";
  });
  const sells = reqs.filter((req) => {
    return req.direction == "output";
  });
  console.log(reverse ? "counter" : "you")
  console.log(  "buys: ", buys, "sells: ", sells);

  return (
    <div className={"flx col" + (reverse ? "-r" : "")}>
      <div className="inputs">
        <div className="header">Buys</div>
        <div className="requests">
          {users.map((user) => {
            return (
              <>
                {((!reverse && user.id !== yourID) ||
                  (reverse && user.id == yourID)) && (
                  <div className="counterParty">
                    <div className="header">{user.name}</div>
                    {buys
                      .filter((req) => {
                        return req.counterID == user.id;
                      })
                      .map((req) => {
                        return (
                          <>
                            <div>{req.volume}</div>
                          </>
                        );
                      })}
                  </div>
                )}
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Requests;
