"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import NFTCard from "@/components/NFTCard/card";
import axios from "axios";

const ExploreNFTs = () => {
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

  return (
    <div className="min-h-screen ">
      <Navbar/>


      {/* NFT Grid */}
      <main className="mx-auto px-4 mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <NFTCard imageUrl={nft.imageUrl} title={nft.title} price={nft.price}/>
        ))}
      </main>

      {/* Pagination */}
      <div className="max-w-7xl mx-auto px-4 mt-6 flex justify-center">
        <Button className="mx-2" onClick={() => setPage((prev) => prev-1)}>Previous</Button>
        <Button className="mx-2" onClick={() => setPage((prev) => prev+1)}>Next</Button>
      </div>
    </div>
  );
};

export default ExploreNFTs;
