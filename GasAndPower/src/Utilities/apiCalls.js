import axios from "axios";
import { add, format } from "date-fns";

export const getGasPrices = (start, nDays = 0) => {
  return axios.get(
    `https://api.energidataservice.dk/dataset/Elspotprices?` +
      `start=` +
      format(start, "yyyy-MM-dd") +
      `&end=` +
      format(add(start, { days: nDays + 1 }), "yyyy-MM-dd") +
      `&filter={"PriceArea":["DK1"]}&sort=HourUTC`
  );
};

export const getElecPrices = (start, nDays = 0) => {
  return axios.get(
    `https://api.energidataservice.dk/dataset/Elspotprices?` +
      `start=` +
      format(start, "yyyy-MM-dd") +
      `&end=` +
      format(add(start, { days: nDays + 1 }), "yyyy-MM-dd") +
      `&filter={"PriceArea":["SYSTEM"]}&sort=HourUTC`
  );
};

export const getGridPrices = (start, end = start) => {
  return axios.get(
    `https://api.energidataservice.dk/dataset/Elspotprices?` +
      `start=` +
      format(start, "yyyy-MM-dd") +
      `&end=` +
      format(add(end,{days: 1}), "yyyy-MM-dd") +
      `&filter={"PriceArea":["SYSTEM", "DK1"]}&sort=HourUTC`
  );
};
