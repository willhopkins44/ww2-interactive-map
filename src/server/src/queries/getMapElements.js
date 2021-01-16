// const mongoose = require('mongoose');
const { Regiment } = require('../mongoose/schemas/regiment');

const getMapElements = async () => {
    return await Regiment.find({});
}

module.exports = getMapElements;