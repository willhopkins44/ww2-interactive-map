const express = require('express');
const router = express.Router();

// const checkAdmin = require('../authentication/checkAdmin');
const isAuthorized = require('../authentication/isAuthorized');

const createRegiment = require('../queries/createRegiment');
const createLocation = require('../queries/createLocation');

const deleteRegiment = require('../queries/deleteRegiment');
const deleteLocation = require('../queries/deleteLocation');

router.post('/mapElement', async (req, res) => {
    if (req.query.method) {
        switch (req.query.method) {
            case 'create':
                await create(req, res);
                break;
            case 'delete':
                await deletion(req, res);
                break;
            case 'default':
                res.status(400).send('Invalid mapElement query');
        }
    } else {
        res.status(400).send('Invalid mapElement query');
    }
});

const create = async (req, res) => {
    if (await isAuthorized(req, res)) {
        if (req.body && req.body.type) {
            let createdElement;
            switch(req.body.type) {
                case 'regiment':
                    createdElement = await createRegiment(req.body);
                    break;
                case 'location':
                    createdElement = await createLocation(req.body);
                    break;
                default:
                    res.status(400).send('Invalid element type');
                    // break;
            }
            res.status(200).send(createdElement);
        } else {
            res.status(500).send();
        }
    }
}

const deletion = async (req, res) => {
    if (await isAuthorized(req, res)) {
        if (req.body && req.body.type && req.body.id) {
            let deleted;
            switch (req.body.type) {
                case 'regiment':
                    deleted = await deleteRegiment(req.body.id);
                    break;
                case 'location':
                    deleted = await deleteLocation(req.body.id);
                    break;
                case 'default':
                    // res.status(400).send('Invalid element type');
                    res.status(400);
                    res.write('Invalid element type');
            }
            if (deleted) {
                // res.status(200).send();
                res.status(200);
            } else {
                // res.status(400).send('Invalid element id');
                res.status(400);
                res.write('Invalid element id');
            }
        } else {
            // res.status(500).send();
            res.status(500);
        }
        res.send();
    }
}

module.exports = router;