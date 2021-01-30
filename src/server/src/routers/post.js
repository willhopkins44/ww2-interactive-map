const express = require('express');
const router = express.Router();

const isAuthorized = require('../authentication/isAuthorized');

const createRegiment = require('../queries/createRegiment');
const createLocation = require('../queries/createLocation');

const deleteRegiment = require('../queries/deleteRegiment');
const deleteLocation = require('../queries/deleteLocation');

const updateRegiment = require('../queries/update/updateRegiment');
const updateLocation = require('../queries/update/updateLocation');

router.post('/mapElement', async (req, res) => {
    if (req.query.method) {
        switch (req.query.method) {
            case 'create':
                await create(req, res);
                break;
            case 'delete':
                await deletion(req, res);
                break;
            case 'update':
                await update(req, res);
                break;
            case 'default':
                res.status(400)
                res.write('Invalid mapElement query');
        }
    } else {
        res.status(400)
        res.write('Invalid mapElement query');
    }
    res.send();
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
                    res.status(400)
                    res.write('Invalid element type');
            }
            res.status(200)
            res.write(JSON.stringify(createdElement));
        } else {
            res.status(500);
        }
    }
    res.send();
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
                    res.status(400);
                    res.write('Invalid element type');
            }
            if (deleted) {
                res.status(200);
            } else {
                res.status(400);
                res.write('Invalid element id');
            }
        } else {
            res.status(500);
        }
        res.send();
    }
}

const update = async (req, res) => {
    if (await isAuthorized(req, res)) {
        if (req.body && req.body.type && req.body.id) {
            let updatedElement;
            switch (req.body.type) {
                case 'regiment':
                    updatedElement = await updateRegiment(req.body);
                    break;
                case 'location':
                    updatedElement = await updateLocation(req.body);
                    break;
                case 'default':
                    res.status(404);
                    res.write('Invalid element type');
            }
            if (updatedElement) {
                res.status(200);
                res.write(JSON.stringify(updatedElement));
            } else {
                res.status(404);
            }
        } else {
            res.status(500);
        }
        res.send();
    }
}

module.exports = router;