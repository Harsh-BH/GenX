"use client";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from "next/link";




export function Navbar() {
  return (
    <nav className="border-b bg-white bg-opacity-5 min-h-[80px] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-[80px]">
          <div className="flex items-center">
            <Link href={"/"} className="text-3xl font-bold absolute bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Gen
              <span className="jump-twice text-4xl font-bold text-white relative top-[3px]"
              >X</span>
            </Link>
          </div>
          <ConnectButton label="Sign in"  />
        </div>
      </div>
    </nav>
  );
}