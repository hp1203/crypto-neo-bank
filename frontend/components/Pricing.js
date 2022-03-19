import React from "react";
import { HiArrowSmRight } from "react-icons/hi";
const Pricing = () => {
  return (
    <section className="text-gray-600 body-font overflow-hidden border-b border-gray-50 bg-gray-50">
      <div className="container px-5 pt-24 pb-8 mx-auto">
        <div className="flex flex-col text-center w-full mb-8">
          <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
            Pricing
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-500">
            No BS Pricing. Pay as you go.
          </p>
        </div>
        <div className="flex justify-center items-center">
          <div className="h-full max-w-md w-1/2 bg-white p-6 rounded-lg border-2 border-violet-500 flex flex-col relative overflow-hidden">
            <h2 className="text-sm tracking-widest title-font mb-1 font-medium">
              ONLY
            </h2>
            <h1 className="text-5xl text-gray-900 leading-none flex items-center pb-2 border-gray-200">
              <span>0.5</span>
              <span className="text-lg ml-1 font-normal text-gray-500">%</span>
            </h1>
            <h2 className="text-sm border-b  tracking-widest title-font mb-4 pb-2 font-medium">
              ON PAYMENTS
            </h2>
            <p className="flex items-center text-gray-600 mb-2">
              <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
                <HiArrowSmRight className="w-3 h-3" />
              </span>
              Free Banking
            </p>
            <p className="flex items-center text-gray-600 mb-2">
              <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
                <HiArrowSmRight className="w-3 h-3" />
              </span>
              Earn good interest on your funds
            </p>
            <p className="flex items-center text-gray-600 mb-2">
              <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
                <HiArrowSmRight className="w-3 h-3" />
              </span>
              Detailed Analytics
            </p>
            <p className="flex items-center text-gray-600 mb-6">
              <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
                <HiArrowSmRight className="w-3 h-3" />
              </span>
              Manage your funds with multiple virtual accounts
            </p>

            <p className="text-xs text-gray-500 mt-3 text-center">
              **Gas fee is not included.**
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
