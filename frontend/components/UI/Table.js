import React from "react";

const Table = (props) => {
  return (
    <div className="block w-full">
      <table
        className={`items-center bg-transparent w-full border-collapse ${
          props.className && props.className
        }`}
      >
        {props.children}
      </table>
    </div>
  );
};

export default Table;
