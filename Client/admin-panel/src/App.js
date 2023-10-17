import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./Css/App.css";
import PageLoader from "./Components/PageLoader";
const HomePage = lazy(() => import("./Components/HomePage"));
const AdminLogin = lazy(() => import("./Components/AdminLogin"));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="*" exact Component={HomePage} />
        <Route path="/login" Component={AdminLogin} />
      </Routes>
    </Suspense>
  );
}

export default App;
