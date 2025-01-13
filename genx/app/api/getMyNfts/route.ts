import dbConnect from "@/lib/dbConnect";
import { nftModel } from "@/models/nft.model";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    await dbConnect()

    try {
        
        const {walletAddress} = await req.json()

        const nfts = await nftModel.find({mintedBy: walletAddress
        });

        if(!nfts){
            return NextResponse.json({
                status: 200,
                success: false,
                message: "No nfts minted yet"
            })
        }

        return NextResponse.json({
            status: 200,
            success: true,
            data: nfts
        })

    } catch (error) {
        return NextResponse.json({
            status: 500,
            success: false,
            message: `Internal server error: ${error}`
        })
    }
}