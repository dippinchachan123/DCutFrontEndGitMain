import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { DarkModeContextProvider } from "./context/darkModeContext";
import "./common.css"; // Import the common CSS file

ReactDOM.render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <App />
    </DarkModeContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);




