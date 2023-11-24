import { dbQuery } from '../database/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const saltRounds = 10;

const refresh = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).send({ message: 'Refresh Token is required.' });
    }

    try {
        // Verificarea validității refresh token-ului
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Generarea unui nou JWT
        const newJwtToken = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // Trimiterea noului JWT
        res.cookie('jwtToken', newJwtToken, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 3600000 // 1 hour
        });

        res.status(200).send({ message: "JWT refreshed successfully" });
    } catch (error) {
        console.error(error);
        res.status(403).send({ message: "Invalid Refresh Token" });
    }
};

const register = async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    // Check for missing fields
    if (!email || !password || !confirmPassword) {
        return res.status(400).send({ message: 'All fields are required.' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).send({ message: 'Passwords do not match.' });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send({ message: 'Invalid email format.' });
    }

    try {
        // Check for email uniqueness
        const row = await dbQuery(`SELECT email FROM users WHERE email = ?`, [email]);
        if (row) {
            return res.status(400).send({ message: 'Email is already registered.' });
        }

        // Hash the password and insert new user
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userInstance = User.build({
            email,
            password: hashedPassword,
        });
      
        await userInstance.save();

        res.status(201).send({ message: 'User registered successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error handling the request.' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    // Check for email and password in the request
    if (!email || !password) {
        return res.status(400).send({ message: 'Email and password are required.' });
    }

    try {
        // Retrieve user from the database
        const user = await dbQuery(`SELECT * FROM users WHERE email = ?`, [email]);
        if (!user) {
            return res.status(401).send({ message: 'Invalid credentials.' });
        }

        // Compare submitted password with the stored hash
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // Generate refresh token
        const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        // Store JWT token in HTTP-only cookie
        res.cookie('jwtToken', jwtToken, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 3600000 // 1 hour
        });

        // Store refresh token in HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 604800000 // 7 days
        });

        res.status(200).send({ message: "Autentificare reușită" });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error during login." });
    }
};


const logout = (req, res) => {
    if (!req.cookies.jwtToken) {
        return res.status(400).send({ message: 'Nu ești autentificat.' });
    }

    try {
        res.cookie('jwtToken', '', {
            httpOnly: true,
            expires: new Date(0)
        });

        res.status(200).send({ message: 'Deconectare reușită'});
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Eroare la deconectare.' });
    }
};

export { register, login, logout, refresh };
