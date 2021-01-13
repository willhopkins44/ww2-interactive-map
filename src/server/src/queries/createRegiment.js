const { Regiment } = require('../mongoose/schemas/regiment');
const { User } = require('../mongoose/schemas/user');

const createRegiment = async (data, userId) => {
    const user = await User.findBySteamId(userId);
    if (user && user._doc.admin) {
        const newRegiment = new Regiment({
            name: data.name,
            pos_x: data.pos_x,
            pos_y: data.pos_y,
            stance: 'Neutral',
            command: user
        });
        newRegiment.save(function(err, newRegiment) {
            if (err) console.error(err);
        });
    }
};

module.exports = createRegiment;