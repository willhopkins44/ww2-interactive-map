const mongoose = require('mongoose');
const { Location } = require('../../mongoose/schemas/location');
const getLocation = require('../getLocation');

const updateLocation = async (body) => {
    let element;
    if (mongoose.Types.ObjectId.isValid(body.id)) {
        element = await getLocation(body.id);
        if (element) {
            for (const data of Object.entries(body.dataToUpdate)) {
                element[data[0]] = data[1];
            }
            await element.save();
        }
    }
    return element;
}

module.exports = updateLocation;