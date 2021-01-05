const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./passportSetup.js');

const app = express();
const port = 3000;

// Middlewares

app.use(session({
    secret: 'sweetwater',
    // store: 'MemoryStore', CHANGE TO SOMETHING ELSE FOR PRODUCTION. Check express-session page
    cookie: {
        httpOnly: false
    },
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('src/client/src', {
    index: 'index.html'
}));

// MongoDB

const MongoClient = require('mongodb').MongoClient;
const mongoUser = process.env.mongodb_user;
const mongoPassword = process.env.mongodb_password;
const mongoDatabase = 'ww2-map-database';

const uri = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoDatabase}.sw7iz.mongodb.net/Authentication?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


app.listen(port, () => {
    console.log('Initialized');
    console.log(process.env);
});

app.get('/auth/steam', passport.authenticate('steam'),
    function(req, res) {});

app.get('/auth/steam/return', passport.authenticate('steam', { failureRedirect: '/failed' }),
    function(req, res) {
        // Success
        res.redirect('/');
    });

app.get('/session', (req, res) => {
    console.log(req.session);
    res.redirect('/');
});