// middleware/auth.js snippet
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // Check for 'Bearer <token>' in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user's ID to the request object
            req.user = decoded.id; // Counselor ID is now available as req.user

            next(); // Move to the next middleware or route handler

        } catch (error) {
            console.error('JWT Error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = protect;
