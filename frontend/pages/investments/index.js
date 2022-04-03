import React, { useContext,  useState, useEffect } from "react";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/dashboard/PageHeader";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Grid from "../../components/UI/Grid";
import HStack from "../../components/UI/HStack";
import moment from "moment";
import { FaArrowDown, FaArrowRight, FaArrowUp } from "react-icons/fa";
import Table from "../../components/UI/Table";
import TableBody from "../../components/UI/TableBody";
import TableRow from "../../components/UI/TableRow";
import TableCol from "../../components/UI/TableCol";
import TableFooter from "../../components/UI/TableFooter";
import TableHead from "../../components/UI/TableHead";

import { AccountBalances } from "../../components/AccountBalances";
import { AuthContext } from "../../context/AuthContext";
import CreatePaymentLink from "../../components/CreatePaymentLink";
import CreateFd from "../../components/CreateFd";
import { createClient } from "urql";

import ListItem from "../../components/UI/ListItem";
import { ethers, utils } from "ethers";
import { useMoralis } from "react-moralis";
import { cryptos } from "../../constants/cryptos";
import { INVESTMENT_ADDRESS } from "../../constants";

import InvestmentABI from "../../artifacts/InvetmentsPolygon.sol/InvestmentsPolygon.json";

const Investments = () => {
  const { account } = useContext(AuthContext)
  const {chainId, Moralis} = useMoralis();
  const [fds, setFds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const APIURL = "https://api.thegraph.com/subgraphs/name/hp1203/cryptoneo";
  console.log("Acc", account);
  const query = `
    query {
        fds (
            orderBy: timestamp
            orderDirection: desc
            where: { owner: "${account}" }
        ) {
          id
          fdId
          owner
          name
          startDate
          endDate
          amount
          redeemedAmount
          currency
          isActive
          timestamp
        }
        
    }
  `;
  console.log("query", query);
  const client = createClient({
    url: APIURL,
  });

  const redeemFd = async (fd) => {
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

      const txHash = await InvestmentContract.redeemFd(fd.toString());

      setIsLoading(true);
      console.log(`Loading - ${txHash.hash}`);
      await txHash.wait();
      setIsLoading(false);
      console.log(`Success - ${txHash.hash}`);
      // closeModal()
      props.fetchData();
      // }
      // loadWeb3Modal()
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async () => {
    const response = await client.query(query).toPromise();
    console.log("Response", response);
    if (response.data) {
      setFds(response.data.fds);
    }
  };
  useEffect(() => {
    fetchData();
  }, [account]);
  return (
    <AppLayout>
      <PageHeader title="Investments">
        {/* <AccountSelection/>
        */}
        {/* <CreatePaymentLink/>  */}
      </PageHeader>

      <HStack space={4}>
      
        <Grid cols={2}>
          <HStack>
          <Card className="mb-3">
                <div id="jh-stats-neutral" className="flex flex-col justify-center">
                <div className="flex justify-between mb-8">
                            <h1 className="text-lg font-semibold">Fixed Deposits</h1>
                            <CreateFd chainId={chainId} fetchData={fetchData}/>
                        </div>
                        <div className="flex justify-between">
                        <div className="flex border-r border-gray-100 w-full flex-col justify-center items-center">
                          <p className="text-3xl font-semibold text-center text-gray-800">{fds.length}</p>
                          <p className="text-lg text-center text-gray-500">Total FDs</p>
                        </div>
                        {/* <div className="flex border-r border-gray-100 w-full flex-col justify-center items-center">
                          <p className="text-3xl font-semibold text-center text-gray-800">43</p>
                          <p className="text-lg text-center text-gray-500">Total Investment</p>
                        </div>
                        <div className="flex w-full flex-col justify-center items-center">
                          <p className="text-3xl font-semibold text-center text-gray-800">43</p>
                          <p className="text-lg text-center text-gray-500">Total APY</p>
                        </div> */}
                        </div>
                    </div>
            </Card>
          <Card className="">
            <div className="flex mb-4 items-center justify-between">
              <p className="font-semibold text-lg">Latest Fds</p>
              <FaArrowRight className="text-sm items-center font-base tracking-widest text-violet-500" />
            </div>
            {fds.map((fd, index) => (
                <ListItem
                  title={fd.name}
                  subTitle={`Matures ${moment.unix(fd.endDate).fromNow()}`}
                  key={index}
                  left={
                    <div className="flex flex-col items-end space-y-1">
                    <p className=" font-medium">{parseFloat(utils.formatEther(fd.amount)).toFixed(2)} {cryptos["0x13881"][0].symbol}</p>
                    {/* <p className="text-xs text-green-600">APY: {parseFloat(crypto.apy).toFixed(2)} {crypto.symbol}</p> */}
                    {/* <Button title="Redeem Now" className="text-xs" primary onClick={() => redeemFd(fd.fdId)}/> */}
                  </div>
                  }
                />
              ))}
          </Card>
          </HStack>
          <HStack className="relative">
          <div className="bg-gray-500 bg-opacity-80 rounded-lg absolute flex flex-col w-full h-full justify-center items-center text-white">
                    
                        <p className="text-4xl text-center mx-2">Currently Under Devlopment</p>
                    </div>
          <Card className="mb-3">
                <div id="jh-stats-neutral" className="flex flex-col justify-center">
                        <div className="flex justify-between mb-8">
                            <h1 className="text-lg font-semibold">Recursive Deposits</h1>
                            <Button title="Create RD" primary={true}/>
                        </div>
                        <div className="flex justify-between">
                        <div className="flex border-r border-gray-100 w-full flex-col justify-center items-center">
                          <p className="text-3xl font-semibold text-center text-gray-800">43</p>
                          <p className="text-lg text-center text-gray-500">Total RDs</p>
                        </div>
                        <div className="flex border-r border-gray-100 w-full flex-col justify-center items-center">
                          <p className="text-3xl font-semibold text-center text-gray-800">43</p>
                          <p className="text-lg text-center text-gray-500">Total Investment</p>
                        </div>
                        <div className="flex w-full flex-col justify-center items-center">
                          <p className="text-3xl font-semibold text-center text-gray-800">43</p>
                          <p className="text-lg text-center text-gray-500">Total APY</p>
                        </div>
                        </div>
                    </div>
            </Card>
          <AccountBalances/>
          </HStack>
        </Grid>
      </HStack>
    </AppLayout>
  );
};

export default Investments;
