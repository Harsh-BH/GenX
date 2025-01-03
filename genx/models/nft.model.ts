import mongoose, { Schema } from "mongoose";

export interface NFT {
    
}

const nftSchema: Schema<NFT> = new mongoose.Schema({

})

export const nftModel = (mongoose.models.Nft as mongoose.Model<NFT>) || mongoose.model<NFT>("Nft", nftSchema)