"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { ArrowUpLeftFromSquareIcon, BarChart as ChartIcon, DollarSign } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Link from "next/link";

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
      color: "hsl(340, 80%, 60%)"
    },
  } satisfies ChartConfig;

const Dashboard = () => {

    const [nfts, setNfts] = useState([
        {
            id: 1,
            imageUrl: "https://via.placeholder.com/300",
            title: "Cosmic Dreams #001",
            price: "0.85 ETH",
        },
        {
            id: 2,
            imageUrl: "https://via.placeholder.com/300",
            title: "Ethereal Visions #024",
            price: "1.2 ETH",
        },
        {
            id: 3,
            imageUrl: "https://via.placeholder.com/300",
            title: "Neon Vibes #101",
            price: "0.5 ETH",
        },
        {
            id: 4,
            imageUrl: "https://via.placeholder.com/300",
            title: "Neon Vibes #101",
            price: "0.5 ETH",
        },
        {
            id: 5,
            imageUrl: "https://via.placeholder.com/300",
            title: "Neon Vibes #101",
            price: "0.5 ETH",
        },
        {
            id: 6,
            imageUrl: "https://via.placeholder.com/300",
            title: "Neon Vibes #101",
            price: "0.5 ETH",
        },

        
      ]);

    
    return ( 
        
        <div className="p-3 grid">
            <div className="w-full h-[30vh] border flex  p-4 bg-white bg-opacity-5 rounded-xl gap-4 justify-between">
                <div className="flex gap-4">
                        <Link href={"/"} className="flex absolute left-5 top-5 text-xl hover:underline font-semibold">
                            <ArrowUpLeftFromSquareIcon/>
                        </Link>
                    <div className="h-full flex items-center">
                        
                        <img className="max-h-full h-[80%] rounded-full border-2 border-pink-600" 
                        src="https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg"/>
                    </div>
                    
                    <div className="flex flex-col text-md gap-3 mt-8">
                        <p>
                            <span className="font-semibold">Wallet Address:</span>   0x1234567890abcdef1234567890abcdef</p>
                        <p>    
                            <span className="font-semibold">TotalNFTs Minted:</span> 10
                        </p>
                        <p>    
                            <span className="font-semibold">Profile Views:</span> 202
                        </p>
                    </div>
                </div>

                <div className="flex h-full gap-4 w-[50%]">
                        
                        <Card className="w-[50%] bg-white bg-opacity-5 shadow-md">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">Wallet Balance
                                    <DollarSign/>
                                </CardTitle>
                                <CardDescription>User wallet balance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>1000 ETH</p>
                                
                            </CardContent>
                        </Card>

                        
                        <Card className="w-[50%] bg-white bg-opacity-5 shadow-md">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">NFTs Owned
                                    <ChartIcon/>
                                </CardTitle>
                                <CardDescription>User wallet balance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>6</p>
                            </CardContent>
                        </Card>
                </div>
            </div>
            <div className="flex mt-2 gap-2">
                
                <ScrollArea className="h-[65vh] w-[50%] bg-white bg-opacity-5 rounded-xl p-2">
                    {
                        nfts.map((nft) => (
                            <Card className="flex mb-2 bg-white bg-opacity-10 shadow-lg">
                                <div className="flex h-[100px] p-4 gap-4">
                                    <img src={nft.imageUrl}
                                            className="max-w-full rounded-md"
                                    />
                                    <CardTitle className="flex flex-col mt-4">
                                        
                                        
                                        {nft.title}
                                        <CardDescription>{nft.price}</CardDescription>
                                        
                                    </CardTitle>
                                    
                                </div>
                                
                            </Card>
                        ))
                    }

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
    );
}
 
export default Dashboard;