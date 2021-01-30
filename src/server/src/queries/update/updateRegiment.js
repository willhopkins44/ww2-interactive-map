const mongoose = require('mongoose');
const { Regiment } = require('../../mongoose/schemas/regiment');
const getRegiment = require('../getRegiment');

const updateRegiment = async (body) => {
    // let element;
    // if (mongoose.Types.ObjectId.isValid(body.id)) {
    //     // element = Regiment.findOneAndUpdate({id: req.body.id}, )
    //     console.log(body);
    //     const filter = { id: body.id };
    //     let update = {};
    //     for (const data of Object.entries(body.dataToUpdate)) {
    //         console.log(data);
    //         update[data[0]] = data[1];
    //     }
    //     console.log(update);
    //     element = Regiment.findOneAndUpdate(filter, update, { new: true });
    // }
    // return element;
    let element;
    if (mongoose.Types.ObjectId.isValid(body.id)) {
        element = await getRegiment(body.id);
        if (element) {
            for (const data of Object.entries(body.dataToUpdate)) {
                element[data[0]] = data[1];
            }
            await element.save();
        }
    }
    return element;
}

module.exports = updateRegiment;