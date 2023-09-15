import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Paginater from "./Paginater";

function RechargeHistory() {
  const { state } = useLocation();
  const [pageData, setPageData] = useState([]);
  const [totalHistoryCount, setTotalHistoryCount] = useState(0);
  const [pageSize] = useState(15);
  const [presentPage, setPresentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const fetchPageData = async (pageNumber, totalCount) => {
    console.log(pageNumber);
    try {
      const result = await axios.get(
        `http://localhost:9000/client/recharge_history?rfid=${state.rfid}&pageStart=${pageNumber}&pageSize=${pageSize}`
      );
      if (totalCount) {
        setTotalHistoryCount(result.data?.historyLength);
      }
      console.log(result.data);
      setPageData(result.data?.history);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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
      <table>
        <thead>
          <tr>
            <th>SL. NO.</th>
            <th>Date</th>
            <th>Time</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
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
      <Paginater
        totalElements={totalHistoryCount}
        pageSize={pageSize}
        handlePageChange={handleHistoryPage}
      />
    </>
  );
}

export default RechargeHistory;
