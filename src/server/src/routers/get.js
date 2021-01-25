const express = require('express');
const router = express.Router();

const getAllElements = require('../queries/getAllElements');
const isAuthorized = require('../authentication/isAuthorized');

router.get('/mapElement', async (req, res) => {
    if (req.query.type) {
        let response;
        switch(req.query.type) {
            case 'all':
                response = await getAllElements();
                break;
            default:
                res.status(404).send('Invalid element type');
                break;
        }
        res.status(200).json(response);
    }
    res.status(500).send();
});

router.get('/isAdmin', async (req, res) => {
    if (await isAuthorized(req, res)) {
        res.status(200);
        res.write('Authorized');
    }
    res.send();
});

module.exports = router;