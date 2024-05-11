import React, { useState } from "react";

const Balance = () => {
  const [transputs, setTransputs] = useState([]);
  const [trades, setTrades] = useState([]);

  const mainKeys = ["inputs", "outputs"];
  const innerKeys = ["nominated", "allocated"];

  const balance = mainKeys.reduce((mainAcum, main) => {
    mainAcum[main] = innerKeys.reduce((innerAcum, inner) => {
      innerAcum[inner] = {
        transput() {
          return getTransput(main, inner);
        },
      };
      return innerAcum;
    }, {});
    return mainAcum;
  }, {});

  let filterData = (type, main, inner) => {
    if (type == "transputs") {
      return transputs.filter(
        (t) => t.transput == (main == "inputs" ? "I" : "O")
      );
    }
    return trades.filter((t) => t);
  };

  /*     const mainKeys = {inputs: "Inputs", outputs: "Outputs"}
    const innerKeys = {nominated: "Nominated", allocated: "Allocated"}
    const content = {
        title: "",
        nomd: {
          title: "",
          transput: { title: "", nomd(){}},
          trades: {
            title: "",
            nomd: [],
            total() {
              return [...this.nomd].reduce(
                (accum, trade) => accum + trade.volume,
                0
              );
            },
          },
          total() {
            return this.trades.total() + this.transput.nomd.volume || 0;
          },
        },
      }; */

  /*   const [balance, setBalance] = useState({
    Inputs: {
        test: ( async function doo(){return "lol"})(),
      title: "",
      nomd: {
        title: "",
        transput: { title: "", nomd: {} },
        trades: {
          title: "",
          nomd: [],
          total() {
            return [...this.nomd].reduce(
              (accum, trade) => accum + trade.volume,
              0
            );
          },
        },
      },
      aloc: {
        title: "",
        transput: { title: "", nomd: {} },
        trades: {
          title: "",
          nomd: [],
          total() {
            return [...this.nomd].reduce(
              (accum, trade) => accum + trade.volume,
              0
            );
          },
        },
        total() {
          return this.trades.total() + this.transput.nomd.volume || 0;
        },
      },
    },
  });

console.log(balance) */

  return <>Noms</>;
};

export default Balance;
