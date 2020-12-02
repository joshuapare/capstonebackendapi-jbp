const express = require ('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const axios = require('axios');

const User = require('../models/user');

const jwtConfig = {
	secret: process.env.TOKEN_SECRET,
	expiresIn: '2 days' // A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc)
};

router.get('/', (req, res, next) => {
  const { email, password } = req.query;
  console.info("Email:", email);


  User.findOne({ 'data.email' : email })
    .then(user => {
      console.info("User:", user);

      const error = {
        email: user ? null : 'Check your username/email',
        password: user && user.password === password ? null : 'Check your password'
      };

      if (!error.email && !error.password && !error.displayName) {
        delete user.password;

        const access_token = jwt.sign({ id: user._id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

        const response = {
          user,
          access_token
        };
        console.log("Response Reached", response);
        res.status(200).send(response);
      } else {
        console.log("Error Reached", error);
        res.status(200).send(error);
      }
    }).catch(err => console.log(err));

});

router.get('/access-token', (req, res, next) => {
  console.info("Inside Access Token", req.query)
	const { access_token } = req.query;

	try {
		const { id } = jwt.verify(access_token, jwtConfig.secret);

    User.findById(id)
      .then(user => {
        delete user.password;

        const updatedAccessToken = jwt.sign({ id: user._id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

        const response = {
          user,
          access_token: updatedAccessToken
        };

        res.status(200).json(response);
      }).catch(err => res.status(401).send(err));
		
	} catch (e) {
		const error = 'Invalid access token detected';
		res.status(401).send(error);
	}
});

router.post('/register', (req, res, next) => {
	const { displayName, password, email } = req.body;
  User.findOne({ 'data.email' : email })
    .then(user => {

      const error = {
        email: user ? 'The email is already in use' : null,
        displayName: displayName !== '' ? null : 'Enter display name',
        password: null
      };

      if (!error.displayName && !error.password && !error.email) {

        const user = new User({
          from: 'jwt',
          password,
          role: 'admin',
          data: {
            displayName,
            photoURL: 'assets/images/avatars/profile.jpg',
            email,
            settings: {},
            shortcuts: []
          }
        });
    
        user.save()
          .then(() => {
            delete user.password;
    
            const access_token = jwt.sign({ id: user._id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
        
            const response = {
              user,
              access_token
            };

            res.status(200).json(response);

          })
      } else res.status(200).json(error);

    }).catch(err => res.status(401).send(err));
});

router.post('/user/update', (req, res, next) => {
  const { user } = req.body;

  User.findByIdAndUpdate(user._id, user)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(401).send(err));

});

module.exports = router;