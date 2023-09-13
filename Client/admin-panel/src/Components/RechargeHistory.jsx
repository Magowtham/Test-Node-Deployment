import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Paginater from "./Paginater";

function RechargeHistory() {
  const { state } = useLocation();
  const [pageData, setPageData] = useState([]);
  const [pageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const fetchPageData = async (pageNumber, totalCount) => {
    try {
      setIsLoading(true);
      const result = await axios.get(
        `http://localhost:9000/client/recharge_history?rfid=${state.rfid}&pageStart=${pageNumber}&pageSize=${pageSize}`
      );
      setPageData(result.data?.history);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  let triggerOnce = false;
  useEffect(() => {
    if (!triggerOnce) {
      fetchPageData(1, true);
      triggerOnce = true;
    }
  }, []);
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {pageData?.map((element, index) => (
            <tr key={index}>
              <td>{element?.date}</td>
              <td>{element?.time}</td>
              <td>{element?.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paginater />
    </>
  );
}

export default RechargeHistory;
