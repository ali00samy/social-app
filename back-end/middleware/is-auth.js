const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'secret');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};


// const jwt = require('jsonwebtoken');

// module.exports = function (req, res, next) {
//   const token = req.header('x-auth-token');
//   if (!token) return res.status(401).send('Access denied. No token provided.');

//   try {
//     const decoded = jwt.verify(token, 'secret');
//     req.user = decoded; 
//     next();
//   }
//   catch (ex) {
//     res.status(400).send('Invalid token.');
//   }
// }
