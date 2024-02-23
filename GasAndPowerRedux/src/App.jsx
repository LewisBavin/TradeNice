import { useState } from "react";
import "./App.css";

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
