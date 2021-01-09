const mongoose = require('mongoose');
const User = require('../schemas/user');

const mongoUser = process.env.mongodb_user;
const mongoPassword = process.env.mongodb_password;
const mongoDatabase = 'Authentication';

const findOrCreate = id => {    
    mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@ww2-map-database.sw7iz.mongodb.net/${mongoDatabase}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('Connected');
        User.findOne({ steamId: id }, function (err, user) {
            console.log(`Id: ${id}`);
            if (err) console.error(err); // Always null?
            console.log(`Err: ${err}`);
            console.log(`User: ${user}`); // debugging
            db.close();
            // return user;
        });
    });
};

module.exports = { findOrCreate };