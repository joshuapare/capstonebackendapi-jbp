const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
    name: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    exercises: [{
            exercise: String,
            exerciseid: {
                type: Schema.Types.ObjectId,
                ref: 'exercise'
            },
            sets: Number,
            notes: String
    }],
    dateCreated: Date,
    dateLastUpdated: Date,
    dateOfLastSession: Date
});

const Workout = mongoose.model('workout', WorkoutSchema);

module.exports = Workout;