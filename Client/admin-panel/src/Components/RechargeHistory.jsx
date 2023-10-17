import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLoader from "./PageLoader";
import Paginater from "./Paginater";

import "../Css/RechargeHistory.css";

function RechargeHistory() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState([]);
  const [totalHistoryCount, setTotalHistoryCount] = useState(null);
  const [pageSize] = useState(14);
  const [presentPage, setPresentPage] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const fetchPageData = async (pageNumber, totalCount) => {
    try {
      setIsTableLoading(true);
      const result = await axios.get(
        `${process.env.REACT_APP_API_URL}/recharge_history?rfid=${
          state.rfid
        }&pageStart=${pageNumber}&pageSize=${pageSize}&reductionStatus=${
          state?.reductionStatus ? 1 : 0
        }`
      );
      if (totalCount) {
        setTotalHistoryCount(result.data?.historyLength);
      }
      setPageData(result.data?.history);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsTableLoading(false);
    }
  };
  const handleHistoryPage = (e) => {
    fetchPageData(e.selected, false);
    setPresentPage(e.selected + 1);
  };

  useEffect(() => {
    if (!state?.auth) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
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
      <div className="recharge-table-container">
        <table
          className={`${
            totalHistoryCount === null || totalHistoryCount === 0 ? `hide` : ``
          }`}
        >
          <thead>
            <tr>
              <th>SL. NO.</th>
              <th>Date</th>
              <th>Time</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody className={`${isTableLoading ? `hide` : ``}`}>
            {pageData?.map((element, index) => (
              <tr key={index}>
                <td>{(presentPage - 1) * pageSize + (index + 1)}</td>
                <td>{element?.date}</td>
                <td>{element?.time}</td>
                <td>{element?.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          className={`table-loader-container ${isTableLoading ? `` : `hide`}`}
        >
          <PageLoader />
        </div>
      </div>
      <div
        className={`paginater-sec ${
          totalHistoryCount === null || totalHistoryCount === 0 ? `hide` : ``
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

export default RechargeHistory;
