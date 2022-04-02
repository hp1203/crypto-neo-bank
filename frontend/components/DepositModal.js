import React, { useState, useEffect, Fragment, useContext } from "react";
import { useMoralis } from "react-moralis";
import { BsStoplights } from "react-icons/bs";
import Image from "next/image";
import { IoClose, IoWallet } from "react-icons/io5";
import { Dialog, Transition } from "@headlessui/react";
import Button from "./UI/Button";
import { FaPlusCircle } from "react-icons/fa";
import { connectors } from "../constants/walletConfigs";
import Input from "./UI/Input";
import Textarea from "./UI/Textarea";
import ImageInput from "./UI/ImageInput";
import { AccountContext } from "../context/AccountContext";
import { cryptos } from "../constants/cryptos";
import CryptoDropdown from "./CryptoDropdown";
import { getUsdPrice } from "../hooks/useChainlink";

const DepositModal = ({ address, accountNumber }) => {
  const { isAuthenticated, Moralis, chainId } = useMoralis();
  const { createAccount, isLoading, depositEthToAccount, depositERC20ToAccount } = useContext(AccountContext);
  
  // let cryptos["0x13881"] = [];
  // if(chainId == 0x13881){
  //   cryptos["0x13881"] = cryptos;
  // }else if(chainId == 0x3){
  //   cryptos["0x13881"] = cryptos_polygon;
  // }else {
  //   cryptos["0x13881"] = cryptos;
  // }

  const [selected, setSelected] = useState(cryptos["0x13881"][0]);
  const [usdPrice, setUsdPrice] = useState(0.0);
  const [unitPrice, setUnitPrice] = useState(0.0);
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(()=>{
    console.log("crypto",cryptos["0x13881"][0])
    getUsdPrice(cryptos["0x13881"][0].priceAddress).then((price)=>{
      setUnitPrice(price)
      console.log("Price", price)
    })
  },[cryptos["0x13881"][0].priceAddress])

  const [form, setForm] = useState({
    address: address,
    accountNumber: accountNumber,
    amount: "",
  });
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value.replace(/[^.\d]/g, ""),
    });
    setUsdPrice(parseFloat(e.target.value.replace(/[^.\d]/g, "")) * unitPrice)
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form:", form);
    console.log("Selected:", selected);
    if(selected.symbol == "MATIC"){
      depositEthToAccount(form.address, form.accountNumber, form.amount);
    } else {
      depositERC20ToAccount(form.address, form.accountNumber, form.amount, selected)
    }
  };

  if (isAuthenticated) {
    return (
      <>
        {/* <button className="btn-primary text-base" onClick={openModal}>
          <IoWallet className="mr-2" />
          <span>Add New</span>
        </button> */}
        <Button
          title="Deposit Now"
          primary
          onClick={openModal}
          //   leftIcon={<FaPlusCircle className="mr-1" />}
        />
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
                    className="text-lg flex items-center justify-between font-medium leading-6 text-gray-900 border-b border-gray-50 pb-3"
                  >
                    <CryptoDropdown
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <button type="button" className="" onClick={closeModal}>
                      <IoClose />
                    </button>
                  </Dialog.Title>
                  <div className={`mt-2 ${ 
                    selected.symbol !== 'MATIC' ? '' : ''
                  }`}>
                  {/* {
                    selected.symbol !== 'MATIC' && 
                    <div className="bg-gray-500 bg-opacity-80 rounded-lg absolute flex flex-col w-full h-full justify-center items-center text-white">
                    <Image
                            alt={selected.name}
                          src={selected.icon}
                          width="60px"
                          height="60px"
                          objectFit='cover'
                          className="rounded-full ml-3 w-6 h-6 bg-white"
                        />
                        <p className="text-lg text-center mx-2">We're currently not supporting {selected.name} deposits</p>
                    </div>
                  } */}
                    <form onSubmit={handleFormSubmit}>
                      <div className="flex flex-col bg-gray-50 rounded-lg">
                      <p className="text-sm ml-2 mt-2 uppercase text-gray-500">Deposit</p>
                      <div className="flex items-center bg-gray-50 rounded-lg py-8 px-2 mb-3">

                        <input
                          className="appearance-none text-4xl text-right bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none focus:ring-0"
                          type="text"
                          placeholder="0.0"
                          aria-label="Full name"
                          required
                          min={0.01}
                          name="amount"
                          onChange={handleChange}
                          value={form.amount}
                        />

                        <p className="flex-shrink-0 text-4xl border-transparent border-4 font-thin text-gray-500 hover:text-teal-800 py-1 px-2 rounded">
                          {selected.symbol}
                        </p>
                      </div>
                      </div>
                      <div className="w-full flex text-gray-400 p-1 mb-4 justify-between items-center">
                      <span>$ {parseFloat(usdPrice).toFixed(2)}</span>
                      <span>1 {selected.symbol} ~ ${parseFloat(unitPrice).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                        <p className="text-sm text-center text-slate-500">
                          Gas fee will be applied extra.
                        </p>
                        <Button
                          type="submit"
                          title="Deposit"
                          primary
                          loading={isLoading}
                          disabled={isLoading}
                          className="float-right"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <BsStoplights />
    </div>
  );
};

export default DepositModal;
