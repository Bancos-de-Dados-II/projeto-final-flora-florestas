import * as databaseConnection from "./databaseConnection.js";
import { updateForm, displayImage, removeImage, displayCreateButtons, displayUpdateButtons } from "./form.js";

const initialLatLng = [-6.889571480980119, -38.54529244638661];
const formLocation = document.querySelector("#map_form-coordinates");

const map = L.map("map", {center: initialLatLng, zoom: 20});
const markers = L.layerGroup().addTo(map);
const selectedPlaceMarker = L.marker(initialLatLng, {icon: L.icon({iconUrl: "../assets/watering_can.svg", iconSize: [80, 80], iconAnchor: [75, 65]})}).addTo(map);

const focusMarker = marker => {
    unfocusMarker(globalThis.focusedMarker);
    selectedPlaceMarker.setOpacity(0);
    map.setView(marker.getLatLng());
    marker.setIcon(L.icon({iconUrl: "../assets/tree_focus_pin.svg", iconSize: [80, 80]}));
    globalThis.focusedMarker = marker;
}

const unfocusMarker = marker => {
    marker?.setIcon(L.icon({iconUrl: "../assets/tree_pin.svg", iconSize: [50, 50]}));
    globalThis.focusedMarker = null;
    removeImage();
}

const removeMarker = marker => {
    unfocusMarker(marker);
    marker.remove();
}

const selectedPlaceMarkerUpdateEvent = event => {
    const latlng = event.latlng;

    selectedPlaceMarker.setLatLng(latlng);
    selectedPlaceMarker.setOpacity(1);
    map.setView(latlng);
    unfocusMarker(globalThis.focusedMarker);

    updateForm();
    formLocation.value = latlng.lat + ", " + latlng.lng;

    displayCreateButtons();
}

const createMarker = markerObject => {
    const coordinates = markerObject.geometry.coordinates.reverse();
    const locationMarker = L.marker(coordinates, {
        icon: L.icon({iconUrl: "../assets/seed_pin.svg", iconSize: [30, 30]}),
        title: markerObject.name,
        alt: markerObject.name,
        draggable: true,
        autoPan: true
    }).addTo(markers);

    locationMarker.addEventListener("click", async () => {
        const plant = await databaseConnection.getPlant(markerObject.id);

        updateForm({name: plant.name, scientific: plant.scientific, image: plant.image});
        formLocation.value = plant.geometry.coordinates[1] + ", " + plant.geometry.coordinates[0];
        focusMarker(locationMarker);
        displayImage(plant.image);
        globalThis.plantId = markerObject.id;
        
        displayUpdateButtons();
    });

    locationMarker.addEventListener("dragend", async (event) => {
        const latlng = event.target._latlng;
        const geometry = {
            type: "Point",
            coordinates: [latlng.lng, latlng.lat]
        };

        try {
            await databaseConnection.update(markerObject.id, {geometry});
        } catch {
            window.alert("Não foi possível atualizar a planta...");
            locationMarker.setLatLng(coordinates);
        }
    });
}

const applySearch = async (search) => {
    try {
        const plants = await databaseConnection.getPlants(search);
        markers.clearLayers();
        plants.forEach(createMarker);
    } catch {
        window.alert(`Não foi possível recuperar plantas da espécie ${search} documentadas anteriormente...`);
    }
}

const initMap = async () => {
    try {
        await databaseConnection.getSimplified().then(plants => plants.forEach(createMarker));
    } catch {
        window.alert("Não foi possível recuperar plantas documentadas anteriormente...");
    }
}

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.on("locationfound", selectedPlaceMarkerUpdateEvent);
map.on("click", selectedPlaceMarkerUpdateEvent);

export { removeMarker, selectedPlaceMarkerUpdateEvent, createMarker, applySearch, initMap };
