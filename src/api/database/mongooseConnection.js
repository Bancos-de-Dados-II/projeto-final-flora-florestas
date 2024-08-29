import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();
const env = process.env;

async function mongooseConnection() {
    try {
        await mongoose.connect(env.MONGO_URL);
        console.log("Connected to database");
    } catch (error) {
        console.log("Error while trying to connect to database");
        console.log(error);
    }
}

export { mongooseConnection };
