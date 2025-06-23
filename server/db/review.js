const client = require('./client');
const {v4} = require('uuid');
const uuidv4 = v4;

const createReview = async ({productId, userId, rating, reviewText}) => {
  const SQL = `
  INSERT INTO reviews (id, product_id, user_id, rating, review_text)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
  `
  const response = await client.query(SQL, [uuidv4(), productId, userId, rating, reviewText]);
  return response.rows[0];
}

const fetchReviews = async(productId) => {
  const SQL = `
      SELECT *
      FROM reviews
      WHERE product_id = $1
  `
  const response = await client.query(SQL, [productId])
  return response.rows
}

const fetchReviewsByUserId = async(userId) => {
  const SQL = `
      SELECT *
      FROM reviews
      WHERE user_id = $1
  `
  const response = await client.query(SQL, [userId])
  return response.rows
}

const updateReview = async(reviewId, updateData) => {
  const { rating, reviewText } = updateData;
  const SQL = `
      UPDATE reviews
      SET rating = $1, review_text = $2
      WHERE id = $3
      RETURNING *
  `
  const response = await client.query(SQL, [rating, reviewText, reviewId]);
  return response.rows[0];
}

const deleteReview = async(id) => {
  const SQL = `
      DELETE FROM reviews
      WHERE id = $1
  `
  const response = await client.query(SQL, [id])
  return response.rows[0]
}

const fetchReviewById = async(productId, reviewId) => {
  const SQL = `
      SELECT *
      FROM reviews
      WHERE product_id = $1 AND id = $2
  `
  const response = await client.query(SQL, [productId, reviewId])
  return response.rows[0]
}

module.exports = {
  createReview,
  fetchReviews,
  fetchReviewsByUserId,
  updateReview,
  deleteReview,
  fetchReviewById
}
