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

import {PAYMENT_ADDRESS} from "../constants"
import PaymentABI from "../artifacts/Payments.sol/Payments.json";
import { ethers } from "ethers";
import { cryptos } from "../constants/cryptos";
const CreateFd = (props) => {
  const { isAuthenticated, Moralis } = useMoralis();
  const [type, setType] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  let [isOpen, setIsOpen] = useState(false);

  const [selected, setSelected] = useState(cryptos[0]);
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

  function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const file = new Moralis.File(formData.image.name, formData.image);
    await file.saveIPFS();
    console.log(file.ipfs(), file.hash());

    const object = {
      name: formData.name,
      description: formData.description,
      image: file.ipfs(),
    };
    const metadata = new Moralis.File("metadata.json", {
      base64: btoa(JSON.stringify(object)),
    });
    await metadata.saveIPFS();
    try {
      const provider = await Moralis.enableWeb3();
      // if(provider) {
      // const provider = new ethers.providers.Web3Provider(web3Provider);
      const signer = provider.getSigner();
      // const provider = getProviderOrSigner();
      // console.log("signer", walletConnected)
      const paymentContract = new ethers.Contract(
        PAYMENT_ADDRESS,
        PaymentABI.abi,
        signer
      );
      console.log("Contract", paymentContract)

      const txHash = await paymentContract.createPaymentLink(create_UUID(), type, formData.address.toString(), formData.account.toString(), metadata);

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
                      
                      <Input
                        label="Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder="Enter name for Account"
                        onChange={handleChange}
                      />

                      <Input
                        label="Address"
                        type="text"
                        name="address"
                        value={formData.address}
                        placeholder="Enter your wallet address"
                        onChange={handleChange}
                      />
                      <div className="flex flex-col space-y-1 mb-2">
        <label className="font-medium text-gray-600">Amount</label>

                      <div className="w-full bg-gray-50 flex border border-gray-100 rounded-lg p-1 mb-2">
                        <input type="text" min={0.01} placeholder="Enter Amount" className="w-full bg-transparent focus:ring-0 border-0  right-0 py-2 pl-3  text-sm leading-5 text-gray-600 font-semibold" onChange={handleChange} name="amount" value={formData.amount}/>
                        <div className="flex items-center w-24 space-x-2">
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
                          onChange={(e) => setType(e.target.value)}
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
