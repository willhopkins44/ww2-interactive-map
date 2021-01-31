const express = require('express');
const router = express.Router();

const getAllElements = require('../queries/get/getAllElements');
const getDivision = require('../queries/get/getDivision');
const getLocation = require('../queries/get/getLocation');
const isAuthorized = require('../authentication/isAuthorized');

router.get('/mapElement', async (req, res) => {
    if (req.query.type) {
        let response;
        switch(req.query.type) {
            case 'all':
                response = await getAllElements();
                break;
            case 'division':
                response = await getDivision(req.query.id);
                break;
            case 'location':
                response = await getLocation(req.query.id);
                break;
            default:
                res.status(404).send('Invalid element type');
                break;
        }
        if (response) {
            res.status(200);
            res.write(JSON.stringify(response));
        } else {
            res.status(404);
            res.write('Element ID not found');
        }
    }
    res.send();
});

router.get('/isAdmin', async (req, res) => {
    if (await isAuthorized(req, res)) {
        res.status(200);
        res.write('Authorized');
    }
    res.send();
});

router.get('/steamId', async (req, res) => {
    if (req.session && req.session.passport && req.session.passport.user) {
        res.status(200);
        res.write(req.session.passport.user);
    } else {
        res.status(401);
        res.write('User not logged in');
    }
    res.send();
})

module.exports = router;