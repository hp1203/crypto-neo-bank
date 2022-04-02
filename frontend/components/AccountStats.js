import React, {useContext, useState, useEffect} from "react";
import { FaArrowRight } from "react-icons/fa";
import Button from "./UI/Button";
import Card from "./UI/Card";
import { AccountContext } from "../context/AccountContext";
import ShowMoreText from "react-show-more-text";
import Image from "next/image";
import DepositModal from "./DepositModal";
import { AuthContext } from "../context/AuthContext";
import WithdrawModal from "./WithdrawModal";
import TransferFunds from "./TransferFunds";
export const AccountStats = (props) => {
  const { selectedAccount, getIpfsData, maxUSDBalance } = useContext(AccountContext)
  const { account } = useContext(AuthContext)
  const [metadata, setMetadata] = useState({});
  useEffect(() => {
    if(selectedAccount){
      // return null;
      getIpfsData(selectedAccount.metadata).then(data => {
        console.log("Metadata", data)  
        setMetadata(data)
      }); 
    }
  }, [selectedAccount])
  
  if(!selectedAccount){
    return null;
  }
  return (
    <Card {...props}>
      <div className="w-full flex flex-col justify-between top-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs font-base tracking-widest text-gray-500">
            Account Details
          </p>
          <p className="text-xs font-base tracking-widest text-gray-500">
            Available Funds
          </p>
        </div>
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
            
              <div className="flex flex-col items-start space-y-2">
                <p className="font-medium text-2xl">{metadata.name}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs items-center font-base tracking-widest text-gray-500">
                    AC: {selectedAccount.accountNumber.toString()} 
                  </p>
                  <FaArrowRight className="text-xs items-center font-base tracking-widest text-violet-500"/>
                </div>
              </div>
            </div>
            <p className="text-xs items-center font-base text-gray-500">
            <ShowMoreText
                /* Default options */
                lines={2}
                more="Show more"
                less="Show less"
                className="content-css"
                anchorClass="my-anchor-css-class"
                expanded={false}
                width={280}
                truncatedEndingComponent={"... "}
            >

            {metadata.description}
            </ShowMoreText>
            </p>
          </div>
          <p className="font-semibold text-3xl tracking-widest">
            <span className="text-gray-500 font-extralight">$</span>{parseFloat(maxUSDBalance).toFixed(2)}
          </p>
        </div>
        <div className="flex space-x-2 items-center justify-between">
          <div className="flex space-x-2 items-center">
          {/* <Button title="Transfer Now" primary/> */}
          {/* <Button title="Deposit"/> */}
          <DepositModal address={account} accountNumber={selectedAccount.accountNumber}/>
          <WithdrawModal address={account} accountNumber={selectedAccount.accountNumber}/>
          {/* <TransferFunds address={account} accountNumber={selectedAccount.accountNumber}/> */}
          </div>
          {
              metadata.image &&
              <Image alt={metadata.name} className="rounded-full w-16 h-16" objectFit="cover" width={'50px'} height={'50px'} src={metadata.image}/>
            }
        </div>
      </div>
    </Card>
  );
};
