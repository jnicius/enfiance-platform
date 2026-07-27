

const jwt = require('jsonwebtoken');

module.exports = function (
  req,
  res,
  next
) {

  try {

    const authHeader =
      req.headers.authorization;

    console.log(
      'AUTH HEADER:',
      authHeader
    );

    if (!authHeader) {

      return res.status(401).json({
        success: false,
        message:
          'No token provided',
      });
    }

    const token =
      authHeader.split(' ')[1];

    if (!token) {

      return res.status(401).json({
        success: false,
        message:
          'Invalid token',
      });
    }

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    console.log(
      'DECODED USER:',
      decoded
    );

    req.user = decoded;

    next();

  } catch (error) {

    console.log(
      'JWT ERROR:',
      error.message
    );

    return res.status(401).json({
      success: false,
      message:
        'Unauthorized',
    });
  }
};
