const mongoose = require('mongoose');
const connection = mongoose.connection.useDb('Authentication');

const userSchema = new mongoose.Schema({
    name: String,
    steamId: String
});

userSchema.static('findBySteamId', function(id) {
    return this.findOne({ steamId: id });
});

const User = connection.model('User', userSchema, '_users');

module.exports = { userSchema, User };