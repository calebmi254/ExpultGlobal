const { isValidEmail, normalizeText } = require('../utils/text');
const { generateChatbotReply } = require('../services/chatbot.service');
const { getServiceCatalog } = require('../services/service-catalog.service');

const getChatbotServicesHandler = async (_req, res, next) => {
  try {
    const services = await getServiceCatalog();

    return res.json({
      status: 'ok',
      services
    });
  } catch (error) {
    return next(error);
  }
};

const sendChatbotMessageHandler = async (req, res, next) => {
  try {
    const message = normalizeText(req.body.message);
    const lead = typeof req.body.lead === 'object' && req.body.lead ? req.body.lead : {};
    const conversation = Array.isArray(req.body.conversation) ? req.body.conversation : [];

    if (!message) {
      return res.status(400).json({
        status: 'error',
        message: 'Please enter a message before sending it to the chatbot.'
      });
    }

    if (lead.email && !isValidEmail(normalizeText(lead.email))) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address when requesting follow-up.'
      });
    }

    const result = await generateChatbotReply({
      message,
      conversation,
      lead
    });

    return res.json({
      status: 'ok',
      ...result
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getChatbotServicesHandler,
  sendChatbotMessageHandler
};