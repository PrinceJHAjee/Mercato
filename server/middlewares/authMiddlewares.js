const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // get token from header
    const token = req.header("authorization").split(" ")[1];
    console.log('Token:', token); // Add this line
    if (!token) {
        throw new Error('Access denied, token missing!');
    }
    const decryptedToken = jwt.verify(token, process.env.jwt_secret);
    console.log('Decrypted Token:', decryptedToken); // Add this line
    req.body.userId = decryptedToken.UserId;
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message); // Add this line
    if (error.name === 'TokenExpiredError') {
        return res.status(401).send({
            success: false,
            message: 'Session has expired. Please log in again.',
        });
    }
    res.status(401).send({
        success: false,
        message: 'Token verification failed',
        error: error.message,
    });
  }
};