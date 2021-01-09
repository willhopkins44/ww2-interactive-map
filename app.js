const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./src/server/src/init.js');

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


// Passport Steam routes


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

app.get('/req', (req, res) => {
    console.log('/req');
    console.log(req);
});

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})


// Startup listener


app.listen(port, () => {
    console.log('Initialized');
});