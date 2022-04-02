import { Menu } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import MiddleEllipsis from "react-middle-ellipsis";
import { getEllipsisTxt } from "../helpers/formatters";
import { FiCopy } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { useMoralis, useERC20Balances } from "react-moralis";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose, IoCopy } from "react-icons/io5";
import Button from "./UI/Button";
import { FaCopy } from "react-icons/fa";
import ListItem from "./UI/ListItem";
import { cryptos } from "../constants/cryptos";
import { useMoralisWeb3Api } from "react-moralis";

export default function ProfileDropdown({ user, account, logout }) {
  const { Moralis } = useMoralis()
  let [isOpen, setIsOpen] = useState(false);
  const [balances, setBalances] = useState([]);
  const Web3Api = useMoralisWeb3Api();

  useEffect(() => {
  const fetchTokenBalances = async () => {
    const bal = await Web3Api.account.getTokenBalances({
      chain:"0x3"
    });
    const balance = await Web3Api.account.getNativeBalance({
      chain:"0x3"
    });
    setBalances([{
      balance: balance.balance,
      decimals: "18",
      logo: require("../public/cryptos/eth.png"),
      name: "Ethereum",
      symbol: "ETH",
      thumbnail: null,
    }, ...bal])
    console.log("Balances",balance);
  };
  fetchTokenBalances()
},[])
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const copyAddress = (account) => {
    navigator.clipboard.writeText(account);
    console.log("Copy");
    toast.success("Address Copied!", {
      duration: 2000,
      position: "top-center",
    });
  };

  // const { data } = useERC20Balances()

  // console.log("Balance", data);
  return (
    <div className="text-right top-16">
      <div>
        <button
          className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-400 bg-gray-50 border border-gray-100 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 items-center space-x-1"
          onClick={openModal}
        >
          <img
            alt="profile"
            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            className="h-6 mx-auto object-cover rounded-full w-6"
          />

          <p className="mr-5">{getEllipsisTxt(account, 6)}</p>

          <BiChevronDown
            className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
            aria-hidden="true"
          />
        </button>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed bg-gray-900 bg-opacity-20 inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg flex items-center justify-between font-medium leading-6 text-gray-900"
                >
                  <span>Account</span>
                  <button type="button" className="" onClick={closeModal}>
                    <IoClose />
                  </button>
                </Dialog.Title>
                <div className="mt-2">
                  <div className=" h-32 overflow-hidden">
                    <img
                      className="w-full"
                      src="https://images.unsplash.com/photo-1605379399642-870262d3d051?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                      alt=""
                    />
                  </div>
                  <div className="flex justify-center px-5 -mt-12">
                    <img
                      className="h-24 w-24 bg-white p-2 rounded-full   "
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-center px-14 mb-3">
                      <h2 className="text-gray-800 text-3xl font-bold">
                        Himanshu Purohit
                      </h2>
                      <div className="flex space-x-2 justify-center mt-2 items-center">
                        <p className="text-gray-400">
                          {getEllipsisTxt(account, 8)}
                        </p>
                        <IoCopy
                          className="text-gray-400 cursor-pointer"
                          onClick={() => copyAddress(account)}
                        />
                      </div>
                    </div>
                    <div className="max-h-80 no-scrollbar overflow-y-scroll ">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">Wallet Balances</p>
                      </div>
                      {balances.map((balance, index) => (
                        <ListItem
                          image={balance.logo ? balance.logo : require("../public/cryptos/empty-token.webp")}
                          title={balance.name}
                          subTitle={balance.symbol}
                          key={index}
                          className="max-h-16"
                          left={
                            <div className="flex flex-col items-end">
                              <p className=" font-base text-sm">
                                {parseFloat(Moralis?.Units?.FromWei(balance.balance.toString(), balance.decimals)).toFixed(6)} {balance.symbol}
                              </p>
                              
                            </div>
                          }
                        />
                      ))}
                    </div>
                    <Button
                      className="flex bottom-0 py-4 w-full mt-3 justify-center text-center"
                      onClick={logout}
                      primary
                      title="Disconnect Wallet"
                    />
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <Toaster />
    </div>
  );
}
