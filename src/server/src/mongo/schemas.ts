const mongoose = require('mongoose');

function Coordinate(x: Number, y: Number) {
    this.x = x;
    this.y = y;
};

const Battalion = new mongoose.Schema({
    name: String,
    strength: Number,
    organization: Number,
    experience: Number
});

const Regiment = new mongoose.Schema({
    name: String,
    position: Coordinate,
    stance: String,
    Battalions: [Battalion]
});