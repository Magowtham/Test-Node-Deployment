import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Css/HomePage.css";
import Test from "./Test";
import ReactPaginate from "react-paginate";
function HomePage() {
  const [data, setData] = useState([]);
  const handlePageChange = (e) => {
    console.log(e);
  };
  useEffect(() => {
    async function initialFetch() {
      try {
        setData(data);
      } catch (err) {
        console.log(err);
      } finally {
        console.log("successfull");
      }
    }
    initialFetch();
  }, []);
  return (
    <>
      <div className="home-page-container">
        <nav></nav>
        <Test data={data} />
        <ReactPaginate
          previousLabel={"prev"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={30}
          marginPagesDisplayed={2}
          pageRangeDisplayed={8}
          onPageChange={handlePageChange}
          containerClassName={"pagination-container"}
        />
      </div>
    </>
  );
}

export default HomePage;
