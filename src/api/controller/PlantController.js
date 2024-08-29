import { Plant } from "../database/models/Plant.js";

async function listPlants(_, response) {
    const plants = await Plant.findAll();
    response.json(plants);
}

async function listSimplifiedPlants(_, response) {
    const plants = await Plant.findAll().then(plants => (plants
        .map(plant => ({id: plant.id, name: plant.name, geometry: plant.geometry}))));

    response.json(plants);
}

async function searchPlants(request, response) {
    const plants = await Plant.findAll({$text: {$search: request.params.search}});
    response.json(plants);
}

async function listPlant(request, response) {
    const plant = await Plant.findById(request.params.id);
    response.json(plant);
}

async function createPlant(request, response) {
    const createdPlant = await Plant.create(request.body);
    response.status(201).json(createdPlant);
}

async function updatePlant(request, response) {
    const updatedPlant = await Plant.update(request.params.id, request.body);
    response.json(updatedPlant);
}

async function deletePlant(request, response) {
    await Plant.delete(request.params.id);
    response.json({});
}

export { listPlants, listSimplifiedPlants, searchPlants, listPlant, createPlant, updatePlant, deletePlant };
