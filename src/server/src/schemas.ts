const mongoose = require('mongoose');

const User = new mongoose.Schema({
    id: String
});

const Battalion = new mongoose.Schema({
    name: String,
    strength: Number,
    organization: Number,
    experience: Number,
    command: [User]
});

const Regiment = new mongoose.Schema({
    name: String,
    pos_x: Number,
    pos_y: Number,
    stance: String,
    command: [User],
    Battalions: [Battalion]
});