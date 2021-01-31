const mongoose = require('mongoose');
const { Division } = require('../../mongoose/schemas/division');

const getdivision = async (id) => {
    let element;
    if (mongoose.Types.ObjectId.isValid(id)) {
        element = await Division.findById(id);
    }
    return element;
}

module.exports = getdivision;