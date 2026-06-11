import jwt from 'jsonwebtoken';

// 1. Check if the user is authenticated via JWT
export const verifyToken = (req, res, next) => {
    // Look for the Authorization header (Format: Bearer <TOKEN>)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        // Decode and verify token using your hidden JWT_SECRET key
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = verified; // Appends user data (id, email, role) to the request object
        next(); // Pass control to the next function in line
    } catch (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid or Expired Access Token' });
    }
};

// 2. Role-Based Access Control (RBAC) Guard
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if the user's role is included in the permitted list
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' });
        }
        next();
    };
};