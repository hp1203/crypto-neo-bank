const { ethers, upgrades } = require("hardhat");
// const { CRYPTONEO_ADDRESS } = require('../constants');
async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Payments = await ethers.getContractFactory("Payments");
    const payments = await Payments.deploy("0x34D476A3d019a319c1Db824D22980e0B8C4F1E80");
  
    console.log("Payments address:", payments.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  