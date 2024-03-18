import express from 'express';
import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

const router = express.Router();

router.use(session({
    secret: 'TOPSECRET',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 10 }
}));

router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'emailId' },
    async function (emailId, password, done) {
        try {
            const user = await User.findOne({ emailId });
            if (!user) { return done(null, false); }
            bcrypt.compare(password, user.password, function (err, res) {
                if (err) { return done(err); }
                if (res === false) { return done(null, false); }
                return done(null, user);
            });
        } catch (err) {
            return done(err);
        }
    }
));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err);
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
                    req.login(user, (err) => {
                        if (err) {
                            return res.status(500).json({ message: 'Error logging in user', error: err });
                        }
                        res.status(201).json({ message: 'User created and logged in successfully', user });
                    });
                })
                .catch(error => {
                    res.status(500).json({ message: 'Error saving user', error });
                });
        })
        .catch(error => {
            res.status(500).json({ message: 'Something went wrong', error });
        });
});

router.post('/signin', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'User authenticated' });
});

export default router;
