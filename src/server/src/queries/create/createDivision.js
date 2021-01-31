const { Division } = require('../../mongoose/schemas/division');

const createdivision = async (data, userId) => {
    const newdivision = new Division({
        name: data.name,
        pos_x: data.pos_x,
        pos_y: data.pos_y,
        stance: 'Neutral',
        range: 50,
        strength: 100,
        equipment: 50,
        organization: 100,
        experience: 30
    });
    newdivision.save(function(err, newdivision) {
        if (err) console.error(err);
    });

    return newdivision;
};

module.exports = createdivision;