export const userIdxOfID = (obj, id) => obj.map((user) => user.id).indexOf(id);
export const userIdxOfName = (obj, name) =>
  obj.map((user) => user.name).indexOf(name);

export const gasUsers = [
  { id: 0, name: "gas00", password: "password" },
  { id: 1, name: "gas01", password: "password" },
  { id: 2, name: "gas02", password: "password" },
];
