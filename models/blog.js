import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const Blog = new mongoose.Schema({
    messageText: { type: String },
    messageMedia: { type: Buffer },
    userId: { type: ObjectId, ref: 'User', required: true }
})

export default mongoose.model('Blog', Blog)
