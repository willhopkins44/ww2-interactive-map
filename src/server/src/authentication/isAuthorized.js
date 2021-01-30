const { User } = require('../mongoose/schemas/user');

const checkAdmin = async (steamId) => {
    const user = await User.findBySteamId(steamId);
    if (user && user._doc.admin) {
        return true;
    } else {
        return false;
    }
};

const checkCommand = async (req) => {
    if (req.body && req.body.command && req.session && req.session.passport) {
        if (req.body.command == req.session.passport.user) {
            return true;
        } else {
            return false;
        }
    }
}

const isAuthorized = async (req, res) => {
    if (!(req.session && req.session.passport && await checkAdmin(req.session.passport.user))) {
        if (req.session && req.session.passport) {
            // res.status(403).send('Forbidden');
            if (await checkCommand(req)) {
                res.status(200);
                return true;
            } else {
                res.status(403);
                res.write('Forbidden');
                return false;
            }
        } else {
            res.status(401);
            res.write('Unauthorized'); // not logged in
            return false;
        }
    } else {
        return true;
    }
}

module.exports = isAuthorized;