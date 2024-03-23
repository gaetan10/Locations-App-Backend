const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const HttpError = require('./models/http-error')
const placesRoutes = require('./routes/places-routes')
const userRoutes = require('./routes/user-routes')

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next(); // Call next() to pass control to the next middleware or route handler
});


app.use('/api/places', placesRoutes);

app.use('/api/users', userRoutes);

app.use((req, res, next) => {
    throw new HttpError("404 - Could not find this route.", 404)
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({
        message: error.message || 'An unknown error occured'
    })
});


mongoose
    .connect('mongodb+srv://gaetanmay:KN5TfVwMUHHVySox@cluster0.gp4hg29.mongodb.net/mern?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        app.listen(4000);
    })
    .catch(err => {
        console.log(err)
    });
