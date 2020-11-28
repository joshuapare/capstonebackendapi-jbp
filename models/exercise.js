const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
    name: String,
    primaryMuscleGroup: String,
    secondaryMuscleGroups: [String],
    type: String
});

const Exercise = mongoose.model('exercise', ExerciseSchema);

module.exports = Exercise;