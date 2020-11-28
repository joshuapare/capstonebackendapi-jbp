const express = require ('express');
const router = express.Router();

const User = require('../models/user');
const Exercise = require('../models/exercise');
const Workout = require('../models/workout');
const Session = require('../models/session');
const Measurement = require('../models/measurement');


router.get('/workouts', (req, res, next) => {
    const { name, id, user } = req.body;

    if (id) {
        Workout.find({_id: id, })
            .then((exercise) => res.status(200).json(exercise))
            .catch((err) => res.status(400).send(err))
    } else if (name) {
        const name =  `/${name}/i`
        Workout.find({name: name})
            .then((exercises) => res.status(200).json(exercises))
            .catch((err) => {
                console.log(err);
                res.status(400).send(err);
            });
    } else {
        Workout.aggregate([
            { 
                $addFields : {
                    "lastSessionDate": { 
                        $dateToString : { 
                            format: "%m-%d-%Y", 
                            date: $dateOfLastSession
                        } 
                    }
                } 
            },
            { $match: { user: user }}
        ]).sort({dateLastUpdated: 1})
            .then(exercises => res.status(201).send(exercises))
            .catch(err => res.status(400).send(err));
    }
});

router.post('/workout', (req, res, next) => {
    console.log(req.body);
    const { name, workout } = req.body;

    const newWorkout = new Workout({
        name: name,
        exercises: [...workout],
        dateCreated: new Date(),
        dateLastUpdated: new Date(),
        dateOfLastSession: new Date()
    });

    newWorkout.save()
        .then(() => res.status(201).send("Successfully added workout."))
        .catch((err) => res.status(400).send(err));

});

router.delete('/workout/:id', (req, res, next) => {
    res.send("workout delete route");

});

module.exports = router;