import Web3Modal from "web3modal";
import { providers, Contract, utils } from "ethers";
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
import axios from "axios";

import { cryptos } from "../constants/cryptos";
export const AccountContext = React.createContext();

export const AccountProvider = ({ children }) => {
  // walletConnected keep track of whether the user's wallet is connected or not
  // const { getProviderOrSigner, walletConnected } = useContext(WalletContext)
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  var [Balances, setBalances] = useState(cryptos);

  // const [ provider, loadWeb3Modal ] = useWeb3Modal();
  const { Moralis, Util } = useMoralis();

  const getIpfsData = async (metadataUrl) => {
    // await fetch(metadataUrl).then(res => res.json()).then(result => result.data).catch(console.log);
    let data;
    await axios
      .get(metadataUrl)
      .then((res) => {
        console.log("IPFS", typeof res.data);
        let metadata = JSON.stringify(res.data);
        // data = metadata.replace('ipfs://', baseIpfsUrl);
        return (data = JSON.parse(metadata));
        // return metadata;
      })
      .catch((err) => {
        return err;
      });
    return data;
  };

  const getEthBalance = async () => {
    try {
      const provider = await Moralis.enableWeb3();
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

      const ethBalance = await neoBankContract.getEthBalance(selectedAccount.accountNumber.toString());
      const ethBalanceWithInterest = await neoBankContract.getEthBalanceWithInterest(selectedAccount.accountNumber.toString());
      console.log("EthBalance", ethBalance.toString())
      const index = Balances.findIndex(x => x.symbol ==="ETH");
      let balances = Balances;
      balances[index] = {
          name: cryptos[0].name,
          symbol: cryptos[0].symbol,
          icon: cryptos[0].icon,
          amount: ethers.utils.formatEther(ethBalance.toString()),
          apy: ethers.utils.formatEther(ethBalanceWithInterest.toString() - ethBalance.toString())
        }
      console.log("Index", balances)
      setBalances(balances)
      
      // }
      // loadWeb3Modal()
    } catch (err) {
      console.log(err);
    }
  }

  const depositEthToAccount = async (address, accountNumber, amount) => {
    try {
      const provider = await Moralis.enableWeb3();
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

      const txHash = await neoBankContract.connect(signer).depositIntoAccount(address.toString(), accountNumber.toString(), ethers.utils.parseEther(amount), {value: ethers.utils.parseEther(amount)})
      setIsLoading(true);
      console.log(`Loading - ${txHash.hash}`);
      await txHash.wait();
      setIsLoading(false);
      console.log(`Success - ${txHash.hash}`);

    } catch (err) {
      console.log(err);
    }
  }

  const getERC20Balance = async () => {
    try {
      const provider = await Moralis.enableWeb3();
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
      let balances = Balances;
      
      for(var i = 1; i < Balances.length(); i++){
        const balance = await neoBankContract.getERC20Balance(selectedAccount.accountNumber.toString(), cryptos[i].address);
        const balanceWithInterest = await neoBankContract.getERC20BalanceWithInterest(selectedAccount.accountNumber.toString(), cryptos[i].address);
        // console.log("EthBalance", ethBalance.toString())
        balances[i] = {
          name: cryptos[i].name,
          symbol: cryptos[i].symbol,
          icon: cryptos[i].icon,
          amount: ethers.utils.formatEther(balance.toString()),
          apy: ethers.utils.formatEther(balanceWithInterest.toString() - balance.toString())
        }
      }
      setBalances(balances)
      // console.log("Index", index)

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if(selectedAccount){
      getEthBalance();
      getERC20Balance();
    }
  },selectedAccount)

  useEffect(() => {
    const getMyAccounts = async () => {
      try {
        const provider = await Moralis.enableWeb3();
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

        setSelectedAccount(allAccounts[0]);
        setAccounts(allAccounts);
        console.log("Accounts", allAccounts);
        // }
        // loadWeb3Modal()
      } catch (err) {
        console.log(err);
      }
    };
    getMyAccounts();
  }, []);

  const createAccount = async (name, metadata) => {
    try {
      const provider = await Moralis.enableWeb3();
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

      const txHash = await neoBankContract.createAccount(name, metadata);

      setIsLoading(true);
      console.log(`Loading - ${txHash.hash}`);
      await txHash.wait();
      setIsLoading(false);
      console.log(`Success - ${txHash.hash}`);
      neoBankContract.on(
        "AccountCreated",
        (_owner, _accountNumber, metadata) => {
          console.log("Event", _owner, _accountNumber, metadata);
        }
      );
      // }
      // loadWeb3Modal()
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <AccountContext.Provider
      value={{
        isLoading,
        accounts,
        selectedAccount,
        setSelectedAccount,
        createAccount,
        getIpfsData,
        Balances,
        depositEthToAccount
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
