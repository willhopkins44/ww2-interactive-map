const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./server/src/init.js');
const post = require('./server/src/routers/post');
const get = require('./server/src/routers/get');

const app = express();

// Middlewares

// Serve statics before session to avoid repeated Passport user deserialization
app.use(express.static(__dirname + '/client/src', {
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

app.use('/post', post);
app.use('/get', get);

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

// app.get('/req', (req, res) => {
//     console.log('/req');
//     console.log(req);
// });

app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        if (err) console.error(err);
        res.clearCookie('connect.sid', {path: '/'});
        res.redirect('/');
    });
});

// Startup listener

app.listen(process.env.port, process.env.host, () => {
    console.log('Initialized');
});