const qs = element => document.querySelector(element);

const form = {
    name: qs("#map_form-name"),
    scientific: qs("#map_form-scientific"),
    image: qs("#map_form-image")
};
const formLocation = qs("#map_form-coordinates");
const formButtons = {
    create: qs("#map_form-create_button"),
    update: qs("#map_form-update_button"),
    delete: qs("#map_form-delete_button")
};

const updateForm = (inputsObject = {}) => Object.keys(form).forEach(key => form[key].value = inputsObject[key] || "");

const displayButtons = type => {
    const create = type === "create" ? "block" : "none";
    const update = type === "update" ? "block" : "none";

    formButtons.create.style.display = create;
    formButtons.update.style.display = update;
    formButtons.delete.style.display = update;
}
const displayCreateButtons = () => displayButtons("create");
const displayUpdateButtons = () => displayButtons("update");

const displayImage = src => qs("#map_form-plant_image").setAttribute("src", src);
const removeImage = () => displayImage("../assets/tree_placeholder.png");

const validateFormValues = () => {
    const emptyValues = Object.values(form).map(input => input.value.replace(" ", "")).filter(value => !value).length;
    if (emptyValues){
        window.alert("Por favor, preencha todos os campos e tente novamente.");
        return null;
    }

    const plant = {};
    Object.keys(form).forEach(key => plant[key] = form[key].value);
    plant.geometry = {
        type: "Point",
        coordinates: formLocation.value.split(", ").reverse().map(value => parseFloat(value))
    };

    return plant;
}

export { updateForm, displayCreateButtons, displayUpdateButtons, displayImage, removeImage, validateFormValues };
