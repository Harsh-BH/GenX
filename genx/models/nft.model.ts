import mongoose, { Schema } from "mongoose";

export interface NFT {
    name: string;
    image: string;
    description: string;
    recipientAddress: string;
    tokenURI: string;
}

const nftSchema: Schema<NFT> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    recipientAddress: {
        type: String,
        required: true
    },
    tokenURI: {
        type: String,
        required: true
    }
})

export const nftModel = (mongoose.models.Nft as mongoose.Model<NFT>) || mongoose.model<NFT>("Nft", nftSchema)