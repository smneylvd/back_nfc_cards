const express = require('express');
const {authenticate} = require('../middleware/authenticate');
const db = require('../config/database');
const router = require('./router');
const {body, validationResult} = require("express-validator");
const send = require("../transformers/message");
const bcrypt = require('bcrypt');


const prefix = "users";

const userAttributes = [
  'avatar',
  'address',
  'job_address',
  'position',
  'website_link',
  'instagram_link',
  'telegram_link',
  'youtube_link',
  'facebook_link',
];

const getUserData = async (user_id) => {
  const user = await db.query(`
      SELECT users.first_name,
             users.last_name,
             users.middle_name,
             users.email,
             users.phone,
             users.description,
             users.hash      
      FROM users
               INNER JOIN roles ON users.role_id = roles.id
      WHERE users.id = $1
  `, [user_id]);

  if (!user.rows.length) {
    return [];
  }
  let data = user.rows[0];
  for (let i = 0; i < userAttributes.length; i++) {
    const key = userAttributes[i];
    if (user.rows[0][key] !== undefined) continue;
    let attr = await db.query(
      'select * from content_fields where content_id = $1 and type = $2',
      [user_id, key]
    );
    data[key] = attr.rows.length ? attr.rows[0].value : null;
  }

  return data;
}

router.get(`/${prefix}/profile`, authenticate, async (req, res) => {
  try {
    const user = await db.query(`
        SELECT users.role_id
        FROM users
                 INNER JOIN roles ON users.role_id = roles.id
        WHERE users.id = $1
    `, [req.user.id]);

    if (user.rows.length > 0) {
      let data = await getUserData(req.user.id);
      return send(res, 200, data);
    } else {
      return send(res, 404);
    }
  } catch (error) {
    console.error('Error fetching user account:', error);
    return send(res, 500, 'Error fetching user account.' + error);
  }
});

router.post(`/${prefix}/profile`, [
    body('attributes')
      .notEmpty()
      .withMessage('User attributes must not be empty.'),
  ],
  authenticate,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return send(res, 400, errors?.errors[0]?.msg);
    }

    const {attributes} = req.body;

    const user = await db.query(`
        SELECT users.id,
               users.first_name,
               users.last_name,
               users.middle_name,
               users.email,
               users.phone,
               users.description,
               users.hash,
               users.role_id
        FROM users
                 INNER JOIN roles ON users.role_id = roles.id
        WHERE users.id = $1
    `, [req.user.id]);

    if (!user.rows.length) {
      return send(res, 404, 'User not found.');
    }

    try {
      for (let i = 0; i < Object.keys(attributes).length; i++) {
        const key = Object.keys(attributes)[i];
        if (Object.keys(user.rows[0]).includes(key) && key !== "hash") {
          console.log(Object.keys(user.rows[0]).includes(key), key, req.user.id);
          await db.query(
            `update users
             set ${key} = $1
             where id = $2`,
            [attributes[key], req.user.id,]
          );
        } else if (Object.keys(userAttributes)) {
          let attr = await db.query(
            'select * from content_fields where content_id = $1 and type = $2',
            [req.user.id, key]
          );
          if (!attr.rows.length) {
            await db.query(
              'insert into content_fields(content_id, type, value, created_at) values ($1, $2, $3, $4)', //need to copy
              [req.user.id, key, attributes[key], new Date(),]
            );
          } else {
            await db.query(
              'update content_fields set value = $1 where type = $2 and content_id = $3',
              [attributes[key], key, req.user.id,]
            );
          }
        }
      }
      let data = await getUserData(req.user.id);

      return send(res, 200, data);
    } catch (error) {
      console.error('Error updating user account:', error);
      send(res, 500, 'Error updating user account.');
    }
  });

async function generateRandomLetters(length) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let randomLetters = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    randomLetters += alphabet[randomIndex];
  }

  try {
    let duplicateHash = await db.query(`SELECT id FROM users WHERE hash = $1`, [randomLetters]);
    if (duplicateHash.rows.length > 0) {
      // If hash already exists in the database, recursively call generateRandomLetters again
      randomLetters = await generateRandomLetters(length);
    }
  } catch (error) {
    // Handle database query error
    console.error('Error querying database for duplicate hash:', error);
    throw new Error('Error generating random hash.');
  }

  return randomLetters;
}

router.post(`/admin/${prefix}/store`, authenticate, [
    body('login')
      .notEmpty()
      .withMessage('Login required.'),
    body('password')
      .isLength({min: 6})
      .notEmpty()
      .withMessage('Password must be at least 6 characters long.')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return send(res, 400, errors?.errors[0]?.msg);
    }

    const {login, password} = req.body;
    try {
      const existingUser = await db.query('SELECT * FROM users WHERE phone = $1', [login]);

      if (existingUser.rows.length > 0) {
        return send(res, 400, 'Phone already registered.');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      let roles = await db.query(
        `select *
         from roles
         where name like $1
        `, [`%customer%`])
      let role_id = null;
      if (roles.rows.length) {
        role_id = roles.rows[0].id;
      }
      let hash = await generateRandomLetters(8);
      await db.query(`INSERT INTO users (phone, password, hash, role_id)
                      VALUES ($1, $2, $3, $4)`, [login, hashedPassword, hash, role_id]);
      return send(res, 200);

    } catch (error) {
      console.error('Error registering the user:', error);
      return send(res, 500, 'Error registering the user.');
    }
  });


router.get(`/admin/${prefix}`, authenticate, async (req, res) => {
  try {
    const user = await db.query(`
        SELECT users.role_id,
               roles.name
        FROM users
                 INNER JOIN roles
                            ON users.role_id = roles.id
        where roles.name = 'admin'
    `)
    if (!user.rows.length) {
      return send(res, 403);
    }
    const users = await db.query(`
        SELECT users.id,
               users.first_name,
               users.phone,
               users.first_name,
               users.last_name,
               users.middle_name,
               users.email,
               users.role_id,
               users.description,
               users.hash,
               roles.name as role
        FROM users
                 INNER JOIN roles
                            ON users.role_id = roles.id
    `);

    return send(res, 200, users.rows);
  } catch (error) {
    console.error('Error fetching user account:', error);
    return send(res, 500, 'Error fetching users');
  }
});
