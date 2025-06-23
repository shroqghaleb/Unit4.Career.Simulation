const express = require('express');
const app = express.Router();
const { isLoggedIn } = require('./middleware');
const { updateReview, deleteReview } = require('../db/review');

app.put('/:userId/reviews/:reviewId', isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const reviewId = req.params.reviewId;
    if (userId !== req.user.id) {
      const error = Error('Unauthorized');
      error.status = 403;
      throw error;
    }
    const review = await updateReview(reviewId, req.body);
    res.send(review);
  } catch (error) {
    next(error);
  }
})

app.delete('/:userId/reviews/:reviewId', isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const reviewId = req.params.reviewId;
    if (userId !== req.user.id) {
      const error = Error('Unauthorized');
      error.status = 403;
      throw error;
    }
    const review = await deleteReview(reviewId);
    res.send(review);
  } catch (error) {
    next(error);
  }
})

module.exports = app;
