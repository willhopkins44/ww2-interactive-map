const express = require('express');
const router = express.Router();

const checkAdmin = require('../authentication/checkAdmin');

const createRegiment = require('../queries/createRegiment');
const createLocation = require('../queries/createLocation');

router.post('/mapElement', async (req, res) => {
    if (!(req.session && req.session.passport && await checkAdmin(req.session.passport.user))) {
        if (req.session && req.session.passport) {
            res.status(403).send('Forbidden');
        } else {
            res.status(401).send('Unauthorized');
        }
        return;
    }
    if (req.body && req.body.type) {
        let response;
        switch(req.body.type) {
            case 'regiment':
                response = await createRegiment(req.body);
                break;
            case 'location':
                response = await createLocation(req.body);
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