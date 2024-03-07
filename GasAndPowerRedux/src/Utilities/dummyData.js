export const gasUsers = {
  1: {
    id: 1,
    name: "gas01",
    password: "password",

    inputs: {
      counterpartyBuys: {
        noms: [
          {
            id: 1,
            counterpartyId: 2,
            amount: 100,
          },
        ],
      },
      marketBuys: {},
      production: {},
      acqiasitions: {},
    },
    outputs: {
      counterpartySells: {},
      marketSells: {},
      consumption: {},
      disposals: {},
      gridOfftake: {},
    },
  },
  2: {
    id: 2,
    name: "gas02",
    password: "password",

    inputs: {
      counterpartyBuys: {},
      marketBuys: {},
      production: {},
      acqiasitions: {},
    },
    outputs: {
      counterpartySells: {
        noms: [
          {
            counterpartyId: 1,
            amount: 100,
          },
        ],
      },
      marketSells: {},
      consumption: {},
      disposals: {},
      gridOfftake: {},
    },
  },
};
