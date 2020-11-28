const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MeasurementSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    dateAdded: Date,
    age: Number,
    weight: Number,
    height: Number,
    bodyFatML: Number,
    bodyFatNavy: Number,
    neck: Number,
    chest: Number,
    abdomen: Number,
    hip: Number,
});

const Measurement = mongoose.model('measurement', MeasurementSchema);

module.exports = Measurement;