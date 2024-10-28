const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY

const generateToken = (userId) => {
    return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '30d' });
};

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({
            status: false,
            message: 'Access denied. No token provided.',
        });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: 'Invalid token.',
        });
    }
};

module.exports = { generateToken, verifyToken };
