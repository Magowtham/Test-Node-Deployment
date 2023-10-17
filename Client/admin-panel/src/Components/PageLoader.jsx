import React from "react";
import "../Css/PageLoader.css";

function PageLoader() {
  return (
    <>
      <div className="loader-container">
        <div className="loader--ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
}

export default PageLoader;
