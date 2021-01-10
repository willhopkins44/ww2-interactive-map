const mongoose = require('mongoose');
const User = require('user');
const Battalion = require('battalion');

const regimentSchema = new mongoose.Schema({
    name: String,
    pos_x: Number,
    pos_y: Number,
    stance: String,
    command: [User],
    Battalions: [Battalion]
});

module.exports = { regimentSchema };