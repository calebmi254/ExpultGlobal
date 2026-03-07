const test = require('node:test');
const assert = require('node:assert/strict');

process.env.MONGODB_URI = '';
process.env.GROQ_API_KEY = '';
process.env.RESEND_API_KEY = '';

const { findMatchingServices, getServiceCatalog } = require('../services/service-catalog.service');

test('getServiceCatalog exposes approved Expult services', async () => {
  const services = await getServiceCatalog();

  assert.ok(services.length >= 6);
  assert.ok(services.some((service) => service.slug === 'revenue-automation-systems'));
  assert.ok(services.some((service) => service.slug === 'ai-business-assistants'));
});

test('findMatchingServices prioritizes the chatbot service for support requests', async () => {
  const services = await getServiceCatalog();
  const matches = findMatchingServices('We need a chatbot on our website to answer customer questions and qualify leads.', services);

  assert.equal(matches[0]?.slug, 'ai-business-assistants');
});