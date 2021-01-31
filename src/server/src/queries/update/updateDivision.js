const mongoose = require('mongoose');
const getdivision = require('../get/getDivision');

const checkRange = async (element, data) => {
    if (!data.dataToUpdate.adminMove) {
        const changeX = Math.abs(data.pos_x - data.dataToUpdate.pos_x);
        const changeY = Math.abs(data.pos_y - data.dataToUpdate.pos_y);
        if (changeX < element.range && changeY < element.range) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

const updatedivision = async (body) => {
    let element;
    if (mongoose.Types.ObjectId.isValid(body.id)) {
        element = await getdivision(body.id);
        if (element && await checkRange(element, body)) {
            for (const data of Object.entries(body.dataToUpdate)) {
                element[data[0]] = data[1];
            }
            await element.save();
        }
    }
    return element;
}

module.exports = updatedivision;