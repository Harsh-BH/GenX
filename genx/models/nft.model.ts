import mongoose, { ObjectId, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface NFT {
    name: string;
    description: string;
    recipientAddress: string;
    tokenURI: string;
    mintedBy: string;
}

const nftSchema: Schema<NFT> = new Schema({
    name: {
        type: String,
        required: true
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
    },
    mintedBy: {
        type: String,
        required: true
    }
},{timestamps: true})

nftSchema.plugin(mongooseAggregatePaginate)

export const nftModel = (mongoose.models.Nft as mongoose.Model<NFT>) || mongoose.model<NFT>("Nft", nftSchema)