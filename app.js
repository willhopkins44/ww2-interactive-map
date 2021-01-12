const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./src/server/src/init.js');

const app = express();
const port = 3000;


// Middlewares

// Serve statics before session to avoid repeated Passport user deserialization
app.use(express.static('src/client/src', {
    index: 'index.html'
}));

app.use(session({
    secret: 'sweetwater',
    // store: 'MemoryStore', CHANGE TO SOMETHING ELSE FOR PRODUCTION. Check express-session page
    cookie: {
        httpOnly: false,
        secure: false
    },
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


// Passport Steam routes


app.get('/auth/steam', passport.authenticate('steam'),
    function(req, res) {});

app.get('/auth/steam/return', passport.authenticate('steam', { failureRedirect: '/failed' }),
    function(req, res) {
        // Success
        res.redirect('/');
    });

app.get('/failed', (req, res) => {
    res.send('Login failed');
});

app.get('/session', (req, res) => {
    console.log(req.session);
    res.redirect('/');
});

app.get('/req', (req, res) => {
    console.log('/req');
    console.log(req);
});

app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        if (err) console.error(err);
        res.clearCookie('connect.sid', {path: '/'});
        res.redirect('/');
    });
});

app.get('/post', (req, res) => {
    console.log(req);
});


// Startup listener


app.listen(port, () => {
    console.log('Initialized');
});