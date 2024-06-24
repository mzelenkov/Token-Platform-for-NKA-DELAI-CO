const express = require('express');
const tokenController = require('../controllers/tokenController');

const router = express.Router();

router.get('/', tokenController.getAllTokens);
// Other routes for token operations

module.exports = router;