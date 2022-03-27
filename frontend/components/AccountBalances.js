import React, {useContext, useState, useEffect} from "react";
import { FaArrowRight } from "react-icons/fa";
import Button from "./UI/Button";
import Card from "./UI/Card";
import { AccountContext } from "../context/AccountContext";
import ShowMoreText from "react-show-more-text";
import Image from "next/image";
import ListItem from "./UI/ListItem";
export const AccountBalances = (props) => {
  const { selectedAccount, Balances, getEthBalance, getERC20Balance  } = useContext(AccountContext)
  const [userBalances, setUserBalances] = useState([])
 
  useEffect(() => {
    setUserBalances(Balances)
  },[Balances])
  console.log("Balance", Balances)
  if(!Balances){
    return null
  }
  return (
    <Card {...props}>
            <div className="flex mb-4 items-center justify-between">
              <p className="font-semibold text-lg">Deposited Assets</p>
              <FaArrowRight className="text-sm items-center font-base tracking-widest text-violet-500" />
            </div>
            {
              userBalances.map((crypto, index) => (
                <ListItem image={crypto.icon} title={crypto.name} subTitle={crypto.symbol} key={index} left={(
                  <div className="flex flex-col items-end">
                    <p className=" font-medium">{parseFloat(crypto.amount).toFixed(2)} {crypto.symbol}</p>
                    <p className="text-xs text-green-600">APY: {parseFloat(crypto.apy).toFixed(2)} {crypto.symbol}</p>
                  </div>
                )}/>
              ))
            }
          </Card>
  );
};
