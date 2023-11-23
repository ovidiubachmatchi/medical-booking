import jwt from 'jsonwebtoken';

const verifyAdmin = (req, res, next) => {
    const token = req.cookies.jwtToken;
    if (!token) {
        return res.status(403).send({ message: "Autentificare necesară." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded);
        if (decoded.admin === 0) {
            return res.status(403).send({ message: "Acces restricționat doar pentru administratori." });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send({ message: "Token invalid" });
    }
};

export { verifyAdmin };
