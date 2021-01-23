const mongoose = require('mongoose');

const connection = mongoose.connection.useDb('Map_Elements');

const locationSchema = new mongoose.Schema({
    name: String,
    pos_x: Number,
    pos_y: Number
});

const Location = connection.model('Location', locationSchema, '_locations');

module.exports = { locationSchema, Location };