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

const chartData = [
  { month: "January", revenue: 1500 },
  { month: "February", revenue: 2400 },
  { month: "March", revenue: 1800 },
  { month: "April", revenue: 3000 },
  { month: "May", revenue: 2200 },
  { month: "June", revenue: 2700 },
];

// Chart configuration for revenue
const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(340, 80%, 60%)",
  },
} satisfies ChartConfig;

const Dashboard = () => {
  const { address } = useAccount(); // Fetch connected wallet address from RainbowKit
  const { data: balance, isError, isLoading } = useBalance({
    address: address, // Use the connected wallet address
  });
  const [profileViews, setProfileViews] = useState(0); // Initial profile views count
  const [nftCount, setNftCount] = useState(0); // State for total NFTs owned
  const [loadingNFTs, setLoadingNFTs] = useState(false); // Loading state for NFTs
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (address) {
      fetchUserNFTs(address);
    }
  }, [address]);

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
              <ScrollArea className="h-[65vh] w-[50%] bg-white bg-opacity-5 rounded-xl p-2">
                {/* Add logic to display individual NFTs if needed */}
              </ScrollArea>

              <Card className="w-[50%]">
                <CardHeader>
                  <CardTitle>Revenue Generated</CardTitle>
                  <CardDescription>
                    Total revenue generated in the last 6 months
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
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                      <Area
                        dataKey="revenue"
                        type="natural"
                        fill="hsl(260, 80%, 70%)"
                        fillOpacity={0.3}
                        stroke="hsl(260, 80%, 70%)"
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
