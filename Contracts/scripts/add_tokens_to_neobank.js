const cryptos = [
    {
      name: "Basic Authentication Token",
      symbol: "BAT",
      address: "0x60B10C134088ebD63f80766874e2Cade05fc987B",
      icon: "https://etherscan.io/token/images/bat.png",
      cToken: "0xaf50a5a6af87418dac1f28f9797ceb3bfb62750a",
      decimal: "18"
    },
    {
      name: "DAI Token",
      symbol: "DAI",
      address: "0xaD6D458402F60fD3Bd25163575031ACDce07538D",
      icon: "https://etherscan.io/token/images/MCDDai_32.png",
      cToken: "0xbc689667c13fb2a04f09272753760e38a95b998c",
      decimal: "18"
    },
    {
      name: "Uniswap",
      symbol: "UNI",
      address: "0xC8F88977E21630Cf93c02D02d9E8812ff0DFC37a",
      icon: "https://etherscan.io/token/images/uniswap_32.png",
      cToken: "0x65280b21167bbd059221488b7cbe759f9fb18bb5",
      decimal: "18"
    },
    {
      name: "Wrapped BTC",
      symbol: "WBTC",
      address: "0x65058d7081FCdC3cd8727dbb7F8F9D52CefDd291",
      icon: "https://etherscan.io/token/images/wbtc_32.png?v=1",
      cToken: "0x541c9cb0e97b77f142684cc33e8ac9ac17b1990f",
      decimal: "18"
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0xFE724a829fdF12F7012365dB98730EEe33742ea2",
      icon: "https://etherscan.io/token/images/centre-usdc_32.png",
      cToken: "0x2973e69b20563bcc66dc63bde153072c33ef37fe",
      decimal: "18"
    },
    {
      name: "Tether",
      symbol: "USDT",
      address: "0x6EE856Ae55B6E1A249f04cd3b947141bc146273c",
      icon: "https://etherscan.io/token/images/tether_32.png",
      cToken: "0xf6958cf3127e62d3eb26c79f4f45d3f3b2ccded4",
      decimal: "18"
    },
  ];
  

  async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Neobank = await ethers.getContractAt("Neobank", "0xb097ea7210D63B6b59DD3C769c81fA0d7128c275");
    
    await cryptos.forEach(async crypto => {

        const tx = await Neobank.addRelaventCtoken(crypto.name.toString(), crypto.decimal.toString(), crypto.symbol.toString(), crypto.icon.toString(), crypto.address.toString(), crypto.cToken.toString())
        console.log("Hash", tx.hash)
        tx.wait()
    });
    // console.log("Neobank address:", Neobank);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  