const mongoose = require('mongoose');
const getISOWeek = require('date-fns/getISOWeek')
const getDay = require('date-fns/getDay')
const getYear = require('date-fns/getYear')
const { set } = require('../server');
const Schema = mongoose.Schema;

const ActiveSessionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    week: {
        type: Number,
        default: function() {
            return getISOWeek(this.dateCreated)
        }
    },
    day: {
        type: Number,
        default: function() {
            return getDay(this.dateCreated)
        }
    },
    year: {
        type: Number,
        default: function() {
            return getYear(this.dateCreated)
        }
    },
    workoutName: String,
    workoutId: {
        type: Schema.Types.ObjectId,
        ref: 'workout'
    },
    exercises: [{
        exerciseId: {
            type: Schema.Types.ObjectId,
            ref: 'exercise'
        },
        exerciseName: String,
        notes: String,
        sets: [{
            setnumber: Number, 
            history: String, 
            weight: Number, 
            reps: Number,
            volume: Number,
            complete: Boolean
        }],
        volume: Number
    }],
});

const ActiveSession = mongoose.model('activesession', ActiveSessionSchema);

module.exports = ActiveSession;