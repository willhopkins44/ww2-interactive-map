const mongoose = require('mongoose');
const { Regiment } = require('../mongoose/schemas/regiment');

const getRegiment = async (id) => {
    let element;
    if (mongoose.Types.ObjectId.isValid(id)) {
        element = await Regiment.findById(id);
    }
    return element;
}

module.exports = getRegiment;