import express from 'express';
import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy} from 'passport-local';

const router = express.Router();
router.use(session({
    secret: 'TOPSECRET',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 10 } 
}));

router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'emailId' },
    function (emailId, password, done) {
        User.findOne({ emailId }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            bcrypt.compare(password, user.password, function (err, res) {
                if (err) { return done(err); }
                if (res === false) { return done(null, false); }
                return done(null, user);
            });
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

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
                    res.status(201).json({ message: 'User created successfully', user } );
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
        .then(user => {
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) {
                        return res.status(400).json({ message: 'Invalid password' });
                    }

                    res.json({ message: 'User authenticated' });
                })
                .catch(error => {
                    res.status(500).json({ message: 'Error comparing password', error });
                });
        })
        .catch(error => {
            res.status(500).json({ message: 'Something went wrong', error });
        });
});


export default router