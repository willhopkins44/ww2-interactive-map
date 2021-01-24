const mongoose = require('mongoose');
const { Location } = require('../mongoose/schemas/location');

const deleteLocation = async (id) => {
    const response = await Location.deleteOne({_id: mongoose.Types.ObjectId(id)});
    if (response.ok == 1) {
        return true;
    } else {
        return false;
    }
};

module.exports = deleteLocation;