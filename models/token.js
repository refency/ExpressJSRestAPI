import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const Token = new mongoose.Schema({
    userId: { type: ObjectId, ref: 'User', required: true },
    refreshToken: { type: String, required: true }
})

export default mongoose.model('Token', Token)
