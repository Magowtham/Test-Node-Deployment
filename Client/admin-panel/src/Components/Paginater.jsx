import React from "react";
import ReactPaginate from "react-paginate";
import "../Css/Paginater.css";
function Paginater({ totalElements, pageSize, handlePageChange }) {
  return (
    <>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={20}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        onPageChange={handlePageChange}
        containerClassName={"pagination-container"}
        activeClassName="page-active"
        pageClassName="page-btn"
        pageLinkClassName="page-btn-link"
        previousClassName="page-next-btn"
        nextClassName="page-prev-btn"
        previousLinkClassName="page-next-btn-link"
        nextLinkClassName="page-next-btn-link"
      />
    </>
  );
}

export default Paginater;
