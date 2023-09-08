import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Css/HomePage.css";
import ReactPaginate from "react-paginate";
function HomePage() {
  const [data, setData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [pageSize] = useState(5);
  const [presentPage, setPresentPage] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const fetchPageData = async (pageNumber) => {
    try {
      if (data.length < pageNumber * pageSize) {
        setIsLoading(true);
        const result = await axios.get(
          `http://localhost:5000/client/getuser?pageNumber=${pageNumber}&pageLimit=${pageSize}`
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
  };
  const handleOverlay = () => {
    setIsEditClicked(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsEditClicked(false);
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });
  useEffect(() => {
    async function initialFetch() {
      try {
        setIsLoading(true);
        const result = await axios.get(
          `http://localhost:5000/client/getuser?pageNumber=${1}&pageLimit=${pageSize}`
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
    initialFetch();
  }, []);
  return (
    <>
      <div className="home-page-container">
        <div
          className={`overlay ${isEditClicked ? `open` : ``}`}
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
                      <button>Remove</button>
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
        <form className="edit-form">
          <input placeholder="RFID NO.." />
          <input placeholder="Student Name.." />
          <input placeholder="Roll Number.." />
        </form>
      </div>
    </>
  );
}

export default HomePage;
