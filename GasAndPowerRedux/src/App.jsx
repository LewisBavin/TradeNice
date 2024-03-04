import { useState } from "react";
import { useDispatch } from "react-redux";
import "./Styles/App.css";
import { apiTokens } from "./Utilities/apiTokens";

console.log(apiTokens.stockData.current());

function App() {
  const [state, setState] = useState(null);

  return <>hi</>;
}

export default App;
