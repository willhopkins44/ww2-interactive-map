const { Regiment } = require('../mongoose/schemas/regiment');
const { Location } = require('../mongoose/schemas/location');

const getAllElements = async () => {
    let elements = {};
    elements.regiment = await Regiment.find({});
    elements.location = await Location.find({});
    return elements;
}

module.exports = getAllElements;