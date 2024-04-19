import axios from "axios";
import { add, format } from "date-fns";



export const getGridPrices = (start, end = start) => {
  console.log('start - ', start)
  console.log('end - ', end)
  return axios.get(
    `https://api.energidataservice.dk/dataset/Elspotprices?` +
      `start=` +
      format(start, "yyyy-MM-dd") +
      `&end=` +
      format(add(end,{days: 1}), "yyyy-MM-dd") +
      `&filter={"PriceArea":["SYSTEM", "DK1"]}&sort=HourUTC`
  );
};
