import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Components/HomePage";
// import Test2 from "./Components/Test2";

function App() {
  return (
    <>
      <Routes>
        <Route path="*" exact Component={HomePage} />
        {/* <Test2 /> */}
      </Routes>
    </>
  );
}

export default App;
