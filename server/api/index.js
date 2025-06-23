const express = require('express');
const app = express.Router();

app.use('/products', require('./products'));
app.use('/user', require('./user'));
app.use('/review', require('./review'));
app.use('/auth', require('./auth'));

module.exports = app;