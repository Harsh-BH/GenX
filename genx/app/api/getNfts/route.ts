import dbConnect from "@/lib/dbConnect";
import { nftModel } from "@/models/nft.model";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    await dbConnect()

    try {
        
        const {page, limit} = await req.json()

        const nfts = await nftModel.aggregate([
        {
            $facet: {
            metadata: [{ $count: 'totalCount' }],
            data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
            },
        },
        {
            $sort: {createdAt: -1},
        }
        ]);

        return NextResponse.json({
            status: 200,
            success: true,
            data: {
                metadata: { totalCount: nfts[0].metadata[0].totalCount, page, limit },
                data: nfts[0].data
            },
        })
        

    } catch (error) {
        return NextResponse.json({
            status: 500,
            success: false,
            message: `Internal server error: ${error}`
        })
    }
}