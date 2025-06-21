const bcrypt = require('bcrypt');
const client = require('./client');
const {v4} = require('uuid');
const uuidv4 = v4;

const createUser = async ({username, password, isAdmin = false}) => {
  if (!username.trim() || !password.trim()) {
    throw new Error('Username and password are required');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const SQL = `
  INSERT INTO users (id, username, password, isAdmin)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `
  const response = await client.query(SQL, [uuidv4(), username, hashedPassword, isAdmin]);
  return response.rows[0];
}

const fetchUsers = async() => {
  const SQL = `
      SELECT *
      FROM users
  `
  const response = await client.query(SQL)
  return response.rows
}

module.exports = {
  createUser,
  fetchUsers
}