import React from "react";

const ScanAndPay = () => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-5 mx-auto flex flex-col">
        <div className="lg:w-4/6 mx-auto">
          <div className="flex flex-col items-center justify-center sm:flex-row mt-10">
            <div className="sm:w-1/2 text-center sm:pr-8 sm:py-8">
              <img
                src="https://i.pinimg.com/736x/02/34/ed/0234ed633925acc35f08299b4d65fd0d.jpg"
                alt="scan and pay"
              />
            </div>
            <div className="sm:w-1/2 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 sm:text-left">
              <div className="flex flex-col w-full mb-20">
                <h2 className="text-xs text-violet-500 tracking-widest font-medium title-font mb-1">
                  COMING SOON
                </h2>
                <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
                Scan & Pay
                </h1>
                <p className="leading-relaxed text-lg mb-4">Use your phone to easily scan and pay at your favorite stores or to your favorite person.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScanAndPay;
