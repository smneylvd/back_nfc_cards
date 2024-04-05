const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const router = require('./router');
const {body, validationResult} = require("express-validator");
const dotenv = require('dotenv');
const send = require("../transformers/message");

dotenv.config();

const prefix = "auth"
router.post(`/${prefix}/login`, [
  body('password').notEmpty().withMessage('Phone number is required.'),
  body('login').notEmpty().withMessage('Password is required.')
], async (req, res) => {
  const {login, password} = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return send(res, 400, errors?.errors[0]?.msg);
    }

    const user = await db.query('SELECT * FROM users WHERE phone = $1', [login]);

    if (user.rows.length === 0) {
      return send(res, 404);
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return send(res, 403, 'Invalid email or password.');
    }

    const token = jwt.sign({
      id: user.rows[0].id, role: user.rows[0].phone
    }, process.env.JWT_KEY);

    let data = {
      id: user.rows[0].id,
      login: user.rows[0].phone,
      token: token
    };

    return send(res, 200, data);

  } catch (error) {
    console.error('Error logging in:', error);
    return send(res, 500, error.getMessage());
  }
});

