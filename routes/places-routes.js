const express = require('express');
const { check } = require('express-validator');

const placesController = require('../controllers/places-controller');

const router = express.Router();

// GET /api/places/user/:userId
router.get('/user/:userId', placesController.getUserPlaces );

// GET /api/places/:placeId
router.get('/:placeId', placesController.getPlaceById);

// POST /api/places/new-place
router.post(
    '/new-place',
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5}),
        check('address').not().isEmpty()
    ],
    placesController.createPlace);

// PATCH /api/places/:placeId/edit    
router.patch('/:placeId/edit', 
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5}),
    ],
    placesController.editPlace
)

// DELETE /api/places/:placeId/delete-place
router.delete('/:placeId/delete-place', placesController.deletePlace);

module.exports = router;