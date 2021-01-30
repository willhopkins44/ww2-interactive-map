const mongoose = require('mongoose');
const { Location } = require('../mongoose/schemas/location');

const getLocation = async (id) => {
    let element;
    if (mongoose.Types.ObjectId.isValid(id)) {
        element = await Location.findById(id);
    }
    return element;
}

module.exports = getLocation;