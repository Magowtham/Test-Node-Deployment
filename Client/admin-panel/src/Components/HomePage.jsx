import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import "../Css/HomePage.css";
import { Routes, Route, useFetcher } from "react-router-dom";
import UserInfoTable from "./UserInfoTable";
import RechargeHistory from "./RechargeHistory";
import ExpenseHistory from "./ExpenseHistory";

function HomePage() {
  const [adminUserName, setAdminUserName] = useState("gowtham");
  const [isAddUserBtnClicked, setIsAddUserBtnClicked] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [addUserData, setAddUserData] = useState({
    rfid: "",
    name: "",
    rollnumber: "",
  });
  const [isAddUserFormSubmited, setIsAddUserFormSubmited] = useState(false);
  const [addUserFormErorr, setAddUserFormError] = useState({});
  const [isAddUserFormValidated, setIsAddUserFormValidated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRefresh, setSearchRefresh] = useState(false);
  const [initialRefresh, setInitialRefresh] = useState(true);
  const [searchInputClear, setSearchInputClear] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const addUserFormRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchUser = async (query) => {
    const result = await axios.get(
      `http://localhost:9000/client/search?query=${query}`
    );
    if (result.data?.status) {
      setSearchData(result.data?.users);
    }
  };

  const handleAddUser = () => {
    setIsAddUserBtnClicked(true);
  };
  const handleAddUserForm = (e) => {
    e.preventDefault();
    setIsAddUserFormValidated(false);
    setAddUserFormError({});
    setAddUserData({
      rfid: e.target[0].value,
      name: e.target[1].value,
      rollnumber: e.target[2].value,
    });
    setIsAddUserFormSubmited(true);
  };
  const addUserFormValidater = () => {
    const error = {};
    if (!addUserData.rfid) {
      error.rfidError = "RFID Required";
    }
    if (!addUserData.name) {
      error.nameError = "Student Name Required";
    }
    if (!addUserData.rollnumber) {
      error.rollNumberError = "Studnet Roll Number Required";
    }
    setAddUserFormError(error);
    return true;
  };
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsAddUserBtnClicked(false);
    }
  };
  const handleOverlay = () => {
    setIsAddUserBtnClicked(false);
  };
  const handleRefresh = (e) => {
    e.preventDefault();
    setAddUserFormError({});
    for (let i = 0; i < 3; i++) {
      addUserFormRef.current[i].value = "";
    }
  };
  useEffect(() => {
    if (searchQuery) {
      searchUser(searchQuery);
      setSearchRefresh(false);
      setInitialRefresh(false);
    } else {
      setSearchRefresh(true);
    }
  }, [searchQuery]);
  useEffect(() => {
    console.log(searchInputClear);
    if (searchInputClear) {
      searchInputRef.current.value = "";
    }
  }, [searchInputClear]);
  useEffect(() => {
    if (isAddUserFormSubmited) {
      setIsAddUserFormValidated(addUserFormValidater());
      setIsAddUserFormSubmited(false);
    }
  }, [isAddUserFormSubmited]);
  useEffect(() => {
    if (isAddUserFormValidated && Object.keys(addUserFormErorr).length === 0) {
      (async () => {
        try {
          setIsFormLoading(true);
          const result = await axios.post(
            "http://localhost:9000/client/adduser",
            addUserData
          );
          if (result.data?.status) {
            setAddUserFormError({ serverMessage: result.data?.message });
          } else {
            setAddUserFormError({ serverMessage: result.data?.message });
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsFormLoading(false);
        }
      })();
    }
  }, [isAddUserFormValidated]);
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });
  return (
    <>
      <div className="home-page-container">
        <div
          className={`overlay ${isAddUserBtnClicked ? `open` : ``}`}
          onClick={handleOverlay}
        ></div>
        <nav>
          <div className="logo-sec">
            <img src="/alvas.png" alt="" />
          </div>
          <div className="heading-sec">
            <h1>TELEPHONE TRANSACTION MANAGEMENT SYSTEM</h1>
            <h3>For Secure Data And Management</h3>
          </div>
          <div className="search-bar-sec">
            <div className="search-bar">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="RFID or Name or RollNumber..."
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
              <button>Search</button>
            </div>
          </div>
        </nav>
        <div className="user-table-sec">
          <Routes>
            {/* <Route
              exact
              path="/"
              element={
                <UserInfoTable
                  adminUserName={adminUserName}
                  searchData={searchData}
                  searchRefresh={searchRefresh}
                  initialRefresh={initialRefresh}
                  inputClear={setSearchInputClear}
                />
              }
            /> */}
            <Route path="/rechargeHistory" element={<RechargeHistory />} />
            <Route path="/expenseHistory" element={<ExpenseHistory />} />
          </Routes>
        </div>
        <div className="footer-sec">
          <button className="daily-history-btn">
            Daily History
            <span class="material-symbols-outlined">download</span>
          </button>
          <button className="monthly-history-btn">
            Monthly History
            <span class="material-symbols-outlined">download</span>
          </button>
          <button className="full-history-btn">View History</button>
          <button onClick={handleAddUser} className="add-user-btn">
            Add Student
            <span class="material-symbols-outlined">add</span>
          </button>
        </div>
        <form
          className={`add-user-form ${isAddUserBtnClicked ? `open` : ``}`}
          onSubmit={handleAddUserForm}
          ref={addUserFormRef}
        >
          <p>{addUserFormErorr.rfidError}</p>
          <input type="text" placeholder="Student RFID..." />
          <p>{addUserFormErorr.nameError}</p>
          <input type="text" placeholder="Student Name..." />
          <p>{addUserFormErorr.rollNumberError}</p>
          <input type="text" placeholder="Student RollNumber" />
          <div className="form-footer-sec">
            <p>{addUserFormErorr.serverMessage}</p>
            <div className="btn-sec">
              <button type="submit">Submit</button>
              <button onClick={handleRefresh}>Refresh</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default HomePage;
