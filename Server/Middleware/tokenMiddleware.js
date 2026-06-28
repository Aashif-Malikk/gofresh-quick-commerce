// middleware/authMiddleware.js
let secretKey = process.env.SECRET_KEY || 'defaultSecretKey'
const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
    const cookieToken = req.cookies.token || '';
    const token = cookieToken.startsWith('Bearer ')
        ? cookieToken.slice(7)
        : cookieToken

    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, secretKey);
        console.log("decoded:", decoded);

        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        console.error('Token verify error:', error.message);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;