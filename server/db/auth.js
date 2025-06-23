const client = require('./client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {v4} = require('uuid');
const uuidv4 = v4;
const jwtSecret = process.env.JWT

const authenticate = async(credential) => {
  const SQL =`
  SELECT id, password
  FROM users
  WHERE username = $1
  `
  const response = await client.query(SQL, [credential.username]);
  if (!response.rows.length) {
    const error =  Error('User not found');
    error.status = 401;
    throw error;
  }
  const user = response.rows[0];
  const isPasswordValid = await bcrypt.compare(credential.password, user.password);
  if (!isPasswordValid) {
    const error =  Error('Invalid password');
    error.status = 401;
    throw error;
  }
  const token = jwt.sign({id: user.id}, process.env.JWT);
  return token;
}

const findUserByToken = async(token) => {
  try {
    const payload = await jwt.verify(token, process.env.JWT);
    console.log(payload);
    const SQL = `
      SELECT id, username
      FROM users
      WHERE id = $1
      `
    const response = await client.query(SQL, [payload.id]);
    if (!response.rows.length) {
      const error = Error('User not found');
      error.status = 401;
      throw error;
    }
    return response.rows[0];
  } catch (error) {
    console.log(error)
    const err = Error('Unauthorized');
    err.status = 401;
    throw err;
  }
}

const register = async (credential) => {
  if (!credential.username.trim() || !credential.password.trim()) {
    throw new Error('Username and password are required');
  }
  
  // Check if username already exists
  const existingUser = await client.query(
    'SELECT * FROM users WHERE username = $1',
    [credential.username]
  );
  
  if (existingUser.rows.length > 0) {
    throw new Error('Username already exists');
  }
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(credential.password, SALT_COUNT);
  const SQL = `
    INSERT INTO users (id, username, password, isAdmin)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, isAdmin;
  `
  const response = await client.query(SQL, [uuidv4(), credential.username, hashedPassword, credential.isAdmin || false]);
  return response.rows[0];
}

module.exports = {
  authenticate,
  findUserByToken,
  register
}
