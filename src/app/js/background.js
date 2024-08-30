const imagePath = "../assets/vine.png";
const maxImageWidth = 300;

const buildVine = options => {
    const vine = document.createElement("img");
    vine.setAttribute("src", imagePath);
    vine.setAttribute("class", "vine");
    
    Object.keys(options).forEach(key => vine.style[key] = options[key]);
    
    document.querySelector("#background").appendChild(vine);
}

const defineStyle = ({totalSize, baseAlignment, secondaryAlignment, angle}) => {
    const vineQuantity = Math.ceil(totalSize / maxImageWidth);
    const width = totalSize / vineQuantity;
    const scale = 4.09;
    const height = (width / scale);
    const widthAsString = `${width}px`;
    const vines = [];

    for (let i = 0; i < vineQuantity; i++) {
        const startsAt = `${width * i}px`;
        const translate = ["left", "right"].indexOf(baseAlignment) === -1 ? (width - height) / 2 : 0;
        const transform = `rotate(${angle}deg) translate(${translate}px, -${translate}px)`;
        
        const vine = {width: widthAsString, [baseAlignment]: startsAt, [secondaryAlignment]: "0px", transform};
        vines.push(vine);
    }

    return vines;
}

const buildVines = () => {
    const top = {totalSize: window.innerWidth, baseAlignment: "left", secondaryAlignment: "top", angle: 0};
    const right = {totalSize: window.innerHeight, baseAlignment: "top", secondaryAlignment: "right", angle: 90};
    const bottom = {totalSize: window.innerWidth, baseAlignment: "right", secondaryAlignment: "bottom", angle: 180};
    const left = {totalSize: window.innerHeight, baseAlignment: "bottom", secondaryAlignment: "left", angle: 270};
    const vines = [];

    vines.push(...defineStyle(top));
    vines.push(...defineStyle(right));
    vines.push(...defineStyle(bottom));
    vines.push(...defineStyle(left));

    vines.forEach(buildVine);
}

export { buildVines };
