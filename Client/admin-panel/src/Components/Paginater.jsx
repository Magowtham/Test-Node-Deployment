import React from "react";
import ReactPaginate from "react-paginate";
import "../Css/Paginater.css";
function Paginater({ totalElements, pageSize, handlePageChange }) {
  return (
    <>
      <ReactPaginate
        previousLabel={"prev"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={Math.round(totalElements / pageSize)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        onPageChange={handlePageChange}
        containerClassName={"pagination-container"}
      />
    </>
  );
}

export default Paginater;
