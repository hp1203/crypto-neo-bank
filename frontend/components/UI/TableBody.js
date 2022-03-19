import React from "react";

const TableBody = (props) => {
  return (
    <tbody className={`${props.className && props.className}`}>
      {props.children}
    </tbody>
  );
};

export default TableBody;
