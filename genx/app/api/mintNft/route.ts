import dbConnect from "@/lib/dbConnect";
import { nftModel } from "@/models/nft.model";
import { userModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { name, description, tokenURI, recipientAddress, mintedBy } = await req.json();

        // Log the received values to debug
        console.log({ name, description, tokenURI, recipientAddress, mintedBy });

        if (!mintedBy) {
            return NextResponse.json({
                success: false,
                status: 400,
                message: "Field `mintedBy` is required.",
            });
        }

        // Check if user exists, if not create a new one
        let walletExists = await userModel.findOne({ walletAddress: mintedBy });
        if (!walletExists) {
            walletExists = await userModel.create({ walletAddress: mintedBy });
            console.log("New user created: ", walletExists);
        }

        // Check for empty fields
        if ([name, description, tokenURI, recipientAddress].some((el) => !el || el.trim() === "")) {
            return NextResponse.json({
                success: false,
                status: 400,
                message: "Name, description, tokenURI, and recipient address are all required.",
            });
        }

        // Create the new NFT
        const newNFT = await nftModel.create({
            name,
            description,
            tokenURI,
            recipientAddress,
            mintedBy,
        });

        return NextResponse.json({
            status: 200,
            success: true,
            message: "NFT successfully minted.",
            data: newNFT,
        });
    } catch (error:any) {
        console.error("Error in minting NFT:", error);
        return NextResponse.json({
            status: 500,
            success: false,
            message: `Internal server error: ${error.message || error}`,
        });
    }
}
