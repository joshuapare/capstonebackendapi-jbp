const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');

const User = require('../models/user');
const Exercise = require('../models/exercise');
const Workout = require('../models/workout');
const Session = require('../models/session');
const Measurement = require('../models/measurement');
const { Schema } = require('mongoose');

// EXERCISE

router.get('/workouts', (req, res, next) => {
    console.log("Workouts Reached");
    console.info("Get Workouts", req.query);
    const { name, id, user } = req.query;

    if (id) {
        Workout.findById(id)
            .then((workouts) => res.status(200).json(workouts))
            .catch((err) => res.status(400).send(err))
    } else if (name) {
        const name =  `/${name}/i`
        Workout.find({name: name})
            .then((workouts) => res.status(200).json(workouts))
            .catch((err) => {
                console.log(err);
                res.status(400).send(err);
            });
    } else {
        Workout.aggregate([
            { "$match": { user : mongoose.Types.ObjectId(user) }},
            { "$addFields": {
                "lastSessionDate": { 
                    "$dateToString": { 
                        "format": "%m-%d-%Y", 
                        "date": "$dateOfLastSession" 
                        } 
                    }
                } 
            }
        ]).sort({dateLastUpdated: 1})
            .then(workouts => res.status(201).send(workouts))
            .catch(err => res.status(400).send(err));
    }
});

// WORKOUT ROUTES
router.post('/workout/new', (req, res, next) => {
    console.info(req.body);
    const { user } = req.body;

    const newWorkout = new Workout({
        user: user,
        name: '',
        exercises: [
            {exercise: 'Choose Exercise', exerciseid: null, sets: '', notes: ''}
        ],
        dateCreated: new Date(),
        dateLastUpdated: new Date(),
        dateOfLastSession: new Date()
    });

    newWorkout.save()
        .then(() => res.status(201).send(newWorkout))
        .catch((err) => res.status(400).send(err));

});

router.get('/workout', (req, res, next) => {
    console.info("GET workout", req.query);
    const { workoutId } = req.query;

    Workout.findById(workoutId)
        .then((workout) => {
            console.info("Workout found:", workout);
            res.status(200).json(workout)
        })
        .catch((err) => res.status(400).send(err))
});

router.post('/workout', (req, res, next) => {
    console.info("Post Workout", req.body);
    const { _id } = req.body;

    Workout.findByIdAndUpdate(_id, req.body)
        .then(() => res.status(201).send("Success"))
        .catch((err) => res.status(400).send(err));

});

router.delete('/workout/:id', (req, res, next) => {
    res.send("workout delete route");

});

router.get('/exercises', (req, res, next) => {

    Exercise.find().sort({name: 1})
        .then((exercises) => res.status(201).send(exercises))
        .catch((err) => res.status(400).send(err));
});

router.get('/exercise', (req, res, next) => {
    console.info("Get Exercise/", req.params);
    const { name, id } = req.body;

    if (id) {
        Exercise.findById(id)
            .then((exercise) => res.status(200).json(exercise))
            .catch((err) => res.status(400).send(err))
    } else if (name) {
        const name =  `/${name}/i`
        Exercise.find({name: name})
            .then((exercises) => res.status(200).json(exercises))
            .catch((err) => {
                console.log(err);
                res.status(400).send(err);
            });
    } else {
        Exercise.find().sort({name: 1})
            .then((exercises) => res.status(201).send(exercises))
            .catch((err) => res.status(400).send(err));
    }
});

router.post('/', (req, res, next) => {
    const { name, primaryMuscleGroup, secondaryMuscleGroups, type } = req.body;

    const exercise = new Exercise({
        name: name,
        primaryMuscleGroup: primaryMuscleGroup,
        secondaryMuscleGroups: secondaryMuscleGroups,
        type: type
    });

    exercise.save()
        .then(() => res.status(201).send('Exercise created successfully'))
        .catch((err) => {
            console.log(err);
            res.status(400).send(err);
        });

});

router.delete('/:id', (req, res, next) => {
    res.send("exercise delete route");

});

module.exports = router;