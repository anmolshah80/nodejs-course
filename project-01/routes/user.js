const express = require('express');
const { v4: uuidv4 } = require('uuid');

const {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
  handleGetAllFormattedUsers,
} = require('../controllers/user');

const router = express.Router();

const FORM_DATA_KEYS = [
  'first_name',
  'last_name',
  'email',
  'gender',
  'job_title',
];

// REST API
// Route grouping
// Source -> https://expressjs.com/en/guide/routing.html
router
  .route('/')
  .get(handleGetAllFormattedUsers)
  .get(handleGetAllUsers)
  .post(handleCreateNewUser);

router
  .route('/:id')
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router;
