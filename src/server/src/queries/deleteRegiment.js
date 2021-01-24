const mongoose = require('mongoose');
const { Regiment } = require('../mongoose/schemas/regiment');

const deleteRegiment = async (id) => {
    const response = await Regiment.deleteOne({_id: mongoose.Types.ObjectId(id)});
    if (response.ok == 1) {
        return true;
    } else {
        return false;
    }
};

module.exports = deleteRegiment;