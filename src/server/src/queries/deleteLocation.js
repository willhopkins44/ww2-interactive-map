const { Location } = require('../mongoose/schemas/location');

const deleteLocation = async (id) => {
    Regiment.deleteOne({ id });
};

module.exports = deleteLocation;