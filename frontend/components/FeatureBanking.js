import Image from "next/image";
import React from "react";

const FeatureBanking = () => {
  return (
    <section className="text-gray-600 body-font bg-gray-50">
  <div className="container px-5 py-24 mx-auto">
    <div className="flex flex-col text-center w-full mb-20">
      <h2 className="text-xs text-violet-500 tracking-widest font-medium title-font mb-1">Grow your Cryptos</h2>
      <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">Discover Defi like never before</h1>
    </div>
    <div className="flex flex-wrap -m-4">
      <div className="p-4 md:w-1/3">
        <div className="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-violet-500 text-white flex-shrink-0">
              <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h2 className="text-gray-900 text-lg title-font font-medium">Manage Funds</h2>
          </div>
          <div className="flex-grow">
            <p className="leading-relaxed text-base">Manage your crypto funds by creating multiple accounts like business, personal, investment, etc.</p>
            {/* <a className="mt-3 text-violet-500 inline-flex items-center">Learn More
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </a> */}
          </div>
        </div>
      </div>
      <div className="p-4 md:w-1/3">
        <div className="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-violet-500 text-white flex-shrink-0">
              <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h2 className="text-gray-900 text-lg title-font font-medium">Get rewards for Saving</h2>
          </div>
          <div className="flex-grow">
            <p className="leading-relaxed text-base">You earn rewards for saving, imagine! It’s about time, right? We’re here to help you build good habits and believe that those who save money deserve rewards.</p>
            {/* <a className="mt-3 text-violet-500 inline-flex items-center">Learn More
              <svg fill="none" stroke="currentColor" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </a> */}
          </div>
        </div>
      </div>
      <div className="p-4 md:w-1/3">
        <div className="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-violet-500 text-white flex-shrink-0">
              <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                <circle cx="6" cy="6" r="3"></circle>
                <circle cx="6" cy="18" r="3"></circle>
                <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
              </svg>
            </div>
            <h2 className="text-gray-900 text-lg title-font font-medium">Simple Investments and Loans</h2>
          </div>
          <div className="flex-grow">
            <p className="leading-relaxed text-base">Invest in our crypto FDs and RDs. Take instant loan against them.</p>
            {/* <a className="mt-3 text-violet-500 inline-flex items-center">Learn More
              <svg fill="none" stroke="currentColor" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </a> */}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  );
};

export default FeatureBanking;
