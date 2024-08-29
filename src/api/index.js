import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { mongooseConnection } from "./database/mongooseConnection.js";
import { PlantRouter } from "./router/PlantRouter.js";

mongooseConnection();
configDotenv();

const app = express();
app.use(cors());
app.use(express.json());

const corsOptions = {
    origin: ["http://localhost:5500"],
};

app.use("/plants", PlantRouter);

const port = process.env.API_PORT;
app.listen(port, () => console.log("App started"));
