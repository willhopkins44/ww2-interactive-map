const mongoUser = process.env.mongodb_user;
const mongoPassword = process.env.mongodb_password;
const mongoDatabase = 'Authentication';

const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@ww2-map-database.sw7iz.mongodb.net/${mongoDatabase}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected');
});