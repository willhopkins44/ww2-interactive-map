const mongoose = require('mongoose');
const { userSchema } = require('./user');
const { battalionSchema } = require('./battalion');

const connection = mongoose.connection.useDb('Map_Elements');

const regimentSchema = new mongoose.Schema({
    name: String,
    pos_x: Number,
    pos_y: Number,
    stance: String,
    command: userSchema,
    // Battalions: [Battalion]
});

const Regiment = connection.model('Regiment', regimentSchema, '_regiments');

module.exports = { regimentSchema, Regiment };