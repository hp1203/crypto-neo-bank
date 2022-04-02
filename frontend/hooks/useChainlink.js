import { ethers } from "ethers";

export const getUsdPrice = async (address, network = 0x13881) => {
  const aggregatorV3InterfaceABI = [
    {
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "description",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
      name: "getRoundData",
      outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "latestRoundData",
      outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "version",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ];
  console.log("Address1", address);
  // const provider = new ethers.providers.JsonRpcProvider(
  //   "https://kovan.infura.io/v3/763bfe192ef9400db7a56b58141775d8"
  // );
  let url = "https://polygon-mumbai.g.alchemy.com/v2/8_L_Exg1aby8IVu0kQDY6p6o9abelhss";
  if(network == 0x3) {
    url = "https://kovan.infura.io/v3/763bfe192ef9400db7a56b58141775d8"
  }else if(network == 0x13881) {
    url = "https://polygon-mumbai.g.alchemy.com/v2/8_L_Exg1aby8IVu0kQDY6p6o9abelhss"
  }

  console.log("URL",url)
  const provider = new ethers.providers.JsonRpcProvider(url);
  // const addr = "0x9326BFA02ADD2366b30bacB125260Af641031331"
  const priceFeed = new ethers.Contract(
    address,
    aggregatorV3InterfaceABI,
    provider
  );
  console.log("PriceFeed", priceFeed)
//   var price = 0;
  return priceFeed.latestRoundData().then((roundData) => {
    // Do something with roundData
    const priceData = roundData;
    const ETHUSD = priceData.answer;
    const price = ETHUSD / 10 ** 8;
    console.log("ETH/USD Price1 =", price);
    return price;
});
};
