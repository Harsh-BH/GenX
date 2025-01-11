"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { mintNFT } from "@/components/web3/nft";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast, ToastAction } from "@/hooks/use-toast"
import { Navbar } from '@/components/Navbar';
import Loader from '@/components/Loader';
import axios from 'axios';

// ------- Helper Functions -------
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const generateImageAPI = async (description: string): Promise<string> => {
  const response = await fetch("http://localhost:8000/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: description }),
  });
  if (!response.ok) {
    throw new Error("Failed to generate image.");
  }
  const data = await response.json();
  return `http://localhost:8000${data.image_path}`;
};

const applyFilterAPI = async (
  generatedImageUrl: string,
  filter: string
): Promise<string> => {
  const response = await fetch("http://localhost:8000/apply-filter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: generatedImageUrl, filter }),
  });
  if (!response.ok) {
    throw new Error("Failed to apply filter.");
  }
  const data = await response.json();
  return data.filtered_image_url; // new image URL after filter
};

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

const uploadToPinata = async (fileData: string): Promise<string> => {
  const response = await fetch("/api/uploadImage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileData }),
  });
  if (!response.ok) {
    throw new Error("Failed to upload image to Pinata.");
  }
  const data = await response.json();
  return data.ipfsUrl;
};

// ------- Main Component -------
const MintNFT: React.FC = () => {
  // Form states
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");

  // Image states
  const [image, setImage] = useState<File | null>(null); // local file
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // We’ll store *all versions* of the image (original + filters) in an array
  // Each entry: { filter: string; url: string }
  // Then user can pick which to display as main preview
  const [imagePreviews, setImagePreviews] = useState<{ filter: string; url: string }[]>([]);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string>(""); // main NFT preview

  // States controlling upload, generate, filter, mint
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isApplyingFilter, setIsApplyingFilter] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);

  // Misc states
  const [tokenURI, setTokenURI] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [showLoader, setShowLoader] = useState(true);

  // Filter selection
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const allowedFilters = [
    "sharpen",
    "blur",
    "contour",
    "detail",
    "edge_enhance",
    "emboss",
    "smooth",
    "enhance_resolution",
  ];

  // Toast notifications
  const { toast } = useToast();

  // Fake loader for initial screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Sparkle effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const sparkle = document.createElement("div");
      sparkle.className = `
        pointer-events-none
        absolute
        rounded-full
        opacity-800
        animate-pulse
        transition-all
        duration-500
        ease-out
      `;
      const colors = ["bg-pink-500", "bg-yellow-400", "bg-blue-400", "bg-purple-500", "bg-red-400"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      sparkle.classList.add(randomColor);

      const size = Math.floor(Math.random() * 10) + 10;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.left = `${e.pageX}px`;
      sparkle.style.top = `${e.pageY}px`;
      sparkle.style.zIndex = "9999";
      sparkle.style.transform = "translate(-50%, -50%)";

      document.body.appendChild(sparkle);
      setTimeout(() => {
        sparkle.style.opacity = "0";
        setTimeout(() => sparkle.remove(), 500);
      }, 300);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // -------------------------------------------
  // 1. Handle local file upload (user's own image)
  // -------------------------------------------
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    const selectedFile = event.target.files[0];
    setImage(selectedFile);

    try {
      setIsUploading(true);
      setStatus("Uploading image...");

      // Convert file to base64 and upload to Pinata
      const base64Data = await fileToBase64(selectedFile);
      const pinataUrl = await uploadToPinata(base64Data);
      setTokenURI(pinataUrl);

      // Also display as an "original" preview
      setSelectedPreviewUrl(pinataUrl);
      setImagePreviews([{ filter: "original", url: pinataUrl }]);

      setStatus(`Image uploaded successfully! Token URI: ${pinataUrl}`);
      toast({ title: "Image Uploaded", description: "Your own image is uploaded to IPFS" });
    } catch (error) {
      setStatus("Failed to upload image!");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // -------------------------------------------
  // 2. Handle generating an image from the prompt
  // -------------------------------------------
  const handleGenerateImage = async () => {
    if (!description) {
      return alert("Please enter a description to generate an image.");
    }
    try {
      setIsGenerating(true);
      setStatus("Generating image...");
      const imageUrl = await generateImageAPI(description);
      setGeneratedImageUrl(imageUrl);
      setStatus("Image generated successfully.");

      // Optionally upload the freshly generated image to IPFS
      setIsUploading(true);
      setStatus("Uploading generated image to IPFS...");
      const base64Data = await getImageAsBase64(imageUrl);
      const pinataUrl = await uploadToPinata(base64Data);
      setTokenURI(pinataUrl);

      setStatus("Image generated and uploaded to IPFS successfully!");

      // Clear old previews, set "original" preview with your AI-generated image
      const newPreviews = [{ filter: "original", url: pinataUrl }];
      setImagePreviews(newPreviews);
      setSelectedPreviewUrl(pinataUrl);

    } catch (error) {
      console.error(error);
      setStatus("Failed to generate and upload image!");
    } finally {
      setIsGenerating(false);
      setIsUploading(false);
    }
  };

  // -------------------------------------------
  // 3. Handle applying a filter
  // -------------------------------------------
  const handleApplyFilter = async () => {
    if (!generatedImageUrl || !selectedFilter) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "No generated image or filter found.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }
    if (!allowedFilters.includes(selectedFilter)) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Invalid Filter selected.",
      });
      return;
    }

    try {
      setIsApplyingFilter(true);
      setStatus("Applying filter...");

      const filteredUrl = await applyFilterAPI(generatedImageUrl, selectedFilter);
      setStatus("Filter applied successfully!");

      // Convert new filtered image to IPFS link
      setIsUploading(true);
      setStatus("Uploading filtered image to IPFS...");
      const base64Data = await getImageAsBase64(filteredUrl);
      const pinataUrl = await uploadToPinata(base64Data);

      // Add the new filtered version to our previews
      setImagePreviews((prev) => [
        ...prev,
        { filter: selectedFilter, url: pinataUrl },
      ]);

      // Optionally set the new filtered as main
      setSelectedPreviewUrl(pinataUrl);
      setTokenURI(pinataUrl);

      toast({
        title: "Success!",
        description: "Filter applied and uploaded to IPFS successfully!",
      });
    } catch (error: unknown) {
      console.error(error);
      setStatus("Failed to apply filter or upload!");
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsApplyingFilter(false);
      setIsUploading(false);
    }
  };

  // -------------------------------------------
  // 4. Handle NFT Minting
  // -------------------------------------------
  const handleMint = async () => {
    if (!window.ethereum) {
      return alert("Please install MetaMask to interact with this page.");
    }
    if (!tokenURI) {
      return alert("Please upload or generate an image first!");
    }
    if (!recipient) {
      return alert("Please enter a recipient address!");
    }
    try {
      setIsMinting(true);
      setStatus("Connecting to wallet...");

      // Request account access
      await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      setStatus("Starting minting process...");

      // Example: call your /api/mintNft route
      const res = await fetch("/api/mintNft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          description: description,
          tokenURI: tokenURI,
          recipientAddress: recipient,
        })
      });
      const data = await res.json();
      console.log("MintNft Endpoint response:", data);

      // Or optionally call a local contract method
      await mintNFT(recipient, tokenURI);

      setStatus("NFT Minted Successfully! 🎉");
      toast({ title: "Success!", description: "Your NFT has been minted!", duration: 5000 });
    } catch (error: any) {
      console.error("Error minting NFT:", error);
      let errorMessage = "Failed to mint NFT";
      if (error.code === 4001) {
        errorMessage = "Transaction was rejected by user";
      } else if (error.code === -32603) {
        errorMessage = "Internal JSON-RPC error. Insufficient funds or gas?";
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

  // -------------------------------------------
  // 5. Render
  // -------------------------------------------
  return (
    <>
      {showLoader ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <div className="relative min-h-screen flex flex-col custom-gradient-bg font-poppins text-white">
            {/* Page Title */}
            <h1 className="text-6xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-fade-in custom-font">
              Mint Your NFT
            </h1>

            {/* Container */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 w-full p-4">
              {/* Form Section (Left) */}
              <div className="glass max-w-lg p-8 rounded-lg shadow-md w-full md:w-1/2 animate-slide-in">
                {/* NFT Name */}
                <div className="mb-6">
                  <label
                    htmlFor="name"
                    className="block text-lg font-semibold mb-2 text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter NFT name"
                    className="w-full p-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white placeholder:text-gray-300 shadow-lg backdrop-blur-lg hover:border-white/50 transition-all duration-300 ease-in-out"
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-lg font-semibold mb-2 text-white"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter NFT description"
                    className="w-full p-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white placeholder:text-gray-300 shadow-lg backdrop-blur-lg hover:border-white/50 transition-all duration-300 ease-in-out"
                  />
                </div>

                {/* Generate Image */}
                <button
                  onClick={handleGenerateImage}
                  disabled={isGenerating || !description}
                  className={`w-full p-3 rounded-lg font-semibold mb-6 transition duration-300 ${
                    isGenerating
                      ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {isGenerating ? "Generating..." : "Generate Image"}
                </button>

                {/* Upload Your Own Image */}
                <div className="mb-6">
                  <label
                    htmlFor="picture"
                    className="block text-lg font-semibold mb-2 text-white"
                  >
                    Upload Image
                  </label>
                  <input
                    type="file"
                    id="picture"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="w-full p-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white placeholder:text-gray-300 shadow-lg backdrop-blur-lg hover:border-white/50 transition-all duration-300 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Filter Selection (Only if we have a generated image) */}
                {generatedImageUrl && (
                  <div className="mb-6">
                    <label
                      htmlFor="filter"
                      className="block text-lg font-semibold mb-2 text-white"
                    >
                      Apply Filter
                    </label>
                    <select
                      id="filter"
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder:text-gray-300 shadow-lg"
                    >
                      <option value="">Select Filter</option>
                      <option value="enhance_resolution">Enhance Resolution</option>
                      <option value="sharpen">Sharpen</option>
                      <option value="blur">Blur</option>
                      <option value="contour">Contour</option>
                      <option value="detail">Detail</option>
                      <option value="edge_enhance">Edge Enhance</option>
                      <option value="emboss">Emboss</option>
                      <option value="smooth">Smooth</option>
                    </select>

                    <button
                      onClick={handleApplyFilter}
                      disabled={isApplyingFilter}
                      className={`mt-4 w-full p-3 rounded-lg font-semibold transition duration-300 ${
                        isApplyingFilter
                          ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-700"
                      }`}
                    >
                      {isApplyingFilter ? "Applying Filter..." : "Apply Filter"}
                    </button>
                  </div>
                )}

                {/* Recipient Address */}
                <div className="mb-6">
                  <label
                    htmlFor="recipient"
                    className="block text-lg font-semibold mb-2 text-white"
                  >
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter recipient address"
                    className="w-full p-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white placeholder:text-gray-300 shadow-lg backdrop-blur-lg hover:border-white/50 transition-all duration-300 ease-in-out"
                  />
                </div>

                {/* Token URI */}
                <div className="mb-6">
                  <label
                    htmlFor="tokenURI"
                    className="block text-lg font-semibold mb-2 text-white"
                  >
                    Token URI
                  </label>
                  <input
                    type="text"
                    id="tokenURI"
                    value={tokenURI}
                    readOnly
                    placeholder="Generated Token URI (e.g., IPFS link)"
                    className="w-full p-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white placeholder:text-gray-300 shadow-lg backdrop-blur-lg hover:border-white/50 transition-all duration-300 ease-in-out"
                  />
                  {tokenURI && (
                    <p className="text-sm text-blue-600 mt-1">
                      ✓ Token URI successfully generated
                    </p>
                  )}
                </div>

                {/* Mint NFT Button */}
                <button
                  onClick={handleMint}
                  disabled={isMinting || isUploading || isGenerating}
                  className={`w-full p-3 rounded-lg font-semibold transition duration-300 ${
                    isMinting || isUploading || isGenerating
                      ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {isMinting ? "Minting..." : "Mint NFT"}
                </button>

                {/* Status Message */}
                {status && (
                  <p className="mt-4 text-center text-lg text-white">{status}</p>
                )}
              </div>

              {/* Right Column: Previews */}
              <div className="w-full md:w-1/2 flex flex-col items-center p-6 space-y-6">
                {/* MAIN PREVIEW */}
                <div className="text-center">
                  {isGenerating || isUploading || isApplyingFilter ? (
                    // Loading State for the big preview
                    <div
                      className="
                        w-[400px]
                        h-[400px]
                        bg-gray-600
                        rounded-xl
                        relative
                        overflow-hidden
                        border-4
                        border-gray-400
                        shadow-lg
                        animate-pulse
                      "
                    />
                  ) : selectedPreviewUrl ? (
                    <img
                      src={selectedPreviewUrl}
                      alt="Selected NFT"
                      className="w-[400px] h-[400px] object-cover rounded-lg shadow-lg animate-fade-in"
                    />
                  ) : (
                    <div className="text-gray-400">No image selected yet.</div>
                  )}
                </div>

                {/* GALLERY of ALL PREVIEWS */}
                {imagePreviews.length > 0 && (
                  <div className="w-full flex flex-wrap gap-4 justify-center">
                    {imagePreviews.map(({ filter, url }, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <img
                          src={url}
                          alt={`Preview-${filter}`}
                          className="w-24 h-24 object-cover rounded-lg shadow cursor-pointer hover:scale-105 transition-all"
                          onClick={() => {
                            setSelectedPreviewUrl(url);
                            setTokenURI(url); // So user chooses it as the final minted image
                          }}
                        />
                        <span className="text-sm mt-2">{filter}</span>
                        <button
                          className="mt-1 text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-700"
                          onClick={() => {
                            setSelectedPreviewUrl(url);
                            setTokenURI(url);
                          }}
                        >
                          Use as Main
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MintNFT;
