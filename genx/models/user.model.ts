import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface User {
    walletAddress: string
}

const userSchema: Schema<User> = new Schema({
    walletAddress: {
        type: String,
        required: true
    },
    
},{timestamps: true})

userSchema.plugin(mongooseAggregatePaginate)

export const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema)