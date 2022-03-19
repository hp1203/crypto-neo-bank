import React from "react";

const TableRow = (props) => {
  return (
    <tr className={`border-b border-gray-50 ${props.className && props.className}`}>
      {props.children}
    </tr>
  );
};

export default TableRow;
