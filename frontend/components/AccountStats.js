import React from "react";
import { FaArrowRight } from "react-icons/fa";
import Button from "./UI/Button";
import Card from "./UI/Card";

export const AccountStats = (props) => {
  return (
    <Card {...props}>
      <div className="w-full flex flex-col justify-between top-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs font-base tracking-widest text-gray-500">
            Name
          </p>
          <p className="text-xs font-base tracking-widest text-gray-500">
            Available Funds
          </p>
        </div>
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col space-y-2">
            <p className="font-medium text-2xl">Business</p>
            <div className="flex items-center space-x-2">
              <p className="text-xs items-center font-base tracking-widest text-gray-500">
                AC: 34234234234 
              </p>
              <FaArrowRight className="text-xs items-center font-base tracking-widest text-violet-500"/>
            </div>
          </div>
          <p className="font-semibold text-3xl tracking-widest">
            <span className="text-gray-500 font-extralight">$</span>345,890
          </p>
        </div>
        <div className="flex space-x-2 items-center">
          <Button title="Transfer Now" primary/>
          <Button title="Deposit"/>
          <Button title="Withdraw"/>
        </div>
      </div>
    </Card>
  );
};
