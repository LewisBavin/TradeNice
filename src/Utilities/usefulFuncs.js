export const indexByObjKeyVal = (arr, key, val) =>
  arr.findIndex((obj) => obj[key] === val);

export const arrObjByKeyVal = (arr, key, val) => {
  return arr[indexByObjKeyVal(arr, key, val)];
};

export const numberWithCommas = (x) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
