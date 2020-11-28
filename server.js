const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const userRoutes = require('./routes/user');
const exerciseRoutes = require('./routes/exercise');
const measurementRoutes = require('./routes/measurement');
const workoutRoutes = require('./routes/workout');
const sessionRoutes = require('./routes/session');
const authRoutes = require('./routes/auth');

mongoose.connect(process.env.MONGO_ATLAS, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.Promise = global.Promise;
mongoose.set('returnOriginal', false);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/exercise', exerciseRoutes);
app.use('/api/measurement', measurementRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/session', sessionRoutes);

const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on Port: " + process.env.PORT || 3000);
});

module.exports = app;
