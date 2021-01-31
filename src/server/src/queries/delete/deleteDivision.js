const mongoose = require('mongoose');
const { Division } = require('../../mongoose/schemas/division');

const deletedivision = async (id) => {
    const response = await Division.deleteOne({_id: mongoose.Types.ObjectId(id)});
    if (response.ok == 1) {
        return true;
    } else {
        return false;
    }
};

module.exports = deletedivision;