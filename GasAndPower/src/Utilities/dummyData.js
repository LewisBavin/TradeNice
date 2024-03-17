export const userIdxOfID = (obj, id) => obj.map((user) => user.id).indexOf(id);
export const userIdxOfName = (obj, name) =>
  obj.map((user) => user.name).indexOf(name);

export var gasUsers;

gasUsers = [
  {
    id: 0,
    name: "gas00",
    password: "password",
    noms: {
      ins: {
        counterparty: [{}],
        production: {},
      },
    },
  },
  {
    id: 1,
    name: "gas01",
    password: "password",
    noms: {
      inputs: {
        counterparty: {},
      },
      outputs: {
        counterparty: {},
      },
    },
  },
  {
    id: 2,
    name: "gas02",
    password: "password",
    noms: {
      inputs: {
        counterparty: {},
      },
      outputs: {
        counterparty: {},
      },
    },
  },
];
