const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Import necessary modules
const { body, validationResult } = require('express-validator');

// Registration Controller
exports.register = [
    // Validations
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email')
        .isEmail().withMessage('Email is not valid')
        .custom(async (email) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('Email already in use');
            }
        }),
    body('phone').not().isEmpty().withMessage('Phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    // Handle the request after validation and sanitization
    async (req, res) => {
        const errors = validationResult(req);

        // If there are validation errors, return them to the client
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Otherwise, proceed with user registration
        const { name, email, phone, password } = req.body;

        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user instance
            const newUser = new User({
                name,
                email,
                phone,
                password: hashedPassword,
            });

            // Save the user to the database
            await newUser.save();

            // Respond with the newly created user (or a success message)
            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
];


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).send('Email or password is wrong');

        // Check if the password is valid
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).send('Invalid password');

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, 'secret_key');

        // Return the token along with the login message
        res.status(200).json({
            message: 'Logged in!',
            token: token
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};


exports.viewProfile = async (req, res) => {
    const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
    });
    res.send(user);
};

exports.updateProfile = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        const user = await User.findByPk(req.user.id);

        if (email) {
            const emailExists = await User.findOne({ where: { email } });
            if (emailExists && emailExists.id !== user.id) {
                return res.status(400).send('Email already exists');
            }
            user.email = email;
        }

        if (phone) {
            if (phone.length !== 10) {
                return res.status(400).send('Phone number must be 10 digits');
            }
            user.phone = phone;
        }

        if (name) user.name = name;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.send(user);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

