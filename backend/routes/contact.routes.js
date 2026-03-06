const express = require('express');

const { submitContactRequest } = require('../controllers/contact.controller');

const router = express.Router();

router.post('/', submitContactRequest);

module.exports = router;