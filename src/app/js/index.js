import * as databaseConnection from "./databaseConnection.js";
import { removeMarker, selectedPlaceMarkerUpdateEvent, createMarker, applySearch, initMap } from "./map.js";
import { updateForm, validateFormValues } from "./form.js";
import { buildVines } from "./background.js";

const qs = element => document.querySelector(element);

let timeout = setTimeout(() => {}, 1);

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
        createMarker({...savedPlant, id: savedPlant._id});
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

const searchEvent = async (event) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => applySearch(event.target.value), 1000);
}

const redirect = () => {
    const currentUrl = window.location.href.split("/");
    currentUrl.pop();
    const urlBase = currentUrl.join("/");

    window.location = urlBase + "/charts.html";
}

initMap();
updateForm();
buildVines();

qs("#map_form-create_button").addEventListener("click", createButtonClickEvent);
qs("#map_form-update_button").addEventListener("click", (event) => updateButtonClickEvent(event, globalThis.plantId, globalThis.focusedMarker));
qs("#map_form-delete_button").addEventListener("click", (event) => deleteButtonClickEvent(event, globalThis.plantId, globalThis.focusedMarker));
qs("#map_container-search_input").addEventListener("input", searchEvent);
qs("#map_container-button").addEventListener("click", redirect);
