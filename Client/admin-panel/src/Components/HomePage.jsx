import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Css/HomePage.css";
import { Routes, Route } from "react-router-dom";
import RechargeHistory from "./RechargeHistory";
import UserInfoTable from "./UserInfoTable";

function HomePage() {
  const [adminUserName, setAdminUserName] = useState("gowtham");
  return (
    <>
      <div className="home-page-container">
        <nav></nav>
        <div className="user-table-sec">
          <Routes>
            <Route
              exact
              path="/"
              element={<UserInfoTable adminUserName={adminUserName} />}
            />
            <Route path="/rechargeHistory" element={<RechargeHistory />} />
          </Routes>
        </div>
        <div className="footer-sec">
          <button>Daily History</button>
          <button>Monthly History</button>
          <button>View History</button>
          <button>Add Student</button>
        </div>
      </div>
    </>
  );
}

export default HomePage;
