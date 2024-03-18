export const userIdxOfID = (obj, id) => obj.map((user) => user.id).indexOf(id);
export const userIdxOfName = (obj, name) =>
  obj.map((user) => user.name).indexOf(name);

export var gasUsers = [
  {
    id: 0,
    name: "gas00",
    password: "password",
    noms: {
      input: {
        counterparty: [],
        market: [],
        production: [],
        import: [],
      },
      output: {
        counterparty: [],
        market: [],
        usage: [],
        export: [],
      },
    },
  },
  {
    id: 1,
    name: "gas01",
    password: "password",
    noms: {
      inputs: {
        counterparty: [],
        market: [],
        production: [],
        import: [],
      },
      outputs: {
        counterparty: [],
        market: [],
        usage: [],
        export: [],
      },
    },
  },
  {
    id: 2,
    name: "gas02",
    password: "password",
    noms: {
      inputs: {
        counterparty: [],
        market: [],
        production: [],
        import: [],
      },
      outputs: {
        counterparty: [],
        market: [],
        usage: [],
        export: [],
      },
    },
  },
];
