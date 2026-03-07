const express = require('express');

const { getChatbotServicesHandler, sendChatbotMessageHandler } = require('../controllers/chatbot.controller');

const router = express.Router();

router.get('/services', getChatbotServicesHandler);
router.post('/messages', sendChatbotMessageHandler);

module.exports = router;