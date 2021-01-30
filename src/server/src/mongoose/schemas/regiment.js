const mongoose = require('mongoose');

const connection = mongoose.connection.useDb('Map_Elements');

const regimentSchema = new mongoose.Schema({
    name: String,
    pos_x: Number,
    pos_y: Number,
    stance: String,
    command: Number,
    range: Number // in pixels
    // Battalions: [Battalion IDs]
});

const Regiment = connection.model('Regiment', regimentSchema, '_regiments');

module.exports = { regimentSchema, Regiment };