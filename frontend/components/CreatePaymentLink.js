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

import {PAYMENT_ADDRESS} from "../constants"
import PaymentABI from "../artifacts/Payments.sol/Payments.json";
import { ethers } from "ethers";
const CreatePaymentLink = (props) => {
  const { isAuthenticated, Moralis, chainId } = useMoralis();
  const [type, setType] = useState('WALLET');
  const [isLoading, setIsLoading] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    address: "",
    account: "000000"
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
        PAYMENT_ADDRESS["0x13881"],
        PaymentABI.abi,
        signer
      );
      console.log("PaymentLink Data", create_UUID(), type, formData.address.toString(), formData.account.toString(), metadata.ipfs())
        setTimeout(() => {

        },5000)
      const txHash = await paymentContract.createPaymentLink(create_UUID(), type, formData.address.toString(), formData.account.toString(), metadata.ipfs());

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

  const handleImageChange = (event) => {
    const { name, files } = event.target;
    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: files[0],
      };
    });
    console.log(formData.image);
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
                      <ImageInput
                        preview
                        previewSrc={
                          formData.image !== null &&
                          URL.createObjectURL(formData.image)
                        }
                        previewClassName="w-20 h-20 rounded-full"
                        name="image"
                        label="Image"
                        onChange={handleImageChange}
                      />
                      <Input
                        label="Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder="Enter name for Account"
                        onChange={handleChange}
                      />
                      <Textarea
                        label="Description"
                        name="description"
                        value={formData.descriptiom}
                        placeholder="Describe your account"
                        onChange={handleChange}
                      />
                      <div className="flex flex-col space-y-1 mb-2">
                        <label className="font-medium text-gray-600">
                          Payment Type
                        </label>
                        <select
                          className={`border-gray-100 focus:ring-1 focus-visible:ring-violet-500 bg-gray-50 rounded-lg`}
                          onChange={(e) => setType(e.target.value)}
                        >
                          <option value="WALLET">Wallet</option>
                          <option value="ACCOUNT">Cryptoneo Account</option>
                        </select>
                      </div>
                      <Input
                        label="Address"
                        type="text"
                        name="address"
                        value={formData.address}
                        placeholder="Enter your wallet address"
                        onChange={handleChange}
                      />
                      {
                          type == 1 &&
                          <Input
                            label="Account Number"
                            type="number"
                            name="account"
                            value={formData.account}
                            placeholder="Enter your cryptoneo account number"
                            onChange={handleChange}
                        />
                      }
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

export default CreatePaymentLink;
