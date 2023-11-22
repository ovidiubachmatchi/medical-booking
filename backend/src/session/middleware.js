// middleware to check jwt token everytime
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwtToken;
    if (!token) {
        return res.status(403).send({ message: "You need first to login" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send({ message: "Token invalid"});
    }
    return next();
};

export {verifyToken};