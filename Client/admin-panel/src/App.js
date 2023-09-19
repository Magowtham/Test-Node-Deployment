import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Components/HomePage";
import AdminLogin from "./Components/AdminLogin";

function App() {
  return (
    <>
      <Routes>
        <Route path="*" exact Component={HomePage} />
        <Route path="/login" Component={AdminLogin} />
      </Routes>
    </>
  );
}

export default App;
