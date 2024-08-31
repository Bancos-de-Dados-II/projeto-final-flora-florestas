import { buildVines } from "./background.js";

const qs = element => document.querySelector(element);

const baseUrl = "https://charts.mongodb.com/charts-project-0-zhcwkfk/embed/charts?maxDataAge=-1&theme=light&autoRefresh=false&attribution=false&id=";
const heatmapId = "66d22fb5-236e-4eaf-87df-c619d1d05fd4";
const numberId = "99a87076-115c-4c47-8bf8-5463c8386419";
let timeout = setTimeout(() => {}, 1);

const createIframe = () => document.createElement("iframe");

const buildCharts = search => {
    const query = search ? `&filter={$or:[{name:"${search}"},{scientific:"${search}"}]}` : "";

    const heatmap = createIframe();
    heatmap.setAttribute("src", baseUrl + heatmapId + query);
    heatmap.setAttribute("id", "heatmap");
    const number = createIframe();
    number.setAttribute("src", baseUrl + numberId + query);
    number.setAttribute("id", "number");

    qs("#charts").replaceChildren(heatmap, number);
}

const searchEvent = event => {
    clearTimeout(timeout);
    timeout = setTimeout(() => buildCharts(event.target.value), 1000);
}

buildVines();
buildCharts();

qs("#search_input").addEventListener("input", searchEvent);
