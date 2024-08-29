import express from "express";
import * as PlantController from "../controller/PlantController.js";

const PlantRouter = express.Router();

PlantRouter.get("/", PlantController.listPlants);
PlantRouter.get("/simplified", PlantController.listSimplifiedPlants);
PlantRouter.get("/:search", PlantController.searchPlants);
PlantRouter.get("/:id", PlantController.listPlant);
PlantRouter.post("/", PlantController.createPlant);
PlantRouter.put("/:id", PlantController.updatePlant);
PlantRouter.delete("/:id", PlantController.deletePlant);

export { PlantRouter };
