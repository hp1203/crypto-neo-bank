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
import CryptoDropdown from "../components/CryptoDropdown"

import {INVESTMENT_ADDRESS, PAYMENT_ADDRESS} from "../constants"
import InvestmentABI from "../artifacts/InvetmentsPolygon.sol/InvestmentsPolygon.json";
import { ethers, utils } from "ethers";
import { cryptos } from "../constants/cryptos";
const CreateFd = (props) => {
  const { isAuthenticated, Moralis } = useMoralis();
  const { chainId } = props;
  const [duration, setDuration] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  setTimeout(()=>{},10000)
  const [selected, setSelected] = useState(null);
  const [usdPrice, setUsdPrice] = useState(0.0);
  const [unitPrice, setUnitPrice] = useState(0.0);

  const [formData, setFormData] = useState({
    name: "",
    amount: 0
  });

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const provider = await Moralis.enableWeb3();
      // if(provider) {
      // const provider = new ethers.providers.Web3Provider(web3Provider);
      const signer = provider.getSigner();
      // const provider = getProviderOrSigner();
      // console.log("signer", walletConnected)
      const InvestmentContract = new ethers.Contract(
        INVESTMENT_ADDRESS["0x13881"],
        InvestmentABI.abi,
        signer
      );
      console.log("Contract", InvestmentContract)

      const txHash = await InvestmentContract.connect(signer).makeFd(formData.name, duration.toString(),  { value: utils.parseEther(formData.amount) });

      setIsLoading(true);
      console.log(`Loading - ${txHash.hash}`);
      await txHash.wait();
      setIsLoading(false);
      console.log(`Success - ${txHash.hash}`);
      closeModal()
      props.fetchData();
      // }
      // loadWeb3Modal()
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (event) => {
    console.log(event);
    const { name, value } = event.target;
    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
    console.log(formData);
  };
  const setCrypto = () => {
    if(chainId){

      setSelected(cryptos["0x13881"][0])
    }
  }

  useEffect(() => {
    setCrypto()
  },[chainId])
  if (isAuthenticated) {
    return (
      <>
        {/* <button className="btn-primary text-base" onClick={openModal}>
          <IoWallet className="mr-2" />
          <span>Add New</span>
        </button> */}
        <Button
          title="Create New"
          onClick={openModal}
          primary
          leftIcon={<FaPlusCircle className="mr-1" />}
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
                    <span>Create New Payment Link</span>
                    <button type="button" className="" onClick={closeModal}>
                      <IoClose />
                    </button>
                  </Dialog.Title>
                  <div className="mt-2 ">
                    <form onSubmit={handleSubmit}>
                      {
                        selected &&
                      <Input
                        label="Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder="Enter name for Account"
                        onChange={handleChange}
                      />
                      }

                      <div className="flex flex-col space-y-1 mb-2">
        <label className="font-medium text-gray-600">Amount</label>

                      <div className="w-full bg-gray-50 flex border border-gray-100 rounded-lg p-1 mb-2">
                        <input type="text" min={0.01} placeholder="Enter Amount" className="w-full bg-transparent focus:ring-0 border-0  right-0 py-2 pl-3  text-sm leading-5 text-gray-600 font-semibold" onChange={handleChange} name="amount" value={formData.amount}/>
                        <div className="flex items-center w-24 space-x-2">
                        {
                        selected &&
                        <>
                        <Image
                            alt={selected.name}
                          src={selected.icon}
                          width="30px"
                          height="30px"
                          objectFit='cover'
                          className="rounded-full w-16 bg-white mr-2"
                        />
                        <span
                          className={`block truncate font-medium`}
                        >
                          {selected.symbol}
                        </span>
                        </>
                        }
                        </div>
                        {/* <CryptoDropdown
                      selected={selected}
                      setSelected={setSelected}
                    /> */}
</div>
                    </div>
                    <div className="flex flex-col space-y-1 mb-2">
                        <label className="font-medium text-gray-600">
                          Duration
                        </label>
                        <select
                          className={`border-gray-100 focus:ring-1 focus-visible:ring-violet-500 bg-gray-50 rounded-lg`}
                          onChange={(e) => setDuration(e.target.value)}
                        >
                          <option value="15">15 Days</option>
                          <option value="30">30 Days</option>
                          <option value="60">60 Days</option>
                          <option value="90">90 Days</option>
                        </select>
                      </div>
                      <Button
                        type="submit"
                        title="Create"
                        primary
                        loading={isLoading}
                        disabled={isLoading}
                        className="float-right"
                      />
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

export default CreateFd;
