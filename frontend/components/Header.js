import Image from "next/image";
import React from "react";
import { IoWallet } from "react-icons/io5";
import { FaEthereum } from "react-icons/fa";
const Header = () => {
  return (
    <header className="text-gray-600 body-font border-b border-gray-100">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          {/* <Image src={require("../public/logo.jpg")} alt="Cryptoneo"/> */}
          <FaEthereum className="bg-violet-500 text-3xl w-10 h-10 p-2 text-white rounded-full" />
          <i className="border-r border-gray-300 h-10 ml-3"></i>
          <span className="ml-3 text-2xl font-mono font-bold">Cryptoneo</span>
        </a>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <a className="nav-link">First Link</a>
          <a className="nav-link">Second Link</a>
          <a className="nav-link">Third Link</a>
          <a className="nav-link">Fourth Link</a>
        </nav>
        <button className="btn-primary text-base">
          <IoWallet className="mr-2" />
          <span>Connect Wallet</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
