const jwt = require('jsonwebtoken');
const User = require('../models/user'); // match exact file name

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user object to request (exclude password)
      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      console.error('Token error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
