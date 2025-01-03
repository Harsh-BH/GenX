import { ethers, Contract } from "ethers";
import MyNFT from "../../../genx-web3/artifacts/contracts/MyNFT.sol/MyNFT.json"; // Adjust the path

// Define types for the contract
interface MyNFTContract extends Contract {
  mintNFT(recipient: string, tokenURI: string): Promise<ethers.providers.TransactionResponse>;
}

// Set the contract address
const contractAddress: string = "0x1a1f4596Fc3fb203952bb576d3045FbEDFF0263b";

// Connect to the contract
export const getContract = async (): Promise<MyNFTContract> => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed!");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, MyNFT.abi, signer) as MyNFTContract;
  return contract;
};

// Mint an NFT
export const mintNFT = async (recipient: string, tokenURI: string): Promise<void> => {
  const contract = await getContract();
  const tx = await contract.mintNFT(recipient, tokenURI);
  await tx.wait(); // Wait for the transaction to be mined
  console.log("NFT Minted:", tx);
};
