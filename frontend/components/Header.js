import Image from "next/image";
import React, {useContext} from "react";
import { IoWallet } from "react-icons/io5";
import { FaEthereum } from "react-icons/fa";
import { WalletContext } from "../context/WalletContext";
import ProfileDropdown from "./ProfileDropdown";
import { AuthContext } from "../context/AuthContext";
import Account from "./Account";

const Header = () => {
  // const { connectWallet, walletConnected } = useContext(WalletContext);
  const { login, user, account, logOut } = useContext(AuthContext)
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
          <a className="nav-link">Who we are</a>
          <a className="nav-link">Payments</a>
          <a className="nav-link" href="deposit">Deposit</a>
        </nav>
        <Account/>
        {/* {
          user ? (
            <ProfileDropdown user={user} account={account} logout={logOut}/>
          ) : (
          <button className="btn-primary text-base" onClick={login}>
            <IoWallet className="mr-2" />
            <span>Connect Wallet</span>
          </button>
          )
        } */}
      </div>
    </header>
  );
};

export default Header;
