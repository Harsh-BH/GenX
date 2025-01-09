"use client"
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Features } from "@/components/sections/features";
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link";
import Loader from "@/components/Loader";




export default function Home() {
  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
    // Hide the loader after 2 seconds
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2500);

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, []);
  const featuredNFTs = [
    {
      imageUrl: "https://img.freepik.com/free-photo/abstract-textured-backgound_1258-30633.jpg",
      title: "Cosmic Dreams #001",
      recipientAddress: "0.85"
    },
    {
      imageUrl: "https://img.freepik.com/free-photo/abstract-textured-backgound_1258-30633.jpg",
      title: "Cosmic Dreams #001",
      recipientAddress: "0.85"
    },
    {
      imageUrl: "https://img.freepik.com/free-photo/abstract-textured-backgound_1258-30633.jpg",
      title: "Cosmic Dreams #001",
      recipientAddress: "0.85"
    },
    {
      imageUrl: "https://img.freepik.com/free-photo/abstract-textured-backgound_1258-30633.jpg",
      title: "Cosmic Dreams #001",
      recipientAddress: "0.85"
    },
    {
      imageUrl: "https://img.freepik.com/free-photo/abstract-textured-backgound_1258-30633.jpg",
      title: "Cosmic Dreams #001",
      recipientAddress: "0.85"
    },
    {
      imageUrl: "https://img.freepik.com/free-photo/abstract-textured-backgound_1258-30633.jpg",
      title: "Cosmic Dreams #001",
      recipientAddress: "0.85"
    },


  ];

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
          <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">

            <Navbar />

            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    AI-Generated NFT Marketplace
                  </h1>
                  <p className="text-xl text-muted-foreground mb-8">
                    Create unique, AI-generated artwork and mint it as NFTs instantly
                  </p>
                  <Link href={"/generate"} className="bg-gradient-to-r rounded-lg px-3 py-4 text-xl font-semibold from-purple-600 to-pink-600 hover:text-white hover:scale-105 hover:translate-y-[-5px] hover:border-[2px] hover:border-white hover:shadow-lg hover:shadow-border transition-all">
                    Start Creating
                  </Link>
                </div>


                <div className="w-full flex justify-center items-center">
                  <Carousel
                    opts={{
                      align: "start",
                    }}
                    className="w-full max-w-2xl"
                  >
                    <CarouselContent>
                      {featuredNFTs.map((nft, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                          <div className="p-1">
                            <Card>
                              <CardContent className="flex flex-col items-center justify-center p-4">
                                <img className="rounded-lg w-40 h-40" src={nft.imageUrl} />
                                <span className="text-md font-semibold mt-2">{nft.title}</span>
                                <span className="text-xs">{nft.recipientAddress} ETH</span>
                                <Button className=" font-semibold w-full mt-3">Check Out</Button>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>

                </div>
              </div>

            </section>

            {/* Features Section */}
            <Features />

          </div>
        </>
      )}
          </>
  );
}
