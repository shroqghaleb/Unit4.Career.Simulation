const express = require('express');
const app = express.Router();
const{
  fetchProducts,
  findProductById
} = require('../db/products');
const{
  fetchReviews,
  fetchReviewById,
  createReview
} = require('../db/review');
const {isLoggedIn} = require('./middleware');

//get/api/products
app.get('/', async (req, res, next) => {
  try {
    res.send(await fetchProducts()); 
  } catch (error) {
    next(error);
  }
})

//get/api/products/:productId
app.get('/:productId', async (req, res, next) => {
  try {
    res.send(await findProductById(req.params.productId));
  } catch (error) {
    next(error);
  }
})

//get/api/products/:productId/reviews
app.get('/:productId/reviews', async (req, res, next) => {
  try {
    res.send(await fetchReviews(req.params.productId));
  } catch (error) {
    next(error);
  }
})

//get/api/products/:productId/reviews/:reviewId
app.get('/:productId/reviews/:reviewId', async (req, res, next) => {
  try {
    res.send(await fetchReviewById(req.params.productId, req.params.reviewId));
  } catch (error) {
    next(error);
  }
})

//post/api/products/:productId/reviews
app.post('/:productId/reviews', isLoggedIn, async (req, res, next) => {
  try {
    const reviewData = {
      productId: req.params.productId,
      userId: req.user.id,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    };
    res.send(await createReview(reviewData));
  } catch (error) {
    next(error);
  }
})

module.exports = app;