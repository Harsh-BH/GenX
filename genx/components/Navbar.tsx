"use client";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b bg-white bg-opacity-5 min-h-[80px] w-full">
      <div className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-[80px]">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href={"/"}
              className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Gen
              <span
                className="jump-twice text-4xl font-bold text-white relative top-[3px]"
              >
                X
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-12">
            <Link
              href={"/explore"}
              className="jump-twice text-2xl font-bold text-white"
            >
              Explore
            </Link>
            <Link
              href={"/dashboard"}
              className="jump-twice text-2xl font-bold text-white"
            >
              Dashboard
            </Link>
            <Link
              href={"/generate"}
              className="jump-twice text-2xl font-bold text-white"
            >
              Mint NFT
            </Link>
          </div>

          {/* Connect Button */}
          <div>
            <ConnectButton label="Sign in" />
          </div>
        </div>
      </div>
    </nav>
  );
}
