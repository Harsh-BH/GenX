"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import NFTCard from "@/components/NFTCard/card";
import axios from "axios";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import Loader from "@/components/Loader";



const ExploreNFTs = () => {
  const [showLoader, setShowLoader] = useState(true);

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

  ]);

  const [page, setPage] = useState(1)

  const fetchNFTs = async() => {
    const response = await axios.get("/api/getNfts")

  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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


  return (
    <>
      {showLoader ? (
        <Loader />
      ) : (
        <>
          <div className="min-h-screen ">
            <Navbar />
            {/* NFT Grid */}
            <main className="mx-auto px-4 mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {nfts.map((nft) => (
                <NFTCard imageUrl={nft.imageUrl} title={nft.title} price={nft.price} />
              ))}
            </main>

            {/* Pagination */}
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                  <PaginationLink href="#">2</PaginationLink>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

          </div>
        </>
      )}
      </>
  );
};

export default ExploreNFTs;
