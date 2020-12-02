const express = require ('express');
const router = express.Router();
var mongoose = require('mongoose');


const User = require('../models/user');
const Exercise = require('../models/exercise');
const Workout = require('../models/workout');
const Session = require('../models/session');
const Measurement = require('../models/measurement');

router.get('/week', (req, res, next) => {
    const { user } = req.query;

    Measurement.aggregate([
        { $match: {
            $and: [
                { dateAdded: {$gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000)}},
                {user : mongoose.Types.ObjectId(user)}
            ]
        }
    }      
    ]).then(measurements => res.status(201).send(measurements))
    .catch(err => res.status(400).send(err));
});

router.get('/all', (req, res, next) => {
    const { user } = req.query;
    console.info('Get all Measurements', user);


    Measurement.find({user : mongoose.Types.ObjectId(user)})
    .then(measurements => res.status(201).send(measurements))
    .catch(err => res.status(400).send(err));

});

router.get('/', (req, res, next) => {
    res.send("measurement get route");
});

router.post('/', (req, res, next) => {
    console.log(req.body);
    const { user, bodyFatNavy } = req.body
    const { age, weight, height, neck, chest, abdomen, hip } = req.body.measurements;

    const measurement = new Measurement({
        user: user,
        bodyFatNavy: bodyFatNavy,
        age: age,
        weight: weight,
        height: height,
        neck: neck,
        chest: chest,
        abdomen: abdomen,
        hip: hip,
        dateAdded: new Date()
    });

    measurement.save()
    .then(() => {
        User.findByIdAndUpdate(user, {
            $push: { measurements: measurement }
        }).then(() => res.status(201).send(measurement))
    })
    .catch(err => {
        console.log(err);
        res.status(400).send(err);
    });

});

router.delete('/:id', (req, res, next) => {
    res.send("measurement delete route");

});

module.exports = router;