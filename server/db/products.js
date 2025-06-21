const client = require('./client');
const {v4} = require('uuid');
const uuidv4 = v4;

const createProduct = async ({name, description, price}) => {
  if (!name.trim()) {
    throw new Error('Product name is required');
  }
  const SQL = `
  INSERT INTO products (id, name, description, price)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `
  const response = await client.query(SQL, [uuidv4(), name, description, price]);
  return response.rows[0];
}

const fetchProducts = async() => {
  const SQL = `
      SELECT *
      FROM products
  `
  const response = await client.query(SQL)
  return response.rows
}

module.exports = {
  createProduct,
  fetchProducts
}
