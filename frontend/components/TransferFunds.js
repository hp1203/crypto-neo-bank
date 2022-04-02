import React, { useState, useEffect, Fragment, useContext } from "react";
import { useMoralis } from "react-moralis";
import { BsStoplights } from "react-icons/bs";
import Image from "next/image";
import { IoClose, IoWallet } from "react-icons/io5";
import { Dialog, Transition } from "@headlessui/react";
import Button from "./UI/Button";
import { FaPaste, FaPlusCircle } from "react-icons/fa";
import { connectors } from "../constants/walletConfigs";
import Input from "./UI/Input";
import Textarea from "./UI/Textarea";
import ImageInput from "./UI/ImageInput";
import { AccountContext } from "../context/AccountContext";
import { cryptos } from "../constants/cryptos";
import CryptoDropdown from "./CryptoDropdown";
import { getUsdPrice } from "../hooks/useChainlink";

const TransferFunds = ({ address, accountNumber }) => {
  const { isAuthenticated, Moralis } = useMoralis();

  const [selected, setSelected] = useState(cryptos[0]);
  const [usdPrice, setUsdPrice] = useState(0.0);
  const [unitPrice, setUnitPrice] = useState(0.0);
  const [transferTo, setTransferTo] = useState("self");
  const [isLoading, setIsLoading] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  const { accounts, getMaxEthBalance, getMaxERC20Balance, maxBalance, TransferEth, selectedAccount } = useContext(AccountContext);
  
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const pasteAddress = () => {
    navigator.permissions.query({ name: "clipboard-read" }).then((result) => {
      // If permission to read the clipboard is granted or if the user will
      // be prompted to allow it, we proceed.

      if (result.state == "granted" || result.state == "prompt") {
        navigator.clipboard.readText().then((data) => {
          setForm({ ...form, address: data });
          // for (let i = 0; i < data.length; i++) {
          //   if (!data[i].types.includes("image/png")) {
          //     alert("Clipboard contains non-image data. Unable to access it.");
          //   } else {
          //     data[i].getType("image/png").then((blob) => {
          //       imgElem.src = URL.createObjectURL(blob);
          //     });
          //   }
          // }
        });
      }
    });
  };

  useEffect(() => {
    console.log("crypto", cryptos[0]);
    getUsdPrice(cryptos[0].priceAddress).then((price) => {
      setUnitPrice(price);
      console.log("Price", price);
    });
  }, [cryptos[0].priceAddress]);

  // if(accounts.length <= 0){
  //   return null;
  // }
  
  const [form, setForm] = useState({
    address: "",
    accountNumber: "",
    selfAccount: accounts[0].accountNumber.toString() ? accounts[0].accountNumber.toString() : null,
    amount: "",
  });
  const handleChange = (e) => {
    
    if(e.target.name == 'amount'){
        setForm({
            ...form,
            [e.target.name]: e.target.value.replace(/[^.\d]/g, ""),
          });
        setUsdPrice(parseFloat(e.target.value.replace(/[^.\d]/g, "")) * unitPrice);
    } else if(e.target.name == 'accountNumber'){
        setForm({
            ...form,
            [e.target.name]: e.target.value.replace(/[^.\d]/g, ""),
          });
    }
    else{
        setForm({
            ...form,
            [e.target.name]: e.target.value,
          });
    }
    console.log("Form", form)
};

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form:", form);
    console.log("Selected:", selected);
    if (selected.symbol == "ETH") {
        if(transferTo == 'self'){
            TransferEth(address, form.selfAccount, form.amount);
        }else{
            TransferEth(form.address, form.accountNumber, form.amount);
        }
    } else {
      depositERC20ToAccount(
        form.address,
        form.accountNumber,
        form.amount,
        selected
      );
    }
  };

  useEffect(() => {
    if (selected.symbol == "ETH") {
      getMaxEthBalance();
    } else {
      getMaxERC20Balance(selected.address);
      // setMaxBalance(getMaxERC20Balance(selected.address))
    }
  }, [selected]);

  if (isAuthenticated) {
    return (
      <>
        {/* <button className="btn-primary text-base" onClick={openModal}>
          <IoWallet className="mr-2" />
          <span>Add New</span>
        </button> */}
        <Button
          title="Transfer Funds"
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
                  <div
                    className={`mt-2 ${
                      selected.symbol !== "ETH" ? "relative" : ""
                    }`}
                  >
                    {selected.symbol !== "ETH" && (
                      <div className="bg-gray-500 bg-opacity-80 rounded-lg absolute flex flex-col w-full h-full justify-center items-center text-white">
                        <Image
                          alt={selected.name}
                          src={selected.icon}
                          width="60px"
                          height="60px"
                          objectFit="cover"
                          className="rounded-full ml-3 w-6 h-6 bg-white"
                        />
                        <p className="text-lg text-center mx-2">
                          {`We're currently not supporting ${selected.name} deposits`}
                        </p>
                      </div>
                    )}
                    <form onSubmit={handleFormSubmit}>
                      <div className="flex flex-col space-y-1 mb-2">
                        <label className="font-medium text-gray-600">
                          Transfer To
                        </label>
                        <div className="flex bg-gray-50 p-2 rounded-lg space-x-2">
                          <a
                            title="Self"
                            primary={transferTo == "self" ? true : false}
                            onClick={() => setTransferTo("self")}
                            className={`px-4 cursor-pointer flex w-full text-center justify-center space-x-2 text-sm duration-150 font-medium py-2 items-center rounded-xl ${ transferTo == "self"  ? 'bg-violet-500 hover:bg-violet-600 border-violet-700' : 'bg-gray-200 border-gray-300 hover:bg-gray-300' } ${transferTo == "self" ? 'text-white' : 'text-gray-600' }`}
                          >Self</a>
                          <a
                            title="Other"
                            primary={transferTo == "other" ? true : false}
                            onClick={() => setTransferTo("other")}
                            className={`px-4 cursor-pointer flex w-full text-center justify-center space-x-2 text-sm duration-150 font-medium py-2 items-center rounded-xl ${ transferTo == "other"  ? 'bg-violet-500 hover:bg-violet-600 border-violet-700' : 'bg-gray-200 border-gray-300 hover:bg-gray-300' } ${transferTo == "other" ? 'text-white' : 'text-gray-600' }`}
                          >Other</a>
                        </div>
                      </div>
                      {transferTo == "self" && (
                        <div className="flex flex-col space-y-1 mb-2">
                          <label className="font-medium text-gray-600">
                            Account
                          </label>
                          <select
                            className={`border-gray-100 focus:ring-1 focus-visible:ring-violet-500 bg-gray-50 rounded-lg`}
                            name="selfAccount"
                            onChange={handleChange}
                          >
                            {accounts.map((account, index) => {
                            if(account.accountNumber !== selectedAccount.accountNumber){
                              return (
                                <option
                                  value={account.accountNumber.toString()}
                                  selected={form.selfAccount == account.accountNumber.toString()}
                                  key={index}
                                >
                                  {account.accountNumber.toString()}
                                </option>
                              );
                            }
                            })}
                          </select>
                        </div>
                      )}

                      {transferTo == "other" && (
                        <>
                        <div className="flex w-full flex-col space-y-1 mb-2">
                          <label className="font-medium text-gray-600">
                          Wallet Address
                          </label>
                          <div className="flex items-center ">
                            <input
                              type="text"
                              required
                              placeholder="Enter Beneficiary Address"
                              name="address"
                              onChange={handleChange}
                              value={form.address}
                              className="flex w-full items-center border-gray-100 focus:ring-1 focus-visible:ring-violet-500 bg-gray-50 rounded-lg"
                              />
                            <FaPaste
                              className="text-slate-400 mx-2 cursor-pointer"
                              onClick={pasteAddress}
                            />
                          </div>
                        </div>
                          <div className="flex flex-col space-y-1 mb-2">
                          <label className="font-medium text-gray-600">
                          Beneficiary Account
                          </label>
                            <input
                              type="text"
                              required
                              name="accountNumber"
                              onChange={handleChange}
                              value={form.accountNumber}
                              placeholder="Enter Beneficiary Account Number"
                              className="flex items-center border-gray-100 focus:ring-1 focus-visible:ring-violet-500 bg-gray-50 rounded-lg"
                            />
                          </div>
                        </>
                      )}
                      <div>
                        <label className="font-medium text-gray-600">
                          Transfer Amount
                        </label>
                        <div className="flex flex-col bg-gray-50 rounded-lg">
                          {/* <p className="text-sm ml-2 mt-2 uppercase text-gray-500">Deposit</p> */}
                          <div className="flex items-center bg-gray-50 rounded-lg py-2 px-2 ">
                            <input
                              className="appearance-none text-2xl text-right bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none focus:ring-0"
                              type="text"
                              placeholder="0.0"
                              aria-label="Full name"
                              required
                              min={0.01}
                              name="amount"
                              onChange={handleChange}
                              value={form.amount}
                            />

                            <p className="flex-shrink-0 text-2xl border-transparent border-4 font-thin text-gray-500 hover:text-teal-800 py-1 px-2 rounded">
                              {selected.symbol}
                            </p>
                          </div>
                          <div className="flex items-center justify-end">
                          <a
                            onClick={() =>
                              setForm({
                                ...form,
                                amount: maxBalance.replace(/[^.\d]/g, ""),
                              })
                            }
                            className="text-sm border-b border-violet-500 cursor-pointer text-violet-500 mr-2 mb-1 uppercase float-right"
                          >
                            Max: ~{parseFloat(maxBalance).toFixed(4)}
                          </a>
                        </div>
                        </div>
                      </div>
                      <div className="w-full flex text-gray-400 p-1 mb-4 justify-between items-center">
                        <span>$ {parseFloat(usdPrice).toFixed(2)}</span>
                        <span>
                          1 {selected.symbol} ~ $
                          {parseFloat(unitPrice).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                        <p className="text-sm text-center text-slate-500">
                          Gas fee will be applied extra.
                        </p>
                        <Button
                          type="submit"
                          title="Transfer Now"
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

export default TransferFunds;
