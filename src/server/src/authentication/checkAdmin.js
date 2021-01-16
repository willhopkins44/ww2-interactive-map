const { User } = require('../mongoose/schemas/user');

const checkAdmin = async (steamId) => {
    const user = await User.findBySteamId(steamId);
    if (user && user._doc.admin) {
        return true;
    } else {
        return false;
    }
};

module.exports = checkAdmin;