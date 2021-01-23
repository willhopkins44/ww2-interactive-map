const express = require('express');
const router = express.Router();

const getAllElements = require('../queries/getAllElements');

router.get('/mapElement', async (req, res) => {
    if (req.query.type) {
        let response;
        switch(req.query.type) {
            case 'all':
                // return all map elements
                response = await getAllElements();
                // console.log(elements);
                break;
            default:
                res.status(404).send('Invalid element type');
                break;
        }
        res.status(200).send(response);
    }
    res.status(500).send();
});

module.exports = router;