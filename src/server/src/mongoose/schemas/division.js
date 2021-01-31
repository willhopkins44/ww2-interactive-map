const mongoose = require('mongoose');

const connection = mongoose.connection.useDb('Map_Elements');

const divisionSchema = new mongoose.Schema({
    name: String,
    pos_x: Number,
    pos_y: Number,
    command: Number,
    stance: String,
    range: Number, // in pixels
    strength: Number,
    equipment: Number,
    organization: Number,
    experience: Number
});

const Division = connection.model('Division', divisionSchema, '_divisions');

module.exports = { divisionSchema, Division };