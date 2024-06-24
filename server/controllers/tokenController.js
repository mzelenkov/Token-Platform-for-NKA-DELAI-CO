const express = require('express');
const Token = require('../models/Token');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const tokens = await Token.find();
    res.json(tokens);
  } 
  catch (error) {
    next(error);
  }
});

// Other token-related routes (e.g., create, update, delete)
module.exports = router;