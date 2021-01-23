const { Location } = require('../mongoose/schemas/location');

const createLocation = async (data, userId) => {
    const newLocation = new Location({
        name: data.name,
        pos_x: data.pos_x,
        pos_y: data.pos_y
    });
    newLocation.save(function(err, newLocation) {
        if (err) console.error(err);
    });

    return newLocation
};

module.exports = createLocation;