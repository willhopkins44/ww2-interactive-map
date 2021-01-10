const mongoose = require('mongoose');

const mongoUser = process.env.mongodb_user;
const mongoPassword = process.env.mongodb_password;
const mongoDatabase = 'Mongo_Init';

mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@ww2-map-database.sw7iz.mongodb.net/${mongoDatabase}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }, function cb(err) {
        if (err) {
            console.error(err)
        } else {
            console.log('Mongoose connection initiaized');
        }
    });