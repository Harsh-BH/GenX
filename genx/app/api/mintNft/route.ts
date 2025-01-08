import dbConnect from "@/lib/dbConnect";
import { nftModel } from "@/models/nft.model";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    await dbConnect()

    const {name,description,tokenURI,recipientAddress} = await req.json()

    try {

        if([name,description,tokenURI,recipientAddress].some((el) => el.trim === " ")){
            return NextResponse.json({
                success: false,
                status: 400,
                message: "Name, Description, tokenURI and recipient address are all required."
            })
        }

        const newNFT = await nftModel.create({
            name,
            description,
            tokenURI,
            recipientAddress
        })

        return NextResponse.json({
            status: 200,
            success: true,
            message: "NFT successfully minted",
            data: newNFT
        })


    } catch (error) {
        return NextResponse.json({
            status: 500,
            success: false,
            message: `Internal server error: ${error}`
        })
    }
}