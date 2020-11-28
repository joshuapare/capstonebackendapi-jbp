const mongoose = require('mongoose');
const Session = require('./session');
const Schema = mongoose.Schema;
// const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    from: String,
    password: String,
    role: [ String ],
    birthday: Date,
    data: {
      displayName: String,
      email: String,
      photoURL: String,
      settings : {
        animations : Boolean,
        customScrollbars : Boolean,
        direction : String,
        layout : {
          config : {
            footer : {
              display : Boolean,
              position : String,
              style : String
            },
            leftSidePanel : {
              display : Boolean
            },
            mode : String,
            navbar : {
              display : Boolean,
              folded : Boolean,
              position : String
            },
            rightSidePanel : {
              display : Boolean
            },
            scroll : String,
            toolbar : {
              display : Boolean,
              position : String,
              style : String
            }
          },
          style : String
        },
        theme : {
          footer : String,
          main : String,
          navbar : String,
          toolbar : String
        }
      }
    },

    // CUSTOM ATTRIBUTES
    workouts: [{
      type: Schema.Types.ObjectId,
      ref: 'workout'
    }],
    sessions: [{
      type: Schema.Types.ObjectId,
      ref: 'session'
    }],
    measurements: [{
      type: Schema.Types.ObjectId,
      ref: 'measurement'
    }],
    activesession: {
      type: Schema.Types.ObjectId,
      ref: 'activesession'
    },
});

// // 4. Encypt and store the person's password
// UserSchema.pre('save', function (next) {
//     const user = this;
  
//     if (!user.isModified('password')) {
//       return next();
//     }
//     bcrypt.genSalt(10, (err, salt) => {
//       if (err) return next(err);
//       bcrypt.hash(user.password, salt, (hashErr, hash) => {
//         if (hashErr) return next(hashErr);  
//         user.password = hash;
//         next();
//       });
//     });
//   });

// // 5. Confirm a person's password against the stored password
// UserSchema.methods.comparePassword = function (toCompare, done) {
//     console.log("In password compare");
//     bcrypt.compare(toCompare, this.password, (err, isMatch) => {
//       if (err) done(err);
//       else {
//         console.log(toCompare);
//         console.log(this.password);
//         console.log(isMatch);
//         done(err, isMatch);
//       }
//     });
//   };

const User = mongoose.model('user', UserSchema);

module.exports = User;