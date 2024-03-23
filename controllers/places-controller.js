const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');


const HttpError = require("../models/http-error");
const Place = require('../models/place');




exports.getUserPlaces = async (req, res, next) => {
    const userId = req.params.userId

    let userPlaces;

    try {
        const allPlaces = await Place.find();
        userPlaces = allPlaces.filter((place) => {
            return place.creator === userId
            });
        
    } catch (err) {
        const error = new HttpError('Something went wrond. Could not fectch user places.', 500)
        return next(error);
    }
  

    if (!userPlaces || userPlaces.length === 0){
        const error = new HttpError("Places not found for that user id.", 404);
        return next(error);
    };

    res.status(200).json({
        message: 'User places found successfully',
        places: userPlaces
    })
};


exports.getPlaceById = async (req, res, next) => {
    const placeId = req.params.placeId;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a place', 500);
        return next(error);
    }
    
    if(!place) {
        const error = new HttpError("No existing place for that id.", 404)
        return next(error);
            }
            
    res.status(200).json({
        message: 'Place found successfully',
        place: place.toObject({getters: true})
    })
};


exports.createPlace = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs.', 422)
    }

    const title = req.body.title;
    const description = req.body.description;
    const coordinates = req.body.coordinates;
    const address = req.body.address;
    const image = req.body.image;
    const creator = req.body.creator;

    const createdPlace = new Place(
        {
            title: title,
            description: description,
            image: image,
            address: address,
            location: coordinates,
            creator: creator
        }
    );

    createdPlace.save()
        .then(result => {
            res.status(200).json({
                message: "Place successfully created",
                place: result
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode =500
            }
            next(err)
        })

    
};



exports.editPlace = async (req, res, next) => {

    const placeId = req.params.placeId;
    console.log('place id', placeId)
    let placeToEdit;

    placeToEdit = await Place.findById(placeId)

    if (!placeToEdit) {
        throw new HttpError('Could not find place under this id.', 404)
    }
    console.log('le body', req.body)
    const editedTitle = req.body.title;
    const editedDescription = req.body.description;

    placeToEdit.title = editedTitle
    placeToEdit.description = editedDescription

    await placeToEdit.save();

    res.status(200).json(
        {
            message: 'Place successfully edited.',
            place: placeToEdit
         }
    )

};










exports.deletePlace = async (req, res, next) => {
    const placeId = req.params.placeId

    let placeToDelete;

    try {
        placeToDelete = await Place.findById(placeId)

        if (!placeToDelete) {
            const error = new HttpError('No existing place for that id.', 404);
            return next(error);
        }

        await Place.findByIdAndDelete(placeId)  
        
        res.status(200).json({
            message: 'Place successfully deleted.',
            places: placeToDelete.toObject({getters: true})
        })
        
    } catch (err) {
        const error = new HttpError('Failed to delete place.', 500)
        return next(error);
    }
 };
  

