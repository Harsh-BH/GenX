"use client"
import { ethers } from 'ethers';
import { useState ,useEffect} from "react";
import { mintNFT } from "@/components/web3/nft";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast"
import { Navbar } from '@/components/Navbar';
import Loader from '@/components/Loader';


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
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>
    (null);
    const [showLoader, setShowLoader] = useState(true);


  const { toast } = useToast()
  useEffect(() => {
    // Hide the loader after 2 seconds
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2500);

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, []);


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

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Create a small sparkle element
      const sparkle = document.createElement("div");

      // Customize appearance via Tailwind / inline style
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

      // Random color from an array
      const colors = ["bg-pink-500", "bg-yellow-400", "bg-blue-400", "bg-purple-500", "bg-blue-400", "bg-red-400"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      sparkle.classList.add(randomColor);

      // Random size between 5px and 15px
      const size = Math.floor(Math.random() * 10) + 10;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;

      // Position at mouse location
      sparkle.style.left = `${e.pageX}px`;
      sparkle.style.top = `${e.pageY}px`;
      sparkle.style.zIndex = 9999;
      sparkle.style.transform = "translate(-50%, -50%)";

      document.body.appendChild(sparkle);

      // Fade out and remove
      setTimeout(() => {
        sparkle.style.opacity = "0";
        setTimeout(() => sparkle.remove(), 500);
      }, 300);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);


  return (
<>
  {showLoader ? (
        <Loader />
      ) : (
        <>
    <Navbar/>
    <div
    className="
      relative
      min-h-screen
      flex
      flex-col
      custom-gradient-bg
      font-poppins
      text-white
    "
    >

   <h1
  className="
    text-6xl
    font-extrabold
    text-center
    mb-6
    text-transparent
    bg-clip-text
    bg-gradient-to-r
    from-blue-400
    via-purple-500
    to-pink-500
    animate-fade-in
    custom-font
  "
>
  Mint Your NFT
</h1>


    {/* Form Container */}
    <div className="flex flex-col md:flex-row justify-center items-center gap-12 w-full p-4">
      {/* Form Section */}
      {/* Added glass effect here */}
      <div className="glass max-w-lg p-8 rounded-lg shadow-md w-full md:w-1/2 animate-slide-in \">
        {/* Name Field */}
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
            className="
          w-full p-3 border border-white/20 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-blue-500
      bg-white/10 text-white placeholder:text-gray-300
      shadow-lg backdrop-blur-lg hover:border-white/50
      transition-all duration-300 ease-in-out cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
            "
          />
        </div>

        {/* Description Field */}
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
            className="
             w-full p-3 border border-white/20 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-blue-500
      bg-white/10 text-white placeholder:text-gray-300
      shadow-lg backdrop-blur-lg hover:border-white/50
      transition-all duration-300 ease-in-out cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
            "
          />
        </div>

        {/* Generate Image Button */}
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

        {/* Upload Image */}
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
    className="
      w-full p-3 border border-white/20 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-blue-500
      bg-white/10 text-white placeholder:text-gray-300
      shadow-lg backdrop-blur-lg hover:border-white/50
      transition-all duration-300 ease-in-out cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
    "
  />


        </div>

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
            className="
            w-full p-3 border border-white/20 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-blue-500
      bg-white/10 text-white placeholder:text-gray-300
      shadow-lg backdrop-blur-lg hover:border-white/50
      transition-all duration-300 ease-in-out cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
            "
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
            className="
             w-full p-3 border border-white/20 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-blue-500
      bg-white/10 text-white placeholder:text-gray-300
      shadow-lg backdrop-blur-lg hover:border-white/50
      transition-all duration-300 ease-in-out cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
            "
          />
          {tokenURI && (
            <p className="text-sm text-blue-600 mt-1">
              ✓ Token URI successfully generated
            </p>
          )}
        </div>

        {/* Mint Button */}
        <button
          onClick={handleMint}
          disabled={isMinting || isUploading || isGenerating}
          className={`w-full p-3 rounded-lg font-semibold transition duration-300 ${
            isMinting || isUploading || isGenerating
              ? "bg-gray-400 text-gray-800 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {isMinting
            ? "Minting..."
            : isUploading
            ? "Uploading..."
            : "Mint NFT"}
        </button>
      </div>

      {/* Generated Image Section */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <div className="text-center">
          {isGenerating || isUploading ? (
            <div className="flex flex-col space-y-3 animate-pulse">
              <div className="h-[400px] w-[400px] bg-gray-200 rounded-xl"></div>
            </div>
          ) : (
            generatedImageUrl && (
              <img
                src={generatedImageUrl}
                alt="Generated NFT"
                className="w-128 h-96 object-cover rounded-lg shadow-lg animate-fade-in"
              />
            )
          )}

          {/* Status Message */}
          {status && (
            <p className="text-center text-lg text-white mt-4">{status}</p>
          )}
        </div>
      </div>
    </div>
  </div>

    </>
      )}
      </>
  );
};

export default MintNFT;