const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./src/server/src/init.js');

const createRegiment = require('./src/server/src/queries/createRegiment');

const app = express();

// Middlewares

// Serve statics before session to avoid repeated Passport user deserialization
app.use(express.static('src/client/src', {
    index: 'index.html'
}));

app.use(express.json());

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

app.post('/post', async (req, res) => {
    res.send('RETURN NEWLY CREATED UNIT\'S ATTRIBUTES');
    if (req.body.type) {
        if (req.body.type == 'regiment') {
            if (req.session.passport) {
                await createRegiment(req.body, req.session.passport.user);
            }
        }
    }
    // TODO: expand this into separate, modular Express router function
    // and fix gross nested if statements
});


// Startup listener


app.listen(process.env.port, process.env.host, () => {
    console.log('Initialized');
});