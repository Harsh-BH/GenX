const { ethers } = require("hardhat");

async function main() {
  // Get the deployer's wallet address
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Fetch the Contract Factory
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.deploy(deployer.address);
  await myNFT.waitForDeployment();

  // Log the contract address
  console.log("MyNFT deployed to:", myNFT.target);
}

// Run the deployment script
main().catch((error) => {
  console.error("Error deploying contract:", error);
  process.exitCode = 1;
});
