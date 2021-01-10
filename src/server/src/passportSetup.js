const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const User = require('./mongoose/schemas/user');

passport.use(new SteamStrategy({
        returnURL: 'http://localhost:3000/auth/steam/return',
        realm: 'http://localhost:3000/',
        apiKey: '82A624FF213EAB18611B7D3737106624'
    },
    async function(identifier, profile, done) {
        const user = await User.findBySteamId(profile.id);
        // console.log(`Profile: ${JSON.stringify(profile)}`);
        // console.log(`Identifier: ${identifier}`);
        // console.log(`User: ${user}`);
        if (!user) {
            // console.log('No user found');
            const newUser = new User({
                name: profile.displayName,
                steamId: profile.id
            });
            newUser.save(function(err, newUser) {
                if (err) return console.error(err);
            });
        }
        return done(null, user);
    }
));

passport.serializeUser(function(user, done) {
    // console.log(`Serializing user: ${JSON.stringify(user)}`);
    done(null, user.steamId);
});

passport.deserializeUser(async function(userId, done) {
    const user = await User.findBySteamId(userId);
    // const user = await User.findBySteamId('123');
    // console.log(`Deserialized user: ${user}`);
    if (!user) console.error('DeserializeUser failed: no user found');
    done(null, user);
})