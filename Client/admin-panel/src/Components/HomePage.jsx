import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../Css/HomePage.css";
import ReactPaginate from "react-paginate";
function HomePage() {
  const [adminUserName, setAdminUserName] = useState("gowtham");
  const [data, setData] = useState([]);
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
  const removeFormInputRef = useRef(null);
  async function initialFetch() {
    try {
      setIsLoading(true);
      const result = await axios.get(
        `http://localhost:9000/client/getuser?pageNumber=${1}&pageLimit=${pageSize}`
      );
      setTotalUsers(result.data?.totalUsers);
      setData(result.data?.users);
      setPageData(result.data?.users);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }
  const fetchPageData = async (pageNumber) => {
    try {
      if (data.length < pageNumber * pageSize) {
        setIsLoading(true);
        const result = await axios.get(
          `http://localhost:9000/client/getuser?pageNumber=${pageNumber}&pageLimit=${pageSize}`
        );
        setPageData(result.data?.users);
        setData((data) => [...data, ...result.data?.users]);
      } else {
        const end = pageNumber * pageSize;
        const start = end - pageSize;
        setPageData(data.slice(start, end));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (e) => {
    fetchPageData(e.selected + 1);
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
            initialFetch();
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
  useEffect(() => {
    initialFetch();
  }, []);
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
                {pageData.map((user, index) => (
                  <tr key={index + 1}>
                    <td>{presentPage * pageSize + (index + 1)}</td>
                    <td>{user.rfid}</td>
                    <td>{user.name}</td>
                    <td>{user.rollnumber}</td>
                    <td>{user.balance}</td>
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
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
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
        >
          <input
            type="text"
            defaultValue={pageData[editIndex]?.rfid}
            placeholder="RFID NO.."
          />
          <input
            type="text"
            defaultValue={pageData[editIndex]?.name}
            placeholder="Student Name.."
          />
          <input
            type="text"
            defaultValue={pageData[editIndex]?.rollnumber}
            placeholder="Roll Number.."
          />
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
