import express from 'express';
import { createClient } from '@google/maps';
import dotenv from 'dotenv';
import requestIp from 'request-ip';

dotenv.config();

const router = express.Router();

const googleMapsClient = createClient({
    key: process.env.API_KEY,
});

// Middleware to get client's IP address
const getClientIp = (req) => {
    const ipAddress = requestIp.getClientIp(req);
    return ipAddress === '::1' ? '8.8.8.8' : ipAddress; // Replace '::1' with your local IP if needed
};

// Middleware to get location based on IP address
const getLocationFromIp = async (req, res, next) => {
    googleMapsClient.geolocate({ considerIp: true }, (err, response) => {
        if (err) {
            console.error('Error getting location from IP:', err);
            req.location = { lat: 0, long: 0 }; // Default to (0, 0) if location cannot be determined
        } else {
            const { lat, lng } = response.json.location;
            req.location = { lat, long: lng };
        }
        next();
    });
};

router.get('/vets', getLocationFromIp, (req, res) => {
    const { lat, long } = req.location;
    googleMapsClient.placesNearby({
        location: [lat, long],
        radius: 5000,
        keyword: 'veterinarian'
    }, callback(res));
});

router.get('/pet-food-shops', getLocationFromIp, (req, res) => {
    const { lat, long } = req.location;
    googleMapsClient.placesNearby({
        location: [lat, long],
        radius: 5000,
        keyword: 'pet food shop'
    }, callback(res));
});

router.get('/adoption-centers', getLocationFromIp, (req, res) => {
    const { lat, long } = req.location;
    googleMapsClient.placesNearby({
        location: [lat, long],
        radius: 5000,
        keyword: 'pet adoption center'
    }, callback(res));
});

router.get('/groomers', getLocationFromIp, (req, res) => {
    const { lat, long } = req.location;
    googleMapsClient.placesNearby({
        location: [lat, long],
        radius: 5000,
        keyword: 'pet groomer'
    }, callback(res));
});

router.get('/foster-care', getLocationFromIp, (req, res) => {
    const { lat, long } = req.location;
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
