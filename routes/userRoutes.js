import express from 'express';
import { User } from '../models/userModel.js';

const router = express.Router();

router.post('/signup', (req, res) => {
    const { emailId, password } = req.body;

    User.findOne({ emailId })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const user = new User({ emailId, password });

            user.save()
                .then(user => {
                    res.status(201).json({ message: 'User created successfully', user });
                })
                .catch(error => {
                    res.status(500).json({ message: 'Error saving user', error });
                });
        })
        .catch(error => {
            res.status(500).json({ message: 'Something went wrong', error });
        });
});


router.post('/signin', (req, res) => {
    const { emailId, password } = req.body;

    User.findOne({ emailId })
        .then(existingUser => {
            if (!existingUser) {
                return res.status(400).json({ message: 'User does not exist' });
            }

            if (existingUser.password !== password) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            res.status(200).json({ message: 'User signed in successfully', existingUser });
        })
        .catch(error => {
            res.status(500).json({ message: 'Something went wrong', error });
        });
});

export default router;