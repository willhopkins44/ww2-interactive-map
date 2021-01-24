const { Regiment } = require('../mongoose/schemas/regiment');

const deleteRegiment = async (id) => {
    Regiment.deleteOne({ id });
};

module.exports = deleteRegiment;