import { ethers, Contract, Signer } from "ethers";
import MyNFT from "../../../genx-web3/artifacts/contracts/MyNFT.sol/MyNFT.json"; // Adjust the path

// Define types for the contract
interface MyNFTContract extends Contract {
  mintNFT(recipient: string, tokenURI: string): Promise<any>;
}

// Extend the global window object to include `ethereum` for TypeScript compatibility
declare global {
  interface Window {
    ethereum: any;
  }
}

// Constants
const CHAIN_ID = 80002;
const CHAIN_ID_HEX = '0x138a2'; // 80002 in hex
const RPC_URL = "https://polygon-amoy.drpc.org";
const contractAddress: string = "0x1a1f4596Fc3fb203952bb576d3045FbEDFF0263b";

// Connect to the contract
export const getContract = async (): Promise<MyNFTContract> => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed!");
  }

  // Create a provider using Web3Provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // Ensure we're connected to Amoy testnet
  const network = await provider.getNetwork();
  console.log(network);
  if (network.chainId !== CHAIN_ID) {
    throw new Error("Please connect to Polygon Amoy Testnet");
  }

  const signer: Signer = provider.getSigner();
  const contract = new Contract(
    contractAddress,
    MyNFT.abi,
    signer
  ) as MyNFTContract;

  return contract;
};




// Mint an NFT
export const mintNFT = async (recipient: string, tokenURI: string): Promise<void> => {
  try {
    // Validate the recipient address
    if (!ethers.utils.isAddress(recipient)) {
      throw new Error("Invalid recipient address");
    }

    const contract = await getContract();
    const tx = await contract.mintNFT(recipient, tokenURI);
    console.log("Transaction hash:", tx.hash);
    await tx.wait(); // Wait for the transaction to be mined
    console.log("NFT Minted Successfully!");
  } catch (error) {
    console.error("Error minting NFT:", error);
    throw error;
  }
};


