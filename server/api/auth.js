const express = require('express');
const app = express.Router();
const { authenticate, register} = require('../db/auth');
const { isLoggedIn } = require('./middleware');

app.post('/register', async (req, res, next) => {
  try {
    const user = await register(req.body);
    res.send(user);
  } catch (error) {
    next(error);
  }
})

app.post('/login', async (req, res, next) => {
  try {
    const token = await authenticate(req.body);
    res.send({token});
  } catch (error) {
    next(error);
  }
})
//get/api/auth/me
app.get('/me', isLoggedIn, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
})

module.exports = app;