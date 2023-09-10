import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../Css/HomePage.css";
import ReactPaginate from "react-paginate";
import { Routes, Route, useNavigate } from "react-router-dom";
import RechargeHistory from "./RechargeHistory";
function HomePage() {
  const navigate = useNavigate();
  const [adminUserName, setAdminUserName] = useState("gowtham");
  const [pageData, setPageData] = useState([]);
  const [pageSize] = useState(5);
  const [presentPage, setPresentPage] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [isRemoveClicked, setIsRemoveClicked] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [removeFormData, setRemoveFormData] = useState("");
  const [isRemoveSubmited, setIsRemoveSubmited] = useState(false);
  const [removeFormError, setRemoveFormError] = useState({});
  const [isRemoveFormValidated, setIsRemoveFormValidated] = useState(false);
  const [removeRfid, setRemoveRfid] = useState("");
  const [editData, setEditData] = useState({
    admin: "",
    rfid: "",
    name: "",
    rollnumber: "",
    password: "",
  });
  const [isEditSubmited, setIsEditSubmited] = useState(false);
  const [isEditValidated, setIsEditValidated] = useState(false);
  const [editError, setEditError] = useState({});
  const removeFormInputRef = useRef(null);
  const handleRechargeHistory = () => {
    navigate("/rechargeHistory");
  };
  const fetchPageData = async (pageNumber, totalCount) => {
    try {
      setIsLoading(true);
      const result = await axios.get(
        `http://localhost:9000/client/getuser?pageNumber=${pageNumber}&pageLimit=${pageSize}`
      );
      if (totalCount) {
        setTotalUsers(result?.data.totalUsers);
      }
      setPageData(result?.data.users);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (e) => {
    fetchPageData(e.selected + 1, false, false, null, false, null, true);
    setPresentPage(e.selected + 1);
  };
  const handleEdit = (index) => {
    setIsEditClicked(true);
    setEditIndex(index);
  };
  const handleOverlay = () => {
    setIsEditClicked(false);
    setIsRemoveClicked(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsEditClicked(false);
      setIsRemoveClicked(false);
    }
  };
  const handleEditForm = (e) => {
    e.preventDefault();
    setEditData({
      admin: adminUserName,
      rfid: e.target[0].value,
      name: e.target[1].value,
      rollnumber: e.target[2].value,
      password: e.target[3].value,
    });
    setIsEditValidated(false);
    setIsEditSubmited(true);
  };
  const handleRemove = (index) => {
    setIsRemoveClicked(true);
    setRemoveFormError({});
    removeFormInputRef.current.value = "";
    setRemoveRfid(pageData[index].rfid);
  };
  const handleRemoveForm = (e) => {
    e.preventDefault();
    setIsRemoveFormValidated(false);
    setRemoveFormData(e.target[0].value);
    setIsRemoveSubmited(true);
  };
  const removeFormValidater = () => {
    const error = {};
    if (!removeFormData) {
      error.adminError = "Admin Password Required";
    }
    setRemoveFormError(error);
    return true;
  };
  const editValidater = () => {
    const error = {};
    if (!editData.rfid) {
      error.rfidError = "RFID required";
    }
    if (!editData.name) {
      error.nameError = "Name required";
    }
    if (!editData.rollnumber) {
      error.rollNumberError = "Roll Number Required";
    }
    if (!editData.password) {
      error.adminError = "Admin Passowrd Required";
    }
    setEditError(error);
    return true;
  };
  let triggerOnce = true;
  useEffect(() => {
    if (triggerOnce) {
      fetchPageData(1, true);
      triggerOnce = false;
    }
  }, []);
  useEffect(() => {
    if (isEditSubmited) {
      setIsEditValidated(editValidater());
      setIsEditSubmited(false);
    }
  }, [isEditSubmited]);
  useEffect(() => {
    if (isEditValidated && Object.keys(editError).length === 0) {
      (async () => {
        console.log(pageData[editIndex]._id);
        try {
          const result = await axios.put(
            `http://localhost:9000/client/update/${pageData[editIndex]._id}`,
            editData
          );
          if (result.data?.status) {
            setIsEditClicked(false);
            fetchPageData(presentPage, false);
          } else {
            setEditError({ adminError: result.data?.message });
          }
        } catch (err) {
          console.log(err.message);
        }
      })();
    }
  }, [isEditValidated]);
  useEffect(() => {
    if (isRemoveSubmited) {
      setIsRemoveFormValidated(removeFormValidater());
      setIsRemoveSubmited(false);
    }
  }, [isRemoveSubmited]);
  useEffect(() => {
    if (isRemoveFormValidated && Object.keys(removeFormError).length === 0) {
      (async () => {
        try {
          const result = await axios.post(
            "http://localhost:9000/client/delete",
            {
              name: adminUserName,
              rfid: removeRfid,
              password: removeFormData,
            }
          );
          if (result.data?.status) {
            setIsRemoveClicked(false);
            fetchPageData(presentPage, true);
          } else {
            setRemoveFormError({ adminError: result.data?.message });
          }
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [isRemoveFormValidated]);
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });
  function UserInfoTable() {
    return (
      <>
        <table>
          <thead>
            <tr>
              <th>SL. NO.</th>
              <th>RFID NO.</th>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Balance Amount</th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody>
              <tr>
                <td>Loading...</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {pageData?.map((user, index) => (
                <tr key={index + 1}>
                  <td>{presentPage * pageSize + (index + 1)}</td>
                  <td>{user?.rfid}</td>
                  <td>{user?.name}</td>
                  <td>{user?.rollnumber}</td>
                  <td>{user?.balance}</td>
                  <td>
                    <button
                      onClick={() => {
                        handleEdit(index);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        handleRemove(index);
                      }}
                      key={editIndex}
                    >
                      Remove
                    </button>
                    <button onClick={handleRechargeHistory}>
                      Recharge History
                    </button>
                    <button>Expense History </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </>
    );
  }
  return (
    <>
      <div className="home-page-container">
        <div
          className={`overlay ${
            isEditClicked || isRemoveClicked ? `open` : ``
          }`}
          onClick={handleOverlay}
        ></div>
        <nav></nav>
        <div className="sub-container">
          <Routes>
            <Route exact path="/" Component={UserInfoTable} />
            <Route path="/rechargeHistory" Component={RechargeHistory} />
          </Routes>
          <ReactPaginate
            previousLabel={"prev"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={Math.round(totalUsers / pageSize)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={handlePageChange}
            containerClassName={"pagination-container"}
          />
        </div>
        <div className="footer-sec">
          <button>Daily History</button>
          <button>Monthly History</button>
          <button>View History</button>
          <button>Add Student</button>
        </div>
        <form
          className={`edit-form ${isEditClicked ? `open` : ``}`}
          onSubmit={handleEditForm}
          key={editIndex}
        >
          <p>{editError.rfidError}</p>
          <input
            type="text"
            defaultValue={pageData[editIndex]?.rfid}
            placeholder="RFID NO.."
          />
          <p>{editError.nameError}</p>
          <input
            type="text"
            defaultValue={pageData[editIndex]?.name}
            placeholder="Student Name.."
          />
          <p>{editError.rollNumberError}</p>
          <input
            type="text"
            defaultValue={pageData[editIndex]?.rollnumber}
            placeholder="Roll Number.."
          />
          <p>{editError.adminError}</p>
          <label>
            <input type="password" placeholder="Admin Password" />
            <button>see</button>
          </label>
          <button type="submit">Save</button>
        </form>
        <form
          className={`remove-form ${isRemoveClicked ? `open` : ``}`}
          onSubmit={handleRemoveForm}
        >
          <label>
            <p>{removeFormError?.adminError}</p>
            <input
              type="password"
              placeholder="Admin Password.."
              ref={removeFormInputRef}
            />
            <button>see</button>
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export default HomePage;
