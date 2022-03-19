import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import React, { useEffect, useRef, useState } from "react";
// import ApiClient from "../utils/ApiClient";
import WalletConnectProvider from "@walletconnect/web3-provider";
// import { contractAbi, contractAddress } from "../utils/contants";

export const WalletContext = React.createContext();

// const { ethereum } = window;

export const WalletProvider = ({ children }) => {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
   /*
      connectWallet: Connects the MetaMask wallet
    */
      const connectWallet = async () => {
        try {
          // Get the provider from web3Modal, which in our case is MetaMask
          // When used for the first time, it prompts the user to connect their wallet
          await getProviderOrSigner();
          setWalletConnected(true);
        } catch (err) {
          console.error(err);
        }
      };
  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
   const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Rinkeby network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 3) {
      window.alert("Change the network to Ropsten");
      throw new Error("Change network to Ropsten");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "ropsten",
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              // Mikko's test key - don't copy as your mileage may vary
              infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
            }
          },
        },
        disableInjectedProvider: false,
      });
      connectWallet();

      // Check if presale has started and ended
      // const _presaleStarted = checkIfPresaleStarted();
      // if (_presaleStarted) {
      //   checkIfPresaleEnded();
      // }

      // getTokenIdsMinted();

      // // Set an interval which gets called every 5 seconds to check presale has ended
      // const presaleEndedInterval = setInterval(async function () {
      //   const _presaleStarted = await checkIfPresaleStarted();
      //   if (_presaleStarted) {
      //     const _presaleEnded = await checkIfPresaleEnded();
      //     if (_presaleEnded) {
      //       clearInterval(presaleEndedInterval);
      //     }
      //   }
      // }, 5 * 1000);

      // // set an interval to get the number of token Ids minted every 5 seconds
      // setInterval(async function () {
      //   await getTokenIdsMinted();
      // }, 5 * 1000);
    }
  }, [walletConnected]);

  return (
    <WalletContext.Provider
      value={{
        walletConnected,
        connectWallet,
        getProviderOrSigner,
        
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};