import React from "react";

const TableHead = (props) => {
  return (
    // <div className="block w-full">
    //   <table
    //     className={`items-center bg-transparent w-full border-collapse ${
    //       props.className && props.className
    //     }`}
    //   >
    //     {props.children}
    //   </table>
    // </div>
    <thead>
      <tr className="bg-gray-100">
        {props.tableHeadings.map((heading, index) => (
          <th
            className="px-3 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            key={index}
          >
            {heading}
          </th>
        ))}
        {/* <th className="px-3 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Visitors
                      </th>
                      <th className="px-3 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Unique users
                      </th>
                      <th className="px-3 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Bounce rate
                      </th> */}
      </tr>
    </thead>
  );
};

export default TableHead;
