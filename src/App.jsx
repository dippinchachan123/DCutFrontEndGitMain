import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import React from 'react';
import { GlobalRoute } from "./routes/commonRoutes";
import { UserProvider } from "./context/kapanContext";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  
  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <UserProvider>
            <GlobalRoute />
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
