import axios from "axios";
import { add, format } from "date-fns";

export const getGasPrices = (start, nDays = 0) => {
  console.log('getting', start)
  return axios.get(
    `https://api.energidataservice.dk/dataset/Elspotprices?` +
      `start=` +
      format(start, "yyyy-MM-dd") +
      `&end=` +
      format(add(start, { days: nDays + 1 }), "yyyy-MM-dd") +
      `&filter={"PriceArea":["DK1"]}&sort=HourUTC`
  );
};
