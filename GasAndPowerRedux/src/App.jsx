import { useState } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import { apiTokens } from "./apiTokens";

console.log(apiTokens.stockData.current())

export const lStore = (key, value) => {
  localStorage.setItem(key, value);
};

export const lGet = (key) => {
  return localStorage.getItem(key);
};

function App() {
  const [state, setState] = useState(null);

  return <>hi</>;
}

export default App;
