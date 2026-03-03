import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve('./config/.env') })
export const connectDB = ()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB connected successfully");
    })
    .catch((error) => {
        console.error("DB connection error:", error);
    });
}