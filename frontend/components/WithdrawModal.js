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
import { cryptos, cryptos_polygon } from "../constants/cryptos";
import CryptoDropdown from "./CryptoDropdown";

const WithdrawModal = ({ address, accountNumber }) => {
  const { isAuthenticated, Moralis, chainId } = useMoralis();
  const {
    createAccount,
    isLoading,
    depositEthToAccount,
    depositERC20ToAccount,
    getMaxEthBalance,
    getMaxERC20Balance,
    maxBalance,
    withdrawMaximumEth
  } = useContext(AccountContext);

  // let currencies = [];
  // if(chainId == 0x13881){
  //   currencies = cryptos;
  // }else if(chainId == 0x3){
  //   currencies = cryptos_polygon;
  // }else {
  //   currencies = cryptos;
  // }

  const [selected, setSelected] = useState(cryptos["0x13881"][0]);
  // const [maxBalance, setMaxBalance] = useState(0.00)

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

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
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (selected.symbol == "MATIC") {
      withdrawMaximumEth()
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
    if (selected.symbol == "MATIC") {
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
          title="Withdraw"
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
                  <div className="mt-2 ">
                    <form onSubmit={handleFormSubmit}>
                      <div className="flex flex-col bg-gray-50 rounded-lg">
                        <p className="text-sm ml-2 mt-2 uppercase text-gray-500">
                          Withdraw
                        </p>
                        <div className="flex items-center bg-gray-50 rounded-lg py-6 px-2 mb-1">
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
                      <div className="w-full flex text-gray-400 p-1 mb-4 justify-between items-center">
                        <span>$ 2499</span>
                        <span>1 {selected.symbol} ~ $2499</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                        <p className="text-sm text-center text-slate-500">
                          Gas fee will be applied extra.
                        </p>
                        <Button
                          type="submit"
                          title="Withdraw"
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

export default WithdrawModal;
