function filterFields(model, request) {
    const modelFields = Object.keys(model);
    const requestFields = Object.keys(request).filter(key => modelFields.includes(key));
    const filtered = {};

    requestFields.forEach(field => filtered[field] = request[field]);

    return filtered;
}

function validateRestrictions(model, request) {
    function throwError(key) {
        throw new Error(`400 BAD REQUEST: Field '${key}' can't be null`);
    }

    Object.keys(model).forEach(key => {
        if (model[key].required && request[key] === undefined) throwError(key);
    });

    if (model.geometry && 
        (request.geometry?.type !== "Point" || request.geometry?.coordinates?.length !== 2)) {
            throwError("geometry");
    }
}

async function create(connection, model, type, request) {
    const filteredRecord = filterFields(model, request);
    validateRestrictions(model, filteredRecord);
    
    try {
        const createdRecord = await connection.create(filteredRecord);
        console.log(`Success to create on ${type} database`);
        return createdRecord;
    } catch (error) {
        console.log(`Failed to create on ${type} database`);
        throw error;
    }
}

async function findById(connection, type, id) {
    try {
        return connection.findById(id).exec();
    } catch (error) {
        console.log(`Failed to find '${id}' on '${type}' database`);
        throw error;
    }
}

async function findAll(connection, queryProperties = {}) {
    try {
        return connection.find(queryProperties).exec();
    } catch (error) {
        console.log(`Failed to find all on '${type}' database`);
        throw error;
    }
}

async function update(connection, model, type, id, request) {
    const filteredRecord = filterFields(model, request);
    const data = await findById(connection, type, id);

    if (data === null) return;

    Object.keys(filteredRecord).forEach(key => data[key] = filteredRecord[key]);
    validateRestrictions(model, data);

    try {
        await data.save();
        console.log(`Success to update ${id} on ${type} database`);
        return data;
    } catch (error) {
        console.log(`Failed to update '${id}' on '${type}' database`);
        throw error;
    }
}

async function deleteRecord(connection, type, id) {
    try {
        await connection.findByIdAndDelete(id);
        console.log(`Success to delete ${id} on ${type} database`);
    } catch (error) {
        console.log(`Failed to delete '${id}' on '${type}' database`);
        throw error;
    }
}

function defineModelCrud(connection, model, type) {
    return {
        create: async (request) => create(connection, model, type, request),
        findById: async (id) => findById(connection, type, id),
        findAll: async (queryProperties) => findAll(connection, queryProperties),
        update: async (id, request) => update(connection, model, type, id, request),
        delete: async (id) => deleteRecord(connection, type, id)
    }
}

export { defineModelCrud };
