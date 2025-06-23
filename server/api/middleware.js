const { findUserByToken } = require('../db/auth');

const isLoggedIn = async (req, res, next) => {
  try {
    const user = await findUserByToken(req.headers.authorization);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  isLoggedIn
}