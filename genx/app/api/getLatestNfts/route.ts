import dbConnect from "@/lib/dbConnect";
import { nftModel } from "@/models/nft.model";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    await dbConnect()

    try {
        const nfts = await nftModel.aggregate([
            {
                $sort : {"createdAt": -1}
            },
            {
                $limit: 5
            }
        ]);

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