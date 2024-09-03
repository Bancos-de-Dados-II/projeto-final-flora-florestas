import { createClient } from "redis";
import { configDotenv } from "dotenv";

configDotenv();
const env = process.env;

const redis = createClient({url: env.REDIS_URL});

async function redisConnection() {
    await redis.on("error", () => console.log("Redis connection error")).connect();
    console.log("Connected to Redis");
}

export { redis, redisConnection };
