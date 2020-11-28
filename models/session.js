const mongoose = require('mongoose');
const getISOWeek = require('date-fns/getISOWeek')
const getDay = require('date-fns/getDay')
const getYear = require('date-fns/getYear')
const { set } = require('../server');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
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
    volume: {
        type: Number,
        // default: function(){
        //     var workoutvolume = 0;
        //     for (exercise of this.exercises) {
        //         workoutvolume += exercise.volume;
        //     }
        //     return workoutvolume;
        // }
    }


});

SessionSchema.set('toObject', { virtuals: true });
SessionSchema.set('toJSON', { virtuals: true });

SessionSchema.pre('save', function(next){
    let tv = 0;
    this.exercises.forEach((exercise,index) => {
        let v = 0;
        exercise.sets.forEach(set => {
            v += set.volume
        })
        this.exercises[index].volume = v;
        tv += v;
    });
    this.volume = tv;
    next();
});

// SessionSchema.virtual('totalVolume').
//   get(function() {
//     var workoutvolume = 0;
//     for (exercise of this.exercises) {
//         workoutvolume += exercise.volume;
//     }
//     return workoutvolume;
//    });

// SessionSchema.virtual('week')
// .get(function() {
//       return getISOWeek(this.dateCreated);
//    });

// SessionSchema.virtual('day')
// .get(function() {
//        return getDay(this.dateCreated);
//     });

// SessionSchema.virtual('year')
// .get(function() {
//        return getYear(this.dateCreated);
//     });


const Session = mongoose.model('session', SessionSchema);

module.exports = Session;