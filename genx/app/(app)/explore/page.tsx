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


interface NFT {
  name: string;
  tokenURI: string;
  description: string;
  recipientAddress: string;
}

const ExploreNFTs = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);

  const [page, setPage] = useState(1)

  const fetchNFTs = async(page : number) => {
    const response = await fetch("/api/getNfts",{
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        page: page,
        limit: 2
      })
    })

    const data = await response.json()

    console.log(data)

    return data
    
  }

  const setNFTS = async(page : number) => {
    const res = await fetchNFTs(page)
    const newNFTs = res.data.data
    setNfts(newNFTs)
  }

  useEffect(() => {
    setNFTS(page)
  },[page])

  return (
    <div className="min-h-screen ">
      <Navbar/>


      {/* NFT Grid */}
      {nfts ? <main className="mx-auto px-4 mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nfts?.map((nft, index) => (
          <NFTCard key={index} imageUrl={nft.tokenURI} title={nft.name} recipientAddress={nft.recipientAddress}/>
        ))}
      </main> : <p className="text-white">no nfts</p>}

      {/* Pagination */}
        <Pagination className="mt-4">
            <PaginationContent>
                <PaginationItem>
                <PaginationPrevious href="#" onClick={() => {
                  setPage((prev) => prev-1)
                }}/>
                </PaginationItem>
                <PaginationItem>
                <PaginationLink href="#" onClick={() => {
                  setPage(1)
                }}>1</PaginationLink>
                <PaginationLink href="#" onClick={() => {
                  setPage(2)
                }}>2</PaginationLink>
                <PaginationLink href="#" onClick={() => {
                  setPage(3)
                }}>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                <PaginationNext href="#" onClick={() => {
                  setPage((prev) => prev+1)
                }}/>
                </PaginationItem>
            </PaginationContent>
        </Pagination>

    </div>
  );
};

export default ExploreNFTs;
