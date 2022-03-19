import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import React, { useEffect, useRef, useState, useContext } from "react";
// import ApiClient from "../utils/ApiClient";
import WalletConnectProvider from "@walletconnect/web3-provider";
// import { contractAbi, contractAddress } from "../utils/contants";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";

import { NEOBANK_ADDRESS } from "../constants";
import NeobankAbi from "../artifacts/Newbank.sol/Neobank.json";

import { WalletContext } from "./WalletContext";
import useWeb3Modal from "../hooks/useWeb3Modal";

export const AccountContext = React.createContext();

export const AccountProvider = ({ children }) => {
  // walletConnected keep track of whether the user's wallet is connected or not
  // const { getProviderOrSigner, walletConnected } = useContext(WalletContext)
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // const [ provider, loadWeb3Modal ] = useWeb3Modal();
  const { Moralis } = useMoralis();

  useEffect(()=>{
    const getMyAccounts = async () => {
      try {
        const provider = await Moralis.enableWeb3()
        // if(provider) {
          // const provider = new ethers.providers.Web3Provider(web3Provider);
          const signer = provider.getSigner();
          // const provider = getProviderOrSigner();
          // console.log("signer", walletConnected)
          const neoBankContract = new ethers.Contract(
            NEOBANK_ADDRESS,
            NeobankAbi.abi,
            signer
          );
          const allAccounts = await neoBankContract.myAccounts();
          setAccounts(allAccounts);
          setSelectedAccount(allAccounts[0]);
          console.log("Accounts", allAccounts)
        // }
        // loadWeb3Modal()
      } catch(err) {
        console.log(err)
      }
  
    }
    getMyAccounts();
  },[]);

  const createAccount = async (name, metadata) => {
    try {
      const provider = await Moralis.enableWeb3()
      // if(provider) {
        // const provider = new ethers.providers.Web3Provider(web3Provider);
        const signer = provider.getSigner();
        // const provider = getProviderOrSigner();
        // console.log("signer", walletConnected)
        const neoBankContract = new ethers.Contract(
          NEOBANK_ADDRESS,
          NeobankAbi.abi,
          signer
        );

        
        const txHash = await neoBankContract.createAccount(
          name, metadata
        );
        
        setIsLoading(true);
        console.log(`Loading - ${txHash.hash}`);
        await txHash.wait();
        setIsLoading(false);
        console.log(`Success - ${txHash.hash}`);
        neoBankContract.on('AccountCreated', (_owner, _accountNumber, metadata) => {
          console.log("Event",_owner, _accountNumber, metadata);  
        })
      // }
      // loadWeb3Modal()
    } catch(err) {
      console.log(err)
    }
  }
  return (
    <AccountContext.Provider
      value={{
        isLoading,
        accounts,
        selectedAccount,
        setSelectedAccount,
        createAccount
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};