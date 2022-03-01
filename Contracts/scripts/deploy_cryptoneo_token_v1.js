const { ethers, upgrades } = require("hardhat");

async function main() {
  const CryptoneoTokenV1 = await ethers.getContractFactory("CryptoneoToken");
  const cryptoneo = await upgrades.deployProxy(CryptoneoTokenV1, {
      initializer: "initialize",
  });
  await cryptoneo.deployed();
  console.log("Cryptoneo Token deployed to:", cryptoneo.address);
}

main();