import { Plant } from "../database/models/Plant.js";
import { redis } from "../database/redisConnection.js";

const redisSimplifiedPlantsKey = "simplifiedPlants";

async function listPlants(request, response) {
    const queryProperties = {};
    if (request.query.search) queryProperties["$text"] = {$search:request.query.search};

    const plants = await Plant.findAll(queryProperties);
    response.json(plants);
}

async function listSimplifiedPlants(_, response) {
    const redisPlants = await redis.get(redisSimplifiedPlantsKey);

    if (redisPlants) {
        response.json(JSON.parse(redisPlants));
    } else {
        const plants = await Plant.findAll().then(plants => (plants
            .map(plant => ({id: plant.id, name: plant.name, geometry: plant.geometry}))));

        redis.set(redisSimplifiedPlantsKey, JSON.stringify(plants), {EX: 3600});
    
        response.json(plants);
    }
}

async function listPlant(request, response) {
    const plant = await Plant.findById(request.params.id);
    response.json(plant);
}

async function createPlant(request, response) {
    const createdPlant = await Plant.create(request.body);
    redis.del(redisSimplifiedPlantsKey);
    response.status(201).json(createdPlant);
}

async function updatePlant(request, response) {
    const updatedPlant = await Plant.update(request.params.id, request.body);
    redis.del(redisSimplifiedPlantsKey);
    response.json(updatedPlant);
}

async function deletePlant(request, response) {
    await Plant.delete(request.params.id);
    redis.del(redisSimplifiedPlantsKey);
    response.json({});
}

export { listPlants, listSimplifiedPlants, listPlant, createPlant, updatePlant, deletePlant };
