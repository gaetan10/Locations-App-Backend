const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        image: {type: String, required: false},
        address: {type: String, required: true} ,
        location: {
            lat: {type: Number, required: false},
            long: {type: Number, required: false}
        },
        creator: {type: String, required: true} ,
    }
);

module.exports = mongoose.model('Place', placeSchema);