const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]; // Authorization: Bearer <token>
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;