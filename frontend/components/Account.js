import React from "react";
import { IoClose, IoWallet } from "react-icons/io5";
import ProfileDropdown from "./ProfileDropdown";
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { connectors } from "../constants/walletConfigs";
import Image from "next/image";
import { useMoralis, } from "react-moralis";
import { FaCross, FaTimes } from "react-icons/fa";


const Account = () => {
  const { authenticate, user, isAuthenticated, account, chainId, logout } =
    useMoralis();
  
  let [isOpen, setIsOpen] = useState(false)
  let [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false)
  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  console.log("isAuth", isAuthenticated)
  console.log("Chain Id", chainId)
  //   authenticate().then((user) => {
  useEffect(()=>{
    if(chainId == 0x13881 || chainId == 0x3){
      setIsNetworkModalOpen(false)
    }
    else{
      setIsNetworkModalOpen(true)
    }
  },[chainId])
//     console.log("User", user)
//   })
  if (!isAuthenticated) {
    return (
      <>
        <button className="btn-primary text-base" onClick={openModal}>
          <IoWallet className="mr-2" />
          <span>Connect Wallet</span>
        </button>
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
              <Dialog.Overlay className="fixed inset-0" />
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
                  <span>Connect Wallet</span>
                  <button
                    type="button"
                    className=""
                    onClick={closeModal}
                  >
                    <IoClose/>
                  </button>
                </Dialog.Title>
                <div className="mt-2">
                {connectors.map(({ title, icon, connectorId }, key) => (
                    <div
                        className="flex flex-col justify-center items-center p-8 hover:bg-gray-50 cursor-pointer"
                        key={key}
                        onClick={async () => {
                        try {
                            await authenticate({ provider: connectorId });
                            window.localStorage.setItem("connectorId", connectorId);
                            setIsAuthModalVisible(false);
                        } catch (e) {
                            console.error(e);
                        }
                        }}
                    >
                        <Image src={icon} alt={title} width="60px" height="60px" objectFit="contain" className="mb-2" />
                        <p className="text-xl text-gray-800 mt-3">{title}</p>
                    </div>
                    ))}
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
    <>
      <ProfileDropdown user={user} account={user.get('ethAddress')} logout={logout} />
      <Transition appear show={isNetworkModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsNetworkModalOpen(false)}
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

                <div className="mt-2 flex flex-col text-center justify-center items-center p-8 space-y-2">
                  <img src="https://cdn.dribbble.com/users/2469324/screenshots/6538803/comp_3.gif" className="w-28"/>
                  <h1 className="text-xl font-semibold text-gray-800">Wrong Network!</h1>
                  <p className="text-sm text-gray-700">
                    Please switch to Polygon Mumbai or Ropsten Testnet.
                  </p>
                </div>

              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Account;
