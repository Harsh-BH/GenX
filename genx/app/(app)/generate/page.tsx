"use client"
import { ethers } from 'ethers';
import { useState } from "react";
import { mintNFT } from "@/components/web3/nft";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast"


const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};



const generateImage = async (description: string): Promise<string> => {
  try {
    const response = await fetch("http://localhost:8000/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: description }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate image.");
    }

    const data = await response.json();

    return data.image_path;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Error generating image");
  }
};

// Function to fetch and convert image to base64
const getImageAsBase64 = async (imageUrl: string): Promise<string> => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const MintNFT: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [tokenURI, setTokenURI] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const { toast } = useToast()

  const uploadToPinata = async (fileData: string): Promise<string> => {
    try {
      const response = await fetch("/api/uploadImage", {
        method: "POST",
        body: JSON.stringify({ fileData }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload image to Pinata.");
      }

      const data = await response.json();
      setTokenURI(data.ipfsUrl);
      setStatus(`Upload successful! Token URI: ${data.ipfsUrl}`);
      toast({
        title: "Image Generated",
        description: "Friday, February 10, 2023 at 5:57 PM",
      })


      return data.ipfsUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Error uploading to Pinata");
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setImage(selectedFile);

      try {
        setIsUploading(true);
        setStatus("Uploading image...");
        const base64Data = await fileToBase64(selectedFile);
        const generatedTokenURI = await uploadToPinata(base64Data);
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

  const handleGenerateImage = async () => {
    if (!description) {
      alert("Please enter a description to generate an image.");
      return;
    }

    try {
      // Generate image
      setIsGenerating(true);
      setStatus("Generating image...");
      const generatedImagePath = await generateImage(description);
      const fullImageUrl = `http://localhost:8000${generatedImagePath}`;
      setGeneratedImageUrl(fullImageUrl);

      // Convert generated image to base64 and upload to Pinata
      setIsUploading(true);
      setStatus("Uploading generated image to IPFS...");
      const base64Data = await getImageAsBase64(fullImageUrl);
      const generatedTokenURI = await uploadToPinata(base64Data);
      setTokenURI(generatedTokenURI);
      setStatus("Image generated and uploaded successfully! Ready to mint.");

    } catch (error) {
      console.error("Error in generate and upload process:", error);
      setStatus("Failed to generate and upload image!");
    } finally {
      setIsGenerating(false);
      setIsUploading(false);
    }
  };



  const handleMint = async (): Promise<void> => {
    if (!window.ethereum) {
      alert("Please install MetaMask to interact with this page.");
      return;
    }

    if (!tokenURI) {
      alert("Please upload or generate an image first!");
      return;
    }

    if (!recipient) {
      alert("Please enter a recipient address!");
      return;
    }

    try {
      setIsMinting(true);
      setStatus("Connecting to wallet...");

      // Request account access
      await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      setStatus("Starting minting process...");

      // Call the mintNFT function from your imported contract
      await mintNFT(recipient, tokenURI);

      // Update UI state
      setStatus("NFT Minted Successfully! 🎉");
      toast({
        title: "Success!",
        description: "Your NFT has been minted successfully",
        duration: 5000,
      });

      // Optional: Clear form or reset states
      setDescription("");
      setGeneratedImageUrl(null);

    } catch (error: any) {
      console.error("Error minting NFT:", error);

      // Handle different types of errors
      let errorMessage = "Failed to mint NFT";

      if (error.code === 4001) {
        errorMessage = "Transaction was rejected by user";
      } else if (error.code === -32603) {
        errorMessage = "Internal JSON-RPC error. Please check your wallet has sufficient funds.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setStatus(`Minting failed: ${errorMessage}`);
      toast({
        title: "Minting Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsMinting(false);
    }
  };



  return (
    <div className="flex justify-center items-start gap-12">
      {/* Form Container */}
      <div className="flex justify-center items-center space-x-6 w-full">
        {/* Form Section */}
        <div className="max-w-lg p-6 rounded-lg shadow-md w-1/2">
          <h1 className="text-2xl font-bold text-center mb-6">Mint Your NFT</h1>

          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg font-semibold text-gray-700">
              Name
            </label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter NFT name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Description Field */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-lg font-semibold text-gray-700">
              Description
            </label>
            <Input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter NFT description"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Generate Image Button */}
          <Button
            onClick={handleGenerateImage}
            disabled={isGenerating || !description}
            className="w-full p-3 rounded-lg font-semibold mb-4"
          >
            {isGenerating ? "Generating..." : "Generate Image"}
          </Button>

          {/* Upload Image */}
          <div className="mb-4">
            <label htmlFor="tokenURI" className="block text-lg font-semibold text-gray-700">
              Upload Image
            </label>
            <Input
              type="file"
              id="picture"
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
            <Input
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
            <Input
              type="text"
              id="tokenURI"
              value={tokenURI}
              readOnly
              placeholder="Generated Token URI (e.g., IPFS link)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
             {tokenURI && (
              <p className="text-sm text-green-600 mt-1">✓ Token URI successfully generated</p>
            )}
          </div>

          {/* Mint Button */}
          <Button
            onClick={handleMint}
            disabled={isMinting || isUploading || isGenerating}
            className="w-full p-3 rounded-lg font-semibold"
          >
            {isMinting ? "Minting..." : isUploading ? "Uploading..." : "Mint NFT"}
          </Button>
        </div>

        {/* Generated Image Section */}
        <div className="w-1/2 flex justify-center items-center p-6">
          <div className="text-center">
            {isGenerating || isUploading ? (
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[400px] w-[400px] rounded-xl" />
              </div>
            ) : (
              generatedImageUrl && (
                <img
                  src={generatedImageUrl}
                  alt="Generated NFT"
                  className="w-128 h-96 object-cover rounded-lg shadow-lg"
                />
              )
            )}

            {/* Status Message */}
            {status && <p className="text-center text-lg text-gray-700 mt-4">{status}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintNFT;