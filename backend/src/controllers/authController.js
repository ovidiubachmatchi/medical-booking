import dbQuery from '../database/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 10;

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
        await dbQuery(`INSERT INTO users (email, parola) VALUES (?, ?)`, [email, hashedPassword]);
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
        const match = await bcrypt.compare(password, user.parola);
        if (!match) {
            return res.status(401).send({ message: 'Invalid credentials.' });
        }
        // Initialize user session
        const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        
        res.cookie('jwtToken', jwtToken, {
            httpOnly: true,
            secure: false, // local development is http only
            maxAge: 3600000 // 1 hour
        });
    
        res.status(200).send({ message: "Autentificare reușită"});

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

export { register, login, logout };
