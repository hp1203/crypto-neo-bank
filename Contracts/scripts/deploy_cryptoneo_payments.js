const { ethers, upgrades } = require("hardhat");
// const { CRYPTONEO_ADDRESS } = require('../constants');
async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Payments = await ethers.getContractFactory("Payments");
    const payments = await Payments.deploy("0xd05ed9B47B87Ce945f422838195cd8D95Fe14398");
  
    console.log("Payments address:", payments.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  