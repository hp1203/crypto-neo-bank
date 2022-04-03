import { route } from "next/dist/server/router";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

import { Fragment, useState, useEffect, useContext } from "react";
import { Combobox, Transition } from "@headlessui/react";

import { HiSelector } from "react-icons/hi";
import { BiCheck, BiListCheck } from "react-icons/bi";
import { FaDiscord, FaFacebook, FaGithub, FaTwitter } from "react-icons/fa";
import { useMoralis } from "react-moralis";
import { PAYMENT_ADDRESS } from "../../constants";
import PaymentABI from "../../artifacts/Payments.sol/Payments.json";
import { createClient } from "urql";
import { AccountContext } from "../../context/AccountContext";
import { getUsdPrice } from "../../hooks/useChainlink";
import { cryptos } from "../../constants/cryptos";
import { ethers, utils } from "ethers";
import toast from "react-hot-toast";
import Button from "../../components/UI/Button";
import axios from "axios";
const people = [
  { id: 1, name: "MATIC", icon: "https://downloads.coindesk.com/arc-hosted-images/polygon.png" },
  // { id: 2, name: "LINK", icon:"https://etherscan.io/token/images/chainlinktoken_32.png?v=6" },
  // { id: 3, name: "USDT", icon:"https://etherscan.io/token/images/tether_32.png" },
  // { id: 4, name: "DAI", icon:"https://etherscan.io/token/images/MCDDai_32.png" },
  // { id: 5, name: "MATIC", icon:"https://etherscan.io/token/images/matic-polygon_32.png" },
  // { id: 6, name: "UNI", icon:"https://etherscan.io/token/images/uniswap_32.png" },
];

const CurrencyDropdown = () => {
  const [selected, setSelected] = useState(people[0]);
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) =>
          person.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className="w-full max-w-[130px]">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative">
          <div className="relative w-full text-left bg-white rounded-lg border cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-violet-300 focus-visible:ring-offset-2 sm:text-sm overflow-hidden flex items-center">
            <img src={selected.icon} className="w-6 h-6 rounded-full ml-2 bg-white border"/>
            <Combobox.Input
              className="w-full border-none focus:ring-0 border-0 right-0 py-2 pl-3 pr-10 text-sm leading-5 text-gray-600 font-semibold"
              displayValue={(person) => person.name}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <HiSelector
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredPeople.length === 0 && query !== "" ? (
                <div className="cursor-default select-none relative py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredPeople.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `cursor-default select-none relative py-2 pl-4 pr-4 ${
                        active ? "text-white bg-violet-600" : "text-gray-900"
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <div className="flex items-center space-x-2">
                      <img src={person.icon} className="w-6 h-6 rounded-full bg-white"/>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {person.name}
                        </span>
                        {selected ? (
                          <span
                            className={`flex items-center ${
                              active ? "text-white" : "text-violet-600"
                            }`}
                          >
                            <BiCheck className="w-5 h-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </div>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

// useEffect(() => {
//   const getPaymentLinkDetails = async () => {
//     try {
//       const provider = await Moralis.enableWeb3();
//         // if(provider) {
//         // const provider = new ethers.providers.Web3Provider(web3Provider);
//         const signer = provider.getSigner();
//         // const provider = getProviderOrSigner();
//         // console.log("signer", walletConnected)
//         const paymentContract = new ethers.Contract(
//           PAYMENT_ADDRESS,
//           PaymentABI.abi,
//           signer
//         );
  
//         setPaymentLinkDetails(await paymentContract.getPaymentLink());
//     } catch(err) {
//       console.log(err)
//     }
//   }
//   getPaymentLinkDetails()
// },[])

const Pay = () => {
  const router = useRouter();
  const { linkid } = router.query;
  console.log("id",linkid)
  const [paymentLinkDetails, setPaymentLinkDetails] = useState(null)
  const [metadata, setMetadata] = useState(null)
  const { Moralis } = useMoralis()
  const { getIpfsData } = useContext(AccountContext)
  const [amount, setAmount] = useState(0.0)
  const [usdPrice, setUsdPrice] = useState(0.0);
  const [unitPrice, setUnitPrice] = useState(0.0);
  const [isLoading, setIsLoading] = useState(false);
  const APIURL = "https://api.thegraph.com/subgraphs/name/hp1203/cryptoneo";

  const query = `
    query {
        paymentLinks (
            where: { url: "${linkid}" }
        ) {
          id
          owner
          paymentLinkId
          url
          type
          receiver
          metadata
          timestamp
        }
    }
  `;
  console.log("query", query)
  const client = createClient({
      url: APIURL
  });
  useEffect(()=>{
    console.log("crypto",cryptos["0x13881"][0])
    getUsdPrice(cryptos["0x13881"][0].priceAddress).then((price)=>{
      setUnitPrice(price)
      console.log("Price", price)
    })
  },[cryptos["0x13881"][0].priceAddress])

  const handleOnChange = (e) => {
    setAmount(e.target.value.replace(/[^.\d]/g, ""));
    setUsdPrice(parseFloat(amount) * unitPrice)
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    
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
      console.log("Contract", paymentContract)

      const txHash = await paymentContract.connect(signer).makeEthPayment(paymentLinkDetails.paymentLinkId, { value: utils.parseEther(amount)});

      setIsLoading(true);
      console.log(`Loading - ${txHash.hash}`);
      await txHash.wait();
      setIsLoading(false);
      console.log(`Success - ${txHash.hash}`);
      toast.success("Payment Successfull!")
      // }
      // loadWeb3Modal()
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
        const response = await client.query(query).toPromise()
        // console.log("Response", response.data.paymentLinks[0]);
        if(response.data.paymentLinks[0] !== undefined){
          setPaymentLinkDetails(response.data.paymentLinks[0])
          if(response.data.paymentLinks[0].metadata !== ""){
            console.log("asdasd")
            // getIpfsData(response.data.paymentLinks[0].metadata).then(data => {
            //   console.log("data", data)
            //   setMetadata(data)
            // }); 
            await axios
            .get(response.data.paymentLinks[0].metadata)
            .then((res) => {
              console.log("IPFS", typeof res.data);
              let metadata = JSON.stringify(res.data);
              // data = metadata.replace('ipfs://', baseIpfsUrl);
              setMetadata(JSON.parse(metadata))
              // return (data = JSON.parse(metadata));
              // return metadata;
            })
            .catch((err) => {
              return err;
            });
          }
          console.log("Metadata",response.data.paymentLinks[0].metadata)  
        }
        // try {
        //   const provider = await Moralis.enableWeb3();
        //   // if(provider) {
        //   // const provider = new ethers.providers.Web3Provider(web3Provider);
        //   const signer = provider.getSigner();
        //   // const provider = getProviderOrSigner();
        //   // console.log("signer", walletConnected)
        //   const paymentContract = new ethers.Contract(
        //     PAYMENT_ADDRESS,
        //     PaymentABI.abi,
        //     signer
        //   );

        //   // console.log("Contract", paymentContract)
    
        //   const link = await paymentContract.getPaymentLink(response.data.paymentLinks[0].paymentLinkId);
        //   console.log("Link", link)
        //   // }
        //   // loadWeb3Modal()
        // } catch (err) {
        //   console.log(err);
        // }
    }
    fetchData()
  },[linkid])

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main
        className="min-h-screen flex justify-center items-start py-24
        bg-gray-50 px-8"
      >
        <div className="flex font-sans bg-white max-w-xl shadow-lg rounded-lg">
        {
          metadata !== null &&
          <div className="flex-none hidden md:block w-56 p-4">
            <img
              src={metadata.image}
              alt=""
              className="inset-0 w-full h-full object-cover rounded-lg object-contain"
            />
          </div>
        }
          <form className="flex-auto p-6" onSubmit={handlePayment}>
          {
            metadata !== null && (
            <div className="flex items-center border-b border-gray-100 pb-4 mb-4">
            <img
              src={metadata.image}
              alt=""
              className="inset-0 w-28 h-28 rounded-lg mr-3 object-cover rounded-lg block md:hidden"
            />
              <div className="flex flex-col">
                <h1 className="font-bold text-xl text-gray-800 mb-1">
                  {metadata.name}
                </h1>
                {/* <div className="w-full flex-none mt-2 order-1 text-3xl font-bold text-violet-500">
                  $39.00
                </div> */}
                <div className="text-sm font-base text-slate-400 mb-2">
                {metadata.description}
                </div>
                {/* <div className="flex space-x-2 text-gray-500">
                  <FaFacebook className="w-5 h-5 hover:text-violet-500 cursor-pointer"/>
                  <FaTwitter className="w-5 h-5 hover:text-violet-500 cursor-pointer"/>
                  <FaGithub className="w-5 h-5 hover:text-violet-500 cursor-pointer"/>
                  <FaDiscord className="w-5 h-5 hover:text-violet-500 cursor-pointer"/>
                </div> */}
              </div>
            </div>)
          }

            <div className="w-full flex border rounded-lg p-1 mb-2">
                <input type="text" min={0.01} placeholder="Enter Amount" className="w-full focus:ring-0 border-0  right-0 py-2 pl-3  text-sm leading-5 text-gray-600 font-semibold" onChange={handleOnChange} name="amount" value={amount}/>
                <CurrencyDropdown />

            </div>
            <div className="w-full flex text-gray-400 p-1 mb-4 justify-between items-center">
              <span>$ {parseFloat(usdPrice).toFixed(2)}</span>
              <span>1 MATIC ~ ${parseFloat(unitPrice).toFixed(2)}</span>
            </div>
            <Button primary className="w-full text-center justify-center mb-2" title="Pay Now" type="submit" loading={isLoading}/>
            {/* <button
              className="h-10 px-6 mb-2 font-semibold rounded-lg w-full bg-violet-500 hover:bg-violet-600 duration-150 text-white"
              type="submit"
            >
              Pay now
            </button> */}
            <p className="text-sm text-center text-slate-500">
              Gas fee will be applied extra.
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pay;
