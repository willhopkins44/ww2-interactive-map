const { Regiment } = require('../mongoose/schemas/regiment');

const createRegiment = async (data, userId) => {
    const newRegiment = new Regiment({
        name: data.name,
        pos_x: data.pos_x,
        pos_y: data.pos_y,
        stance: 'Neutral',
        command: userId
    });
    newRegiment.save(function(err, newRegiment) {
        if (err) console.error(err);
    });
};

module.exports = createRegiment;