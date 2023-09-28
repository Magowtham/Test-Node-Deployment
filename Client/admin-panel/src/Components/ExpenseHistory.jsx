import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Paginater from "./Paginater";
import TableLoader from "./TableLoader";
import "../Css/ExpenseHistory.css";

function ExpenseHistory() {
  const { state } = useLocation();
  const [pageData, setPageData] = useState([]);
  const [totalHistoryCount, setTotalHistoryCount] = useState(null);
  const [pageSize] = useState(15);
  const [presentPage, setPresentPage] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const fetchPageData = async (pageNumber, totalCount) => {
    try {
      setIsTableLoading(true);
      const result = await axios.get(
        `http://localhost:9000/client/expense_history?rfid=${state.rfid}&pageStart=${pageNumber}&pageSize=${pageSize}`
      );
      if (totalCount) {
        setTotalHistoryCount(result.data?.historyLength);
      }
      console.log(result.data);
      setPageData(result.data?.history);
    } catch (error) {
      console.log(error);
    } finally {
      setIsTableLoading(false);
    }
  };
  const handleHistoryPage = (e) => {
    fetchPageData(e.selected, false);
    setPresentPage(e.selected + 1);
  };
  let triggerOnce = false;
  useEffect(() => {
    if (!triggerOnce) {
      fetchPageData(0, true);
      triggerOnce = true;
    }
  }, []);
  return (
    <>
      <div
        className={`empty-animation-container ${
          totalHistoryCount === 0 ? `` : `hide`
        }`}
      >
        <h1>Empty Table</h1>
      </div>
      <div className="expense-table-container">
        <table
          className={`${
            totalHistoryCount === null || totalHistoryCount === 0 ? `hide` : ``
          }`}
        >
          <thead>
            <tr>
              <th>SL. NO.</th>
              <th>Date</th>
              <th>Call Start Time</th>
              <th>Call End Time</th>
              <th>Reducted Amount</th>
            </tr>
          </thead>
          <tbody className={`${isTableLoading ? `hide` : ``}`}>
            {pageData?.map((element, index) => (
              <tr key={index}>
                <td>{(presentPage - 1) * pageSize + (index + 1)}</td>
                <td>{element?.date}</td>
                <td>{element?.callStartTime}</td>
                <td>{element?.callEndTime}</td>
                <td>{element?.reductedAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          className={`table-loader-container ${isTableLoading ? `` : `hide`}`}
        >
          <TableLoader />
        </div>
      </div>
      <div
        className={`paginater-sec ${
          totalHistoryCount === 0 || totalHistoryCount === null ? `hide` : ``
        }`}
      >
        <Paginater
          totalElements={totalHistoryCount}
          pageSize={pageSize}
          handlePageChange={handleHistoryPage}
          isVisible={true}
        />
      </div>
    </>
  );
}

export default ExpenseHistory;
