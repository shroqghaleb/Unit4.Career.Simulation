const express = require('express');
const app = express.Router();
const{ 
  fetchReviewsByUserId
} = require('../db/review');
const { isLoggedIn } = require('./middleware');

//get/api/review/me
app.get('/me', isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const reviews = await fetchReviewsByUserId(userId);
    res.send(reviews);
  } catch (error) {
    next(error);
  }
})



module.exports = app;
