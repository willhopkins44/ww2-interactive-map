const { User } = require('../mongoose/schemas/user');

const checkAdmin = async (steamId) => {
    const user = await User.findBySteamId(steamId);
    if (user && user._doc.admin) {
        return true;
    } else {
        return false;
    }
};

const isAuthorized = async (req, res) => {
    if (!(req.session && req.session.passport && await checkAdmin(req.session.passport.user))) {
        if (req.session && req.session.passport) {
            res.status(403).send('Forbidden');
        } else {
            res.status(401).send('Unauthorized');
        }
    } else {
        return true;
    }
}

module.exports = isAuthorized;