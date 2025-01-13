"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpLeftFromSquareIcon, BarChart as ChartIcon, DollarSign } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Link from "next/link";
import { useAccount, useBalance } from "wagmi";
import { Navbar } from "@/components/Navbar";
import { fetchNFTs } from "../../api/fetchNFTs";
import Loader from "@/components/Loader";
import { format } from "date-fns";

// const chartData = [
//   { month: "January", revenue: 1500 },
//   { month: "February", revenue: 2400 },
//   { month: "March", revenue: 1800 },
//   { month: "April", revenue: 3000 },
//   { month: "May", revenue: 2200 },
//   { month: "June", revenue: 2700 },
// ];

// // Chart configuration for revenue
// const chartConfig = {
//   revenue: {
//     label: "Revenue",
//     color: "hsl(340, 80%, 60%)",
//   },
// } satisfies ChartConfig;

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const { address } = useAccount(); // Fetch connected wallet address from RainbowKit
  const { data: balance, isError, isLoading } = useBalance({
    address: address, // Use the connected wallet address
  });
  const [profileViews, setProfileViews] = useState(0); // Initial profile views count
  const [nftCount, setNftCount] = useState(0); // State for total NFTs owned
  const [loadingNFTs, setLoadingNFTs] = useState(false); // Loading state for NFTs
  const [showLoader, setShowLoader] = useState(true);
  const [myNfts, setMyNfts] = useState([])
  const [graphNfts, setGraphNfts] = useState([])

  function formatTimestamp(timestamp : any) {
    const date = new Date(timestamp);
  
    // Extract day, month, and year
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
  
    // Determine the ordinal suffix for the day
    const suffix = (day : any) => {
      if (day % 10 === 1 && day !== 11) return 'st';
      if (day % 10 === 2 && day !== 12) return 'nd';
      if (day % 10 === 3 && day !== 13) return 'rd';
      return 'th';
    };
  
    return `${day}${suffix(day)} ${month} ${year}`;
  }
   


  useEffect(() => {
    if (address) {
      fetchUserNFTs(address);
      getMyNfts()
    }
  }, []);

  const fetchUserNFTs = async (wallet: string) => {
    setLoadingNFTs(true);
    try {
      const response = await fetchNFTs(wallet); // Fetch NFTs using QuickNode API
      if (response.success) {
        setNftCount(response.data.totalItems); // Update total NFT count
      } else {
        console.error("Error fetching NFTs:", response.error);
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setLoadingNFTs(false);
    }
  };

  const getMyNfts = async () => {
    const response = await fetch("/api/getMyNfts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress: address }),
    });
  
    const res = await response.json();
    console.log(res);
  
    if (res.success) {
      const modifiedNfts = res.data.map((nft) => ({
        ...nft,
        createdAt: formatTimestamp(nft.createdAt),
      }));
      setMyNfts(modifiedNfts);
      setGraphNfts(res.data)
    } else {
      setMyNfts(res.message);
    }
  };

  const incrementProfileViews = async () => {
    try {
      console.log(`Incrementing profile views for wallet: ${address}`);
      setProfileViews((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to increment profile views:", error);
    }
  };

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (myNfts.length > 0) {
      const months = Array(12).fill(0); // Initialize counts for all 12 months
  
      graphNfts.forEach((nft : any) => {
        if (nft.createdAt) {
          const date = new Date(nft.createdAt); // Parse createdAt to a Date object
          const month = date.getMonth(); // Get the month (0 = January, 11 = December)
          months[month]++; // Increment count for the corresponding month
        }
      });
  
      const updatedChartData = months.map((count, index) => ({
        month: format(new Date(2023, index, 1), "MMMM"), // Format month name
        count, // NFTs minted in this month
      }));
  
      setChartData(updatedChartData);
    }
  }, [graphNfts]);
  

  const chartConfig = {
    mintedNFTs: {
      label: "NFTs Minted",
      color: "hsl(200, 80%, 60%)",
    },
  };

  return (
    <>

      {showLoader ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <div className="p-3 grid">
            <div className="w-full h-[30vh] border flex p-4 bg-white bg-opacity-5 rounded-xl gap-4 justify-between">
              <div className="flex gap-4">
                <Link
                  href={"/"}
                  className="flex absolute left-5 top-5 text-xl hover:underline font-semibold"
                >
                  <ArrowUpLeftFromSquareIcon />
                </Link>
                <div className="h-full flex items-center">
                  <img
                    className="max-h-full h-[80%] rounded-full border-2 border-pink-600"
                    src="https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg"
                  />
                </div>

                <div className="flex flex-col text-md gap-3 mt-8">
                  <p>
                    <span className="font-semibold">Wallet Address:</span>{" "}
                    {address || "Not Connected"}
                  </p>
                  <p>
                    <span className="font-semibold">TotalNFTs Minted:</span> {loadingNFTs ? "Loading..." : `${nftCount} `}
                  </p>
                  <p>
                    <span className="font-semibold">Profile Views:</span> {profileViews}
                  </p>
                </div>
              </div>

              <div className="flex h-full gap-4 w-[50%]">
                <Card className="w-[50%] bg-white bg-opacity-5 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      Wallet Balance
                      <DollarSign />
                    </CardTitle>
                    <CardDescription>User wallet balance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      {isLoading
                        ? "Loading..."
                        : isError
                          ? "Error fetching balance"
                          : `${balance?.formatted} ${balance?.symbol}`}
                    </p>
                  </CardContent>
                </Card>

                <Card className="w-[50%] bg-white bg-opacity-5 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      NFTs Owned
                      <ChartIcon />
                    </CardTitle>
                    <CardDescription>Total NFTs owned</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      {loadingNFTs ? "Loading..." : `${nftCount} NFTs`}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex mt-2 gap-2">
              <ScrollArea className="h-[65vh] w-[50%] bg-white bg-opacity-5 p-2 rounded-xl border">
                <div className="text-white font-bold">NFTS Minted:</div>
              {
                myNfts?.map((nft : any) => (
                  <div className="w-full h-20 bg-white/10 mt-1 rounded-xl p-2 flex">
                    <div className="flex gap-2 flex-grow">
                      <img className="h-full w-16 bg-white rounded-sm" src={nft.tokenURI}/>
                      <div className="font-semibold text-md flex flex-col h-full gap-1">
                        <div className="flex gap-1">Name: <div className="font-normal">{nft.name}</div></div>
                        <div className="gap-1 flex">Minted at: <div className="font-normal">{nft.createdAt}</div></div>
                      </div>
                    </div>
                  </div>
                ))
              }
              </ScrollArea>

              <Card className="w-[50%]">
                <CardHeader>
                  <CardTitle>NFTs Minted</CardTitle>
                  <CardDescription>
                    NFTs minted throughout the year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <AreaChart
                      accessibilityLayer
                      data={chartData}
                      margin={{
                        top: 20,
                        left: 12,
                        right: 12,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                      <Area
                        dataKey="count"
                        type="natural"
                        fill="hsl(200, 80%, 60%)"
                        fillOpacity={0.3}
                        stroke="hsl(200, 80%, 60%)"
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
