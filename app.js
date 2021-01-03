const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./passportSetup.js');

const app = express();
const port = 3000;

app.use(session({
    secret: 'sweetwater',
    // store: 'MemoryStore', CHANGE TO SOMETHING ELSE FOR PRODUCTION. Check express-session page
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('src/client/src', {
    index: 'index.html'
}));

app.listen(port, () => {
    console.log('Initialized');
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