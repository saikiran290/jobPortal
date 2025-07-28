import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.log("❌ DB connection failed:", error.message);
        process.exit(1); // Optional: stop server on DB failure
    }
};

export default connectDB;
