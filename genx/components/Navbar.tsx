"use client";

import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export function Navbar() {
  return (
    <nav className="border-b bg-white bg-opacity-5 min-h-[80px] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-[80px]">
          <div className="flex items-center">
            <Link href={"/"} className="text-3xl font-bold absolute bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Gen<span className="jump-twice text-4xl font-bold text-white relative top-[3px]">X</span>
            </Link>
          </div>
          
          <div className="flex gap-8 justify-center items-center">
          <Link href={"/explore"} className="text-xl text-pink-500 hover:underline font-semibold">Explore</Link>
          <Button variant="outline" className="flex items-center gap-2 hover:scale-105 hover:translate-y-[-2px] text-pink-500 border-pink-200 transition-all border-2 hover:border-white hover:shadow-xl hover:text-white hover:shadow-border  hover:bg-pink-700 hover:bg-opacity-30">
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
          </div>
          
        </div>
      </div>
    </nav>
  );
}