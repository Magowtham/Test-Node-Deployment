import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Paginater from "./Paginater";
import "../Css/UserInfoTable.css";
import PageLoader from "./PageLoader";

function UserInfoTable({
  adminUserName,
  isSearchLoading,
  searchData,
  searchRefresh,
  initialRefresh,
  inputClear,
  isOverlay,
  setIsOverlay,
  reductionStatus,
}) {
  const navigate = useNavigate();
  const [abortControllers, setAbortControllers] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [pageData, setPageData] = useState([]);
  const [pageSize] = useState(9);
  const [presentPage, setPresentPage] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [isRemoveClicked, setIsRemoveClicked] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRfid, setEditRfid] = useState("");
  const [editRollNumber, setEditRollNumber] = useState("");
  const [editIndex, setEditIndex] = useState(null);
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
  const [removeFormData, setRemoveFormData] = useState("");
  const [isRemoveSubmited, setIsRemoveSubmited] = useState(false);
  const [isRemoveFormValidated, setIsRemoveFormValidated] = useState(false);
  const [removeFormError, setRemoveFormError] = useState({});
  const [removeRfid, setRemoveRfid] = useState("");
  const [vissibility, setVissibility] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const editFormRef = useRef(null);
  const removeFormRef = useRef(null);
  const removeFormInputRef = useRef(null);
  const editPasswordRef = useRef(null);
  const fetchPageData = async (pageNumber, totalCount) => {
    try {
      setIsTableLoading(true);
      console.log(abortControllers);
      abortControllers.forEach((controller) => {
        controller.abort();
      });
      const abortController = new AbortController();
      setAbortControllers(() => [...abortControllers, abortController]);
      const result = await fetch(
        `${process.env.REACT_APP_API_URL}/getuser?pageNumber=${pageNumber}&pageLimit=${pageSize}`,
        {
          signal: abortController.signal,
        }
      );
      const data = await result.json();
      if (totalCount) {
        setTotalUsers(data?.totalUsers);
      }
      setPageData(data?.users);
      abortController.abort();
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsTableLoading(false);
    }
  };
  const handleRechargeHistory = (rfid) => {
    navigate("/rechargeHistory", {
      state: { rfid, auth: true, reductionStatus },
    });
  };
  const handleExpenseHistory = (rfid) => {
    navigate("/expenseHistory", { state: { rfid, auth: true } });
  };
  const handleTablePageChange = (e) => {
    fetchPageData(e.selected, false);
    setPresentPage(e.selected);
    inputClear(true);
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
  const handleEditForm = (e, keyEvent) => {
    if (!keyEvent) {
      e.preventDefault();
    }
    setIsEditValidated(false);
    if (!keyEvent) {
      setEditData({
        admin: adminUserName,
        rfid: e.target[0].value,
        name: e.target[1].value,
        rollnumber: e.target[2].value,
        password: e.target[3].value,
      });
    } else {
      setEditData({
        admin: adminUserName,
        rfid: editFormRef.current[0].value,
        name: editFormRef.current[1].value,
        rollnumber: editFormRef.current[2].value,
        password: editFormRef.current[3].value,
      });
    }
    setIsEditSubmited(true);
  };

  const handleEdit = (index) => {
    inputClear(true);
    setIsEditClicked(true);
    setEditIndex(index);
    setEditError({});
    setEditName(pageData[index]?.name);
    setEditRfid(pageData[index]?.rfid);
    setEditRollNumber(pageData[index]?.rollnumber);
    editPasswordRef.current.value = "";
    setIsOverlay(true);
    setVissibility(false);
  };
  const handleEditInput = (e) => {
    const { name, value } = e.target;
    if (name === "rfid") {
      setEditRfid(value);
    }
    if (name === "name") {
      setEditName(value);
    }
    if (name === "rollnumber") {
      setEditRollNumber(value);
    }
  };
  const removeFormValidater = () => {
    const error = {};
    if (!removeFormData) {
      error.adminError = "Admin Password Required";
    }
    setRemoveFormError(error);
    return true;
  };
  const handleRemoveForm = (e, keyEvent) => {
    if (!keyEvent) {
      e.preventDefault();
    }
    setIsRemoveFormValidated(false);
    if (!keyEvent) {
      setRemoveFormData(e.target[0].value);
    } else {
      setRemoveFormData(removeFormRef.current[0].value);
    }
    setIsRemoveSubmited(true);
  };
  const handleRemove = (index) => {
    inputClear(true);
    setIsRemoveClicked(true);
    setRemoveFormError({});
    removeFormInputRef.current.value = "";
    setRemoveRfid(pageData[index].rfid);
    setIsOverlay(true);
    setVissibility(false);
  };
  const handlePasswordVisibility = (elementRef) => {
    setVissibility(!vissibility);
    elementRef.current.type = vissibility ? `password` : `text`;
  };
  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      if (isEditClicked) handleEditForm(editFormRef.current, true);
      if (isRemoveClicked) handleRemoveForm(removeFormRef.current, true);
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleEnterKey);
    return () => window.removeEventListener("keydown", handleEnterKey);
  });
  useEffect(() => {
    if (isEditValidated && Object.keys(editError).length === 0) {
      (async () => {
        try {
          setFormLoading(true);
          const result = await fetch(
            `http://localhost:9000/client/update/${pageData[editIndex]._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(editData),
            }
          );
          const data = await result.json();
          if (data?.status) {
            setIsEditClicked(false);
            fetchPageData(presentPage, false);
            setIsOverlay(false);
          } else {
            setEditError({ serverMessage: data?.message });
          }
        } catch (err) {
          console.log(err.message);
        } finally {
          setFormLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditValidated]);
  useEffect(() => {
    if (isRemoveFormValidated && Object.keys(removeFormError).length === 0) {
      (async () => {
        try {
          setFormLoading(true);

          const result = await fetch("http://localhost:9000/client/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: adminUserName,
              rfid: removeRfid,
              password: removeFormData,
            }),
          });
          const data = await result.json();
          if (data?.status) {
            setIsRemoveClicked(false);
            fetchPageData(presentPage, true);
            setIsOverlay(false);
          } else {
            setRemoveFormError({ serverMessage: data?.message });
          }
        } catch (error) {
          console.log(error.message);
        } finally {
          setFormLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRemoveFormValidated]);
  useEffect(() => {
    if (!isOverlay) {
      setIsEditClicked(false);
      setIsRemoveClicked(false);
    }
  }, [isOverlay]);
  useEffect(() => {
    if (isEditSubmited) {
      setIsEditValidated(editValidater());
      setIsEditSubmited(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditSubmited]);
  useEffect(() => {
    if (isRemoveSubmited) {
      setIsRemoveFormValidated(removeFormValidater());
      setIsRemoveSubmited(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRemoveSubmited]);

  useEffect(() => {
    if (searchData.length !== 0) {
      setPageData(searchData);
    }
  }, [searchData]);

  useEffect(() => {
    setAbortControllers([]);
    console.log(abortControllers);
    if (searchRefresh && !initialRefresh) {
      fetchPageData(presentPage, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchRefresh]);

  let triggerOnce = true;
  useEffect(() => {
    if (triggerOnce) {
      fetchPageData(0, true);
      triggerOnce = false;
    }
  }, []);

  return (
    <>
      <div className="sub-table-sec">
        <table>
          <thead>
            <tr>
              <th>SL. NO.</th>
              <th>RFID NO.</th>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th className={`${reductionStatus ? `hide` : ``}`}>
                Balance Amount
              </th>
              <th>Manage</th>
              <th>{reductionStatus ? `Recharge` : `View`} Details</th>
            </tr>
          </thead>
          <tbody
            className={`${isTableLoading || isSearchLoading ? `hide` : ``}`}
          >
            {pageData?.map((user, index) => (
              <tr key={index + 1}>
                <td className="slno">{presentPage * pageSize + (index + 1)}</td>
                <td>{user?.rfid}</td>
                <td style={{ textTransform: "capitalize" }}>{user?.name}</td>
                <td>{user?.rollnumber}</td>
                <td className={`${reductionStatus ? `hide` : ``}`}>
                  {user?.balance}
                </td>
                <td className="manage-sec">
                  <button
                    onClick={() => {
                      handleEdit(index);
                    }}
                    className="edit-btn"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    onClick={() => {
                      handleRemove(index);
                    }}
                    className="delete-btn"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </td>
                <td className="view-details-sec">
                  <button
                    onClick={() => {
                      handleRechargeHistory(user?.rfid);
                    }}
                    className="recharge-history-btn"
                  >
                    Recharge
                  </button>
                  <button
                    onClick={() => {
                      handleExpenseHistory(user?.rfid);
                    }}
                    className={`expense-history-btn ${
                      reductionStatus ? `hide` : ``
                    }`}
                  >
                    Expense
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          className={`table-loader-container ${
            isTableLoading || isSearchLoading ? `` : `hide`
          }`}
        >
          <PageLoader />
        </div>
      </div>
      <div className="paginater-sec">
        <Paginater
          totalElements={totalUsers}
          pageSize={pageSize}
          handlePageChange={handleTablePageChange}
          isVisible={searchRefresh}
        />
      </div>
      <form
        className={`edit-form ${isEditClicked ? `open` : ``}`}
        onSubmit={handleEditForm}
        ref={editFormRef}
      >
        <div className={`form-overlay ${formLoading ? `open` : ``}`}></div>
        <div className={`progress-bar ${formLoading ? `open` : ``}`}>
          <div className="progress-bar-value"></div>
        </div>
        <div className="heading-sec">
          <h1>Edit User </h1>
        </div>
        <p>{editError.rfidError}</p>
        <input
          type="text"
          name="rfid"
          value={editRfid}
          onChange={handleEditInput}
          placeholder="RFID Number"
        />
        <p>{editError.nameError}</p>
        <input
          type="text"
          name="name"
          value={editName}
          onChange={handleEditInput}
          placeholder="Student Name"
          style={{ textTransform: "capitalize" }}
        />
        <p>{editError.rollNumberError}</p>
        <input
          type="text"
          name="rollnumber"
          value={editRollNumber}
          onChange={handleEditInput}
          placeholder="Roll Number"
          style={{ textTransform: "uppercase" }}
        />
        <p>{editError.adminError}</p>
        <label>
          <input
            ref={editPasswordRef}
            type="password"
            placeholder="Admin Password"
          />
          <button
            className="material-symbols-outlined"
            onClick={(e) => {
              e.preventDefault();
              handlePasswordVisibility(editPasswordRef);
            }}
          >
            {vissibility ? `visibility` : `visibility_off`}
          </button>
        </label>
        <div className="form-footer-sec">
          <p>{editError?.serverMessage}</p>
          <button type="submit" className="save-btn">
            Save
          </button>
        </div>
      </form>
      <form
        className={`remove-form ${isRemoveClicked ? `open` : ``}`}
        onSubmit={handleRemoveForm}
        ref={removeFormRef}
      >
        <div className={`form-overlay ${formLoading ? `open` : ``}`}></div>
        <div className={`progress-bar ${formLoading ? `open` : ``}`}>
          <div className="progress-bar-value"></div>
        </div>
        <div className="heading-sec">
          <h1>Remove User</h1>
        </div>
        <p>{removeFormError?.adminError}</p>
        <label>
          <input
            type="password"
            placeholder="Admin Password.."
            ref={removeFormInputRef}
          />
          <button
            className="material-symbols-outlined"
            onClick={(e) => {
              e.preventDefault();
              handlePasswordVisibility(removeFormInputRef);
            }}
          >
            {vissibility ? `visibility` : `visibility_off`}
          </button>
        </label>
        <div className="form-footer-sec">
          <p>{removeFormError?.serverMessage}</p>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}

export default UserInfoTable;
