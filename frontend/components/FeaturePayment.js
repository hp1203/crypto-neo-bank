import Image from "next/image";
import React from "react";
import { cryptos } from "../constants/cryptos";

const FeaturePayment = () => {
  return (
    <section className="text-gray-600 body-font">
  <div className="container px-5 py-24 mx-auto">
    <div className="flex flex-col text-center w-full mb-20">
      <h2 className="text-xs text-violet-500 tracking-widest font-medium title-font mb-1">Multiple Currencies</h2>
      <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">We Support Multiple Currency</h1>
    </div>
    <div className="flex flex-wrap -m-4 items-center justify-center">
    {
      cryptos["0x13881"].map((crypto, index) => (
      <div className="flex w-64 flex-col mb-8" key={index}>
        <Image src={crypto.icon} objectFit="contain" width={'60px'} height={'60px'}/>
        <p className="text-center mt-2 font-semibold">{crypto.name}</p>
      </div>
      ))
    }
    </div>
  </div>
</section>
  );
};

export default FeaturePayment;
