import Image from "next/image";
import React from "react";
import { BiRightArrowAlt } from "react-icons/bi";
const Features = () => {
  return (
    <section className="body-font border-t border-gray-100 bg-gray-50 bg-gradient-to-tr from-violet-800 to-violet-500 text-white">
      <div className="container px-5 py-24 mx-auto flex flex-wrap">
        {/* <div className="lg:w-1/2 w-full mb-10 lg:mb-0 rounded-lg overflow-hidden">
          
          <Image
            className="object-cover object-center h-full w-full"
            alt="hero"
            src={require("../public/4573.jpg")}
          />
        </div> */}
        {/* <div className="flex flex-col flex-wrap lg:py-6 -mb-10  lg:pl-12 lg:text-left text-center"> */}
          <div className="flex flex-col mb-4 items-start">
            <h2 className="text-4xl title-font font-medium mb-1">
              Features
            </h2>
            <p className="leading-relaxed text-xl">
              Tons of features that will save your time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <div className="flex flex-col flex-wrap md:pr-6 md:text-left text-left">

            <div className="flex flex-col mb-4 items-start ">
              <h2 className=" text-lg title-font font-medium mb-2 flex items-center">
              
                Multiple Virtual Accounts
              </h2>
              <p className="leading-relaxed text-sm ">
                Manage your funds by creating multiple accounts for different
                usage like business, savings, expenditures, etc.
              </p>
            </div>
            <div className="flex flex-col mb-4 items-start ">
              <h2 className=" text-lg title-font font-medium mb-2 flex items-center">
              
                Interest
              </h2>
              <p className="leading-relaxed text-sm ">
                Earn interest on all your funds.
              </p>
            </div>

            <div className="flex flex-col mb-4 items-start ">
              <h2 className=" text-lg title-font font-medium mb-2 flex items-center">
              
                Payment Links
              </h2>
              <p className="leading-relaxed text-sm ">
                Get paid faster with your custom payment links.
              </p>
            </div>

            <div className="flex flex-col mb-4 items-start ">
              <h2 className=" text-lg title-font font-medium mb-2 flex items-center">
              
                Rewards
              </h2>
              <p className="leading-relaxed text-sm ">
                Get rewarded with CNEO (Cryptoneo Tokens) by creating FDs, making
                payments, and receiving payments.
              </p>
            </div>
          </div>
          <div className="flex flex-col flex-wrap md:pr-6 md:text-left text-left">

          <div className="flex flex-col mb-4 items-start ">
            <h2 className=" text-lg title-font font-medium mb-2 flex items-center">
            
              Payments
            </h2>
            <p className="leading-relaxed text-sm ">
              Send and receive cryptos hassle-free
            </p>
          </div>

          <div className="flex flex-col mb-4 items-start ">
            <h2 className=" text-lg title-font font-medium mb-2 flex items-center">
            
              Contacts
            </h2>
            <p className="leading-relaxed text-sm ">
              Add any of your contacts to send them payment directly.
            </p>
          </div>

          <div className="flex flex-col mb-4 items-start ">
            <h2 className=" text-lg title-font font-medium mb-2 flex items-center">
            
              Fixed Deposits
            </h2>
            <p className="leading-relaxed text-sm ">
              Lend your loose cryptos in our FDs to earn more interest in them.
              Create many FDs according to your goal with a flexible locking
              period.
            </p>
          </div>

          <div className="flex flex-col mb-4 items-start ">
            <h2 className=" text-lg title-font font-medium mb-2 flex items-center">
            
              Fixed Loans
            </h2>
            <p className="leading-relaxed text-sm ">
              Get easy loans on your FDs or by depositing collateral.
            </p>
          </div>
          </div>
          </div>
        {/* </div> */}
      </div>
    </section>
  );
};

export default Features;
