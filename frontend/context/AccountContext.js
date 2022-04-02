import Web3Modal from "web3modal";
import { providers, Contract, utils } from "ethers";
import React, { useEffect, useRef, useState, useContext } from "react";
// import ApiClient from "../utils/ApiClient";
import WalletConnectProvider from "@walletconnect/web3-provider";
// import { contractAbi, contractAddress } from "../utils/contants";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";

import { NEOBANK_ADDRESS, NEOBANK_ADDRESS_POLYGON } from "../constants";
// import NeobankAbi from "../artifacts/Newbank.sol/Neobank.json";
import NeobankAbiPolygon from "../artifacts/NeobankPolygon.sol/NeobankPolygon.json";
import NeobankAbiEther from "../artifacts/Newbank.sol/Neobank.json";

import { WalletContext } from "./WalletContext";
import useWeb3Modal from "../hooks/useWeb3Modal";
import axios from "axios";

import { cryptos } from "../constants/cryptos";
import { getUsdPrice } from "../hooks/useChainlink";
export const AccountContext = React.createContext();

export const AccountProvider = ({ children }) => {
  // walletConnected keep track of whether the user's wallet is connected or not
  // const { getProviderOrSigner, walletConnected } = useContext(WalletContext)
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  var [Balances, setBalances] = useState([]);
  const [maxBalance, setMaxBalance] = useState(0.00)
  const [maxUSDBalance, setMaxUSDBalance] = useState(0)
  // const [ provider, loadWeb3Modal ] = useWeb3Modal();
  const { Moralis, Util, chainId } = useMoralis();
  let NeobankAbi = null;
  // let cryptos[chainId] = [];
  // let NEOBANK_ADDRESS[chainId] = null;
  if(chainId == 0x3){
    // currencies = cryptos;
    NeobankAbi = NeobankAbiEther;
    // NEOBANK_ADDRESS[chainId] = NEOBANK_ADDRESS;
  }else if(chainId == 0x13881){
    // currencies = cryptos_polygon;
    NeobankAbi = NeobankAbiPolygon;
    // NEOBANK_ADDRESS[chainId] = NEOBANK_ADDRESS_POLYGON;
  }else {
    // cryptos[chainId] = cryptos;
    NeobankAbi = NeobankAbiEther;
    // NEOBANK_ADDRESS[chainId] = NEOBANK_ADDRESS;
  }

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

  const TransferEth = async (address, toAccount, amount) => {
    try {

      const provider = await Moralis.enableWeb3();
        // if(provider) {
        // const provider = new ethers.providers.Web3Provider(web3Provider);
        const signer = provider.getSigner();
        // const provider = getProviderOrSigner();
        // console.log("signer", walletConnected)
        const neoBankContract = new ethers.Contract(
          NEOBANK_ADDRESS["0x13881"],
          NeobankAbi.abi,
          signer
        );
  
        const txHash = await neoBankContract.transferETH(selectedAccount.accountNumber.toString(), toAccount.toString(), address.toString(), ethers.utils.parseEther(amount))
        setIsLoading(true);
        console.log(`Loading - ${txHash.hash}`);
        await txHash.wait();
        setIsLoading(false);
        console.log(`Success - ${txHash.hash}`);
    } catch(err) {
      console.log(err)
    }
  }

  const withdrawMaximumEth = async () => {
    try {

      const provider = await Moralis.enableWeb3();
        // if(provider) {
        // const provider = new ethers.providers.Web3Provider(web3Provider);
        const signer = provider.getSigner();
        // const provider = getProviderOrSigner();
        // console.log("signer", walletConnected)
        const neoBankContract = new ethers.Contract(
          NEOBANK_ADDRESS["0x13881"],
          NeobankAbi.abi,
          signer
        );
  
        const txHash = await neoBankContract.withdrawMaxEth(selectedAccount.accountNumber.toString())
        setIsLoading(true);
        console.log(`Loading - ${txHash.hash}`);
        await txHash.wait();
        setIsLoading(false);
        console.log(`Success - ${txHash.hash}`);
    } catch(err) {
      console.log(err)
    }
  }

  const getMaxEthBalance = async () => {
    try {
      setMaxBalance(0.00)
      const provider = await Moralis.enableWeb3();
        // if(provider) {
        // const provider = new ethers.providers.Web3Provider(web3Provider);
        const signer = provider.getSigner();
        // const provider = getProviderOrSigner();
        // console.log("signer", walletConnected)
        const neoBankContract = new ethers.Contract(
          NEOBANK_ADDRESS["0x13881"],
          NeobankAbi.abi,
          signer
        );
  
        setMaxBalance(ethers.utils.formatEther(await neoBankContract.getEthBalanceWithInterest(selectedAccount.accountNumber.toString())));
    } catch(err) {
      console.log(err)
    }
  }
  const getMaxERC20Balance = async (token) => {
      try {
        setMaxBalance(0.00)
        const provider = await Moralis.enableWeb3();
        // if(provider) {
        // const provider = new ethers.providers.Web3Provider(web3Provider);
        const signer = provider.getSigner();
        // const provider = getProviderOrSigner();
        // console.log("signer", walletConnected)
        const neoBankContract = new ethers.Contract(
          NEOBANK_ADDRESS["0x13881"],
          NeobankAbi.abi,
          signer
        );
        
        setMaxBalance(ethers.utils.formatEther(await neoBankContract.getERC20BalanceWithInterest(selectedAccount.accountNumber.toString(), token.toString())));
      } catch(err) {
      console.log(err)
    }
      
  }

  const getEthBalance = async () => {
    console.log("Selected",selectedAccount)
    try {
      const provider = await Moralis.enableWeb3();
      // if(provider) {
      // const provider = new ethers.providers.Web3Provider(web3Provider);
      const signer = provider.getSigner();
      // const provider = getProviderOrSigner();
      // console.log("signer", walletConnected)
      const neoBankContract = new ethers.Contract(
        NEOBANK_ADDRESS["0x13881"],
        NeobankAbi.abi,
        signer
      );

      console.log("Neo",neoBankContract)
      const ethBalance = await neoBankContract.getEthBalance(selectedAccount['accountNumber'].toString());
      const ethBalanceWithInterest = await neoBankContract.getEthBalanceWithInterest(selectedAccount['accountNumber'].toString());
      console.log("EthBalance", ethBalance.toString())
      // const index = Balances.findIndex(x => x.symbol ==="ETH");
      let balances = [];
      balances.push({
          name: cryptos["0x13881"][0].name,
          symbol: cryptos["0x13881"][0].symbol,
          icon: cryptos["0x13881"][0].icon,
          amount: ethers.utils.formatEther(ethBalance.toString()),
          apy: ethers.utils.formatEther(ethBalanceWithInterest.toString() - ethBalance.toString())
        })
        setTimeout(() => {
          
        }, 5000);
      getUsdPrice(cryptos["0x13881"][0].priceAddress, "0x13881").then((price) => {
        console.log("in")
        console.log("Price", price, typeof price)
        console.log("BalWithInt", parseFloat(ethers.utils.formatEther(ethBalanceWithInterest.toString())), typeof parseFloat(ethers.utils.formatEther(ethBalanceWithInterest.toString())))
        const usdPrice = parseFloat(maxUSDBalance) + (parseFloat(ethers.utils.formatEther(ethBalanceWithInterest.toString())) * price);
        console.log("UsdPrice", usdPrice)
        setMaxUSDBalance(usdPrice)
      }).catch(err => {
        console.log("Err", err)
      })
      // setBalances(balances)
      
      // for(var i = 1; i < cryptos["0x13881"].length; i++){
      //   const balance = await neoBankContract.getERC20Balance(selectedAccount.accountNumber.toString(), cryptos["0x13881"][i].address);
      //   console.log("Balance of ", cryptos["0x13881"][i].name, balance)
      //   const balanceWithInterest = await neoBankContract.getERC20BalanceWithInterest(selectedAccount.accountNumber.toString(), cryptos["0x13881"][i].address);
      //   // console.log("EthBalance", ethBalance.toString())
      //   balances.push({
      //     name: cryptos["0x13881"][i].name,
      //     symbol: cryptos["0x13881"][i].symbol,
      //     icon: cryptos["0x13881"][i].icon,
      //     amount: ethers.utils.formatEther(balance.toString()),
      //     apy: ethers.utils.formatEther(balanceWithInterest.toString() - balance.toString())
      //   })
      //   setTimeout(() => {
          
      //   }, 5000);
      //   getUsdPrice(cryptos["0x13881"][i].priceAddress, "0x13881").then((price) => {
      //     console.log("in")
      //     console.log("Price", price, typeof price)
      //     console.log("BalWithInt", parseFloat(ethers.utils.formatEther(ethBalanceWithInterest.toString())), typeof parseFloat(ethers.utils.formatEther(ethBalanceWithInterest.toString())))
      //     const usdPrice = parseFloat(maxUSDBalance) + (parseFloat(ethers.utils.formatEther(ethBalanceWithInterest.toString())) * price);
      //     console.log("UsdPrice", usdPrice)
      //     setMaxUSDBalance(usdPrice)
      //   }).catch(err => {
      //     console.log("Err", err)
      //   })
      // }
      setBalances(balances)
      console.log("Index", Balances)
      
      // }
      // loadWeb3Modal()
    } catch (err) {
      console.log(err);
    }
  }

  const depositERC20ToAccount = async (address, accountNumber, amount, token) => {
    try {
      const provider = await Moralis.enableWeb3();
      // if(provider) {
      // const provider = new ethers.providers.Web3Provider(web3Provider);
      const signer = provider.getSigner();
      const ercToken = new ethers.Contract(token.address, token.abi, signer);
      console.log("Contract", ercToken)
      const tx = await ercToken.transfer(NEOBANK_ADDRESS["0x13881"], ethers.utils.parseEther(amount));
      setIsLoading(true);
      console.log(`Loading - ${tx.hash}`);
      await tx.wait();
      setIsLoading(false);
      console.log(`Success - ${tx.hash}`);
      // const provider = getProviderOrSigner();
      // console.log("signer", walletConnected)
      const neoBankContract = new ethers.Contract(
        NEOBANK_ADDRESS["0x13881"],
        NeobankAbi.abi,
        signer
      );

      const txHash = await neoBankContract.depositERC20IntoAccount(address.toString(), accountNumber.toString(), ethers.utils.parseEther(amount), token.address)
      setIsLoading(true);
      console.log(`Loading - ${txHash.hash}`);
      await txHash.wait();
      setIsLoading(false);
      console.log(`Success - ${txHash.hash}`);
      window.location.reload()
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
        NEOBANK_ADDRESS["0x13881"],
        NeobankAbi.abi,
        signer
      );

      const txHash = await neoBankContract.connect(signer).depositIntoAccount(address.toString(), accountNumber.toString(), ethers.utils.parseEther(amount), {value: ethers.utils.parseEther(amount)})
      setIsLoading(true);
      console.log(`Loading - ${txHash.hash}`);
      await txHash.wait();
      setIsLoading(false);
      console.log(`Success - ${txHash.hash}`);
      window.location.reload()

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
        NEOBANK_ADDRESS["0x13881"],
        NeobankAbi.abi,
        signer
      );
      let balances = [];
      
      for(var i = 1; i < cryptos["0x13881"].length(); i++){
        const balance = await neoBankContract.getERC20Balance(selectedAccount.accountNumber.toString(), cryptos["0x13881"][i].address);
        const balanceWithInterest = await neoBankContract.getERC20BalanceWithInterest(selectedAccount.accountNumber.toString(), cryptos["0x13881"][i].address);
        // console.log("EthBalance", ethBalance.toString())
        balances[i] = {
          name: cryptos["0x13881"][i].name,
          symbol: cryptos["0x13881"][i].symbol,
          icon: cryptos["0x13881"][i].icon,
          amount: ethers.utils.formatEther(balance.toString()),
          apy: ethers.utils.formatEther(balanceWithInterest.toString() - balance.toString())
        }
        setTimeout(() => {
          
        }, 5000);
        await getUsdPrice(cryptos["0x13881"][i].priceAddress, "0x13881").then((price) => {
          setMaxUSDBalance(maxUSDBalance + (ethers.utils.formatEther(balanceWithInterest) * price))
        })
      }
      setBalances([...Balances, balances])
      console.log("Index", balances)

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if(selectedAccount){

      getEthBalance();
      getERC20Balance();
    }

  },[selectedAccount])

  const getMyAccounts = async () => {
    try {
      const provider = await Moralis.enableWeb3();
      // if(provider) {
      // const provider = new ethers.providers.Web3Provider(web3Provider);
      const signer = provider.getSigner();
      // const provider = getProviderOrSigner();
      // console.log("Address", NEOBANK_ADDRESS["0x13881"])
      const neoBankContract = new ethers.Contract(
        NEOBANK_ADDRESS["0x13881"],
        NeobankAbi.abi,
        signer
      );
      console.log("COntract", neoBankContract)
      const allAccounts = await neoBankContract.myAccounts();

      setSelectedAccount(allAccounts[0]);
      setAccounts(allAccounts);
      console.log("Accounts", allAccounts);
      setTimeout(() => {
        
      }, 5000);

      // }
      // loadWeb3Modal()
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getMyAccounts();
  }, [chainId]);

  const createAccount = async (name, metadata) => {
    try {
      const provider = await Moralis.enableWeb3();
      // if(provider) {
      // const provider = new ethers.providers.Web3Provider(web3Provider);
      const signer = provider.getSigner();
      // const provider = getProviderOrSigner();
      // console.log("signer", walletConnected)
      const neoBankContract = new ethers.Contract(
        NEOBANK_ADDRESS[chainId],
        NeobankAbi.abi,
        signer
      );

      const txHash = await neoBankContract.createAccount(name, metadata);

      setIsLoading(true);
      console.log(`Loading - ${txHash.hash}`);
      await txHash.wait();
      setIsLoading(false);
      console.log(`Success - ${txHash.hash}`);
      // neoBankContract.on(
      //   "AccountCreated",
      //   (_owner, _accountNumber, metadata) => {
      //     console.log("Event", _owner, _accountNumber, metadata);
      //   }
      // );
      console.log(`Success - ${txHash.hash}`);
      window.location.reload()
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
        depositEthToAccount,
        depositERC20ToAccount,
        getMaxEthBalance,
        getMaxERC20Balance,
        maxBalance,
        withdrawMaximumEth,getEthBalance,getERC20Balance,maxUSDBalance,TransferEth
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
