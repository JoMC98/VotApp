const express = require('express');
const router = express.Router();
const model = require('../../helpers/pushController.js');


function rutado() {
    router.post('/subscription', (req, res) => {
        //TODO PUSH subscription
        //res.status(200).json({status: 'ok'});
        model.addSubscription(req)
            .then(() => {
                res.status(200).json({status: 'ok'});
            }).catch((err) => {
                res.status(500).json({error: err});
            })
    })

    return router;
}

module.exports = rutado;