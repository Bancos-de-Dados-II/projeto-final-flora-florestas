import * as databaseConnection from "./js/databaseConnection.js";
import { removeMarker, selectedPlaceMarkerUpdateEvent, createMarker, initMap } from "./js/map.js";
import { updateForm, validateFormValues } from "./js/form.js";
import { buildVines } from "./js/background.js";

const qs = element => document.querySelector(element);

const createButtonClickEvent = async (event) => {
    event.preventDefault();

    const plant = validateFormValues();
    if (plant === null) return;

    try {
        const savedPlant = await databaseConnection.create(plant);
        createMarker(savedPlant);
    } catch {
        window.alert("Oops, algo deu errado...");
    }

    updateForm();
}

const updateButtonClickEvent = async (event, id, marker) => {
    event.preventDefault();

    const plant = validateFormValues();
    if (plant === null) return;

    try {
        const savedPlant = await databaseConnection.update(id, plant);
        removeMarker(marker);
        createMarker(savedPlant);
        selectedPlaceMarkerUpdateEvent({latlng: savedPlant.geometry.coordinates});
    } catch {
        window.alert("Oops, algo deu errado...");
    }

    updateForm();
}

const deleteButtonClickEvent = async (event, id, marker) => {
    event.preventDefault();
    const latlng = {latlng: marker._latlng};

    try {
        await databaseConnection.deletePlant(id);
        removeMarker(marker);
        selectedPlaceMarkerUpdateEvent(latlng);
    } catch (error) {
        window.alert("Oops, algo deu errado...");
    }
}

initMap();
updateForm();
buildVines();

qs("#map_form-create_button").addEventListener("click", createButtonClickEvent);
qs("#map_form-update_button").addEventListener("click", (event) => updateButtonClickEvent(event, globalThis.plantId, globalThis.focusedMarker));
qs("#map_form-delete_button").addEventListener("click", (event) => deleteButtonClickEvent(event, globalThis.plantId, globalThis.focusedMarker));
