import mongoose from "mongoose";
import { defineModelCrud } from "../utils/modelsCrud.js";

const { Schema } = mongoose;

const model = {
    name: {
        type: String,
        required: true
    },
    scientific: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    geometry: {
        type: {type: String, enum: ["Point"], required: true},
        coordinates: {type: [Number], required: true}
    }
};

const schema = new Schema(model);
schema.index(
    {name: "text", scientific: "text"},
    {default_language: "pt"}
);

const database = mongoose.model("plants", schema);

const type = "PLANT";
const plantFunctions = defineModelCrud(database, model, type);
const Plant = {
    type,
    database,
    model,
    ...plantFunctions
};

export { Plant };
