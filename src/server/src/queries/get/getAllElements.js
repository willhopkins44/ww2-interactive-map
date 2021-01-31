const { Division } = require('../../mongoose/schemas/division');
const { Location } = require('../../mongoose/schemas/location');

const getAllElements = async () => {
    let elements = {};
    elements.division = await Division.find({});
    elements.location = await Location.find({});
    return elements;
}

module.exports = getAllElements;