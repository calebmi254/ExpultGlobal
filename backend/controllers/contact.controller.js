const { normalizeText, isValidEmail } = require('../utils/text');
const { createContactRequest } = require('../services/contact.service');

const submitContactRequest = async (req, res, next) => {
  try {
    const name = normalizeText(req.body.name);
    const email = normalizeText(req.body.email);
    const company = normalizeText(req.body.company);
    const teamType = normalizeText(req.body.teamType);
    const message = normalizeText(req.body.message);

    if (!name || !email || !company || !teamType || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Please complete all contact form fields before submitting.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please enter a valid email address before submitting.'
      });
    }

    await createContactRequest({
      name,
      email,
      company,
      teamType,
      message
    });

    return res.status(201).json({
      status: 'ok',
      message: 'Thanks — your request has been received. We will follow up shortly.'
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  submitContactRequest
};