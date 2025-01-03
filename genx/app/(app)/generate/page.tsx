"use client";

import { useState } from "react";
import { mintNFT } from "@/components/web3/nft";


const uploadToPinata = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/uploadImage", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image to Pinata.");
    }

    const data = await response.json();
    return data.tokenURI;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Error uploading to Pinata");
  }
};

const MintNFT: React.FC = () => {
  const [recipient, setRecipient] = useState<string>("");
  const [tokenURI, setTokenURI] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setImage(selectedFile);

      try {
        setIsUploading(true);
        setStatus("Uploading image...");
        const generatedTokenURI = await uploadToPinata(selectedFile);
        setTokenURI(generatedTokenURI);
        setStatus("Image uploaded successfully! Ready to mint.");
      } catch (error) {
        console.error("Error uploading image:", error);
        setStatus("Failed to upload image!");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleMint = async (): Promise<void> => {
    if (!window.ethereum) {
      alert("Please install MetaMask to interact with this page.");
      return;
    }

    if (!tokenURI) {
      alert("Please upload an image first!");
      return;
    }

    try {
      setIsMinting(true);
      setStatus("Minting in progress...");
      await mintNFT(recipient, tokenURI);
      setStatus("NFT Minted Successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      setStatus("Minting failed!");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Mint Your NFT</h1>

      {/* Upload Image */}
      <div className="mb-4">
        <label htmlFor="image" className="block text-lg font-semibold text-gray-700">
          Upload Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Recipient Address */}
      <div className="mb-4">
        <label htmlFor="recipient" className="block text-lg font-semibold text-gray-700">
          Recipient Address
        </label>
        <input
          type="text"
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter recipient address"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Token URI */}
      <div className="mb-4">
        <label htmlFor="tokenURI" className="block text-lg font-semibold text-gray-700">
          Token URI
        </label>
        <input
          type="text"
          id="tokenURI"
          value={tokenURI}
          readOnly
          placeholder="Generated Token URI (e.g., IPFS link)"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Mint Button */}
      <button
        onClick={handleMint}
        disabled={isMinting || isUploading || !tokenURI || !recipient}
        className="w-full p-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-green-300"
      >
        {isMinting ? "Minting..." : isUploading ? "Uploading..." : "Mint NFT"}
      </button>

      {/* Status Message */}
      {status && <p className="text-center text-lg text-gray-700 mt-4">{status}</p>}
    </div>
  );
};

export default MintNFT;