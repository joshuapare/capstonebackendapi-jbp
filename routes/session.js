const express = require ('express');
const router = express.Router();
var mongoose = require('mongoose');

const User = require('../models/user');
const Exercise = require('../models/exercise');
const Workout = require('../models/workout');
const Session = require('../models/session');
const Measurement = require('../models/measurement');
const ActiveSession = require('../models/activesession')

router.get('/active', (req, res, next) => {
    console.info("Get Active Sessions", req.query);
    ActiveSession.find({
        user: req.query.user
    })
    .then(sessions => {
        console.info("Found Sessions", sessions);
        res.status(201).send(sessions);
    })
    .catch(err => res.status(400).send(err))
});

router.get('/active/one', (req, res, next) => {
    console.info("active session get one:", req.query);
    ActiveSession.findById(req.query.sessionId)
    .then(session => {
        console.info("Found Session", session);
        res.status(201).send(session);
    })
    .catch(err => res.status(400).send(err))
});

router.get('/one', (req, res, next) => {
    console.info("session get one:", req.query);
    Session.findById(req.query.sessionId)
    .then(session => {
        console.info("Found Session", session);
        res.status(201).send(session);
    })
    .catch(err => res.status(400).send(err))
});

router.get('/week', (req, res, next) => {
    console.log("PARAMS WEEK", req.query);
    const { user, week } = req.query;

    Session.find({
        user: mongoose.Types.ObjectId(user),
        week: parseInt(week)
    })
    .then(sessions => {
        console.info("Found Sessions in Week", sessions);
        res.status(201).send(sessions);
    })
    .catch(err => {
        console.log(err)
        res.status(400).send(err)
    })
});

router.get('/', (req, res, next) => {
    console.info("Get Sessions", req.query);
    Session.find({
        user: req.query.user
    })
    .then(sessions => {
        console.info("Found Sessions", sessions);
        res.status(201).send(sessions);
    })
    .catch(err => res.status(400).send(err))
});

router.post('/complete', (req, res, next) => {

    const session = new Session(req.body.session);
    
    ActiveSession.findByIdAndDelete(req.body.session._id)
    .then(() => session.save())
    .then(() => {
        User.findByIdAndUpdate(session.user, { $set: { activesession: {} }, $push: { sessions: session }});
        res.send(session);
    })
    .catch(err => {
        console.log(err)
        res.status(401).send(err)
    });
    

});

router.post('/update', (req, res, next) => {
    console.info("Request Body", req.body);
    
    ActiveSession.findByIdAndUpdate(req.body.session._id, req.body.session)
    .then(session => res.send(session))
    .catch(err => {
        console.log(err)
        res.status(401).send(err)
    });

});

router.post('/remove', (req, res, next) => {

    ActiveSession.findByIdAndRemove(req.body.sessionId)
    .then(session => res.send(session))
    .catch(err => {
        console.log(err)
        res.status(401).send(err)
    });

});

router.post('/', (req, res, next) => {
    console.info("Request Body", req.body);
    const { name, user, _id, exercises } = req.body.workout;
    const sessionExercises = exercises.map(exercise => {
        let e = {
            exerciseId: exercise._id,
            exerciseName: exercise.exercise,
            notes: exercise.notes,
            sets: [],
            volume: 0
        }
        for (n = 0; n < exercise.sets; n++) {
            e.sets.push({
                setnumber: n+1,
                history: 'No History',
                weight: null,
                reps: null,
                complete: false,
                volume: 0
            })
        }
        return e;
    })

    const session = new ActiveSession({
        user: user,
        workoutName: name,
        workoutId: _id,
        exercises: sessionExercises,
        totalVolume: 0,
        finished: false
    });

    session.save()
        .then(() => {
            User.findByIdAndUpdate(session.user, {
                $push: { activesessions: session }
            }).then(() => res.status(201).send(session))
        })
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
        });

});

module.exports = router;