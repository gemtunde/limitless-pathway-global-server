import mongoose from "mongoose";
//import { config } from "../config/app.config";

// const connectDatabase = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI as string);
//     console.log("MongoDB connected successfully");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     process.exit(1);
//   }
// };
const connectDatabase = async () => {
  const uri = process.env.MONGO_URI;
  console.log("✅ Mongo URI at runtime:", uri); // <== ADD THIS

  if (!uri) {
    console.error("❌ MONGODB_URI is undefined");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDatabase;
