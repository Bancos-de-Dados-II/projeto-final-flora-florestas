const baseUrl = "http://localhost:3000/plants/";

const buildRequestObject = ({method, body}) => {
    return {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: method !== "GET" ? JSON.stringify(body) : null
    }
}

const request = async (path, object) => {
    const apiResponse = await fetch(`${baseUrl}${path}`, buildRequestObject(object)).then(response => response.json());

    if (apiResponse.error) throw new Error(apiResponse.error);

    return apiResponse;
};

const create = async (data) => request("", {method: "POST", body: data});
const getSimplified = async () => request("simplified", {method: "GET"});
const getPlant = async (id) => request(id, {method: "GET"});
const update = async (id, data) => request(id, {method: "PUT", body: data});
const deletePlant = async (id) => request(id, {method: "DELETE"});

export { create, getSimplified, getPlant, update, deletePlant };
