const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

passport.use(new SteamStrategy({
        returnURL: 'http://localhost:3000/auth/steam/return',
        realm: 'http://localhost:3000/',
        apiKey: '82A624FF213EAB18611B7D3737106624'
    },
    function(identifier, profile, done) {
        // User.findByOpenID({ openId: identifier }, function (err, user) {
        //     return done(err, user);
        // });
        // User is for Mongoose

        console.log(`Identifier: ${identifier}`);
        console.log(`Profile: ${profile}`);
        return done(null, profile);
    }
));

passport.serializeUser(function(user, done) {
    console.log(`Serializing user: ${user}`);
    done(null, user.id);
});

// passport.deserializeUser(function(id, done) {
//     User.findById(id, function(err, user) {
//         done(err, user);
//     });
// });

passport.deserializeUser(function(user, done) {
    console.log(`Deserializing user: ${user}`);
    done(null, user);
})