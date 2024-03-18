import express from 'express';
import { createClient } from '@google/maps';

import router from "./userRoutes";

const router = express.Router();

const googleMapsClient = createClient({
    key: '',
});

router.get('/vets', (req, res) => {
    const { lat, long } = req.query
    googleMapsClient.placesNearby({
        location: [lat, long], 
        radius: 5000,
        keyword: 'veterinarian'
    }, (err, response) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching data from Google API', error: err });
        } else {
            res.status(200).json(response.json.results);
        }
    });
});

router.get('/pet-food-shops', (req, res) => {
    const { lat, long } = req.query;
    googleMapsClient.placesNearby({
        location: [lat, long],
        radius: 5000,
        keyword: 'pet food shop'
    }, callback(res));
});

router.get('/adoption-centers', (req, res) => {
    const { lat, long } = req.query;
    googleMapsClient.placesNearby({
        location: [lat, long],
        radius: 5000,
        keyword: 'pet adoption center'
    }, callback(res));
});

router.get('/groomers', (req, res) => {
    const { lat, long } = req.query;
    googleMapsClient.placesNearby({
        location: [lat, long],
        radius: 5000,
        keyword: 'pet groomer'
    }, callback(res));
});

router.get('/foster-care', (req, res) => {
    const { lat, long } = req.query;
    googleMapsClient.placesNearby({
        location: [lat, long],
        radius: 5000,
        keyword: 'pet foster care'
    }, callback(res));
});

function callback(res) {
    return (err, response) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching data from Google API', error: err });
        } else {
            res.status(200).json(response.json.results);
        }
    };
}

export default router;
