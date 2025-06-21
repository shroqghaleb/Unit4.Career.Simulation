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

const fetchReviews = async(userId) => {
  const SQL = `
      SELECT *
      FROM reviews
  `
  const response = await client.query(SQL)
  return response.rows
}
const deleteReview = async(id) => {
  const SQL = `
      DELETE FROM reviews
      WHERE id = $1
  `
  const response = await client.query(SQL, [id])
  return response.rows[0]
}
module.exports = {
  createReview,
  fetchReviews,
  deleteReview
}
