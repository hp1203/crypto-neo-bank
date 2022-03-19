import React from "react";

const TableFooter = (props) => {
  return (
    <div className={`flex text-sm w-full justify-center items-center font-semibold text-gray-600 py-4 space-x-2 ${props.className && props.className}`}>
{props.children}</div>

  );
};

export default TableFooter;
