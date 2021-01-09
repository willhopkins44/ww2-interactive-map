const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    steamId: String
});

module.exports = mongoose.model('User', userSchema, '_users');