import React from "react";

const TableCol = (props) => {
  return (
    <td {...props} className={`border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ${props.className && props.className}`}>
      {props.children}
    </td>
  );
};

export default TableCol;
