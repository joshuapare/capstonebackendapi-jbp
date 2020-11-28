const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');

function authenticate(req, res, next) {
  console.log("Authentication Reached");
  console.log(req.body);
  User.findOne({
      'data.email': req.body.email
    })
    .exec()
    .then((user) => {
      console.log("returned user from query:");
      console.log(user);
      if (!user) return next();
      user.comparePassword(req.body.password, (e, isMatch) => {
        console.log("in comparePassword");
        if (e) return next(e);
        if (isMatch) {
          console.log("Passwords Matched");
          console.log(user);
          req.user = user;
          next();
        } else {
          return next();
        }
      });
    }, (e) => next(e))
}

function generateToken(req, res, next) {
  console.log("generate Token Reached");
  console.log(req.user);
    if (!req.user) return next();
  
    const jwtPayload = {
      id: req.user._id
    };
    const jwtData = {
      expiresIn: config.JWT_DURATION,
    };
    const secret = config.TOKEN_SECRET;
    req.access_token = jwt.sign(jwtPayload, secret, jwtData);
  
    next();
  }

  function respondJWT(req, res) {
    console.log("respondJWT Reached");
    console.log(req.user)
    if (!req.user) {
      console.log("error in respondjwt");
      res.status(401).json({
        error: 'Unauthorized'
      });
    } else {
      console.log("token created");
      console.log(req.access_token);
      res.status(200).send({
        user: req.user,
        token: req.access_token
      });
    }
  }

  function verifyToken(req, res) {
    console.log("verifyToken reached")
    const { access_token } = req.query;
    jwt.verify(access_token, config.TOKEN_SECRET, (err, verifiedJwt) => {
      if(err){
        res.send(err.message);
      }else{
        const { id } = verifiedJwt;
        User.findById(id)
        .then((user) => {
          res.status(200).send({
            user: user,
            token: access_token
          });
        })
        .catch((err) => {
          res.status(401).json({
            error: 'No User Found'
          });
        })
      }
    })
    
  }

exports.authenticate = authenticate;
exports.generateToken = generateToken;
exports.respondJWT = respondJWT;
exports.verifyToken = verifyToken;