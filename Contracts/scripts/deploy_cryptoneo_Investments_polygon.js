async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Investments = await ethers.getContractFactory("InvestmentsPolygon");
  const investments = await Investments.deploy();

  console.log("InvestmentsPolygon address:", investments.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
