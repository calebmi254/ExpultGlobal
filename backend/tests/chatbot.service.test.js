const test = require('node:test');
const assert = require('node:assert/strict');

process.env.MONGODB_URI = '';
process.env.GROQ_API_KEY = '';
process.env.RESEND_API_KEY = '';

const { __resetChatbotStateForTests, generateChatbotReply } = require('../services/chatbot.service');

test.beforeEach(() => {
  __resetChatbotStateForTests();
});

test('generateChatbotReply stays grounded in approved services without AI credentials', async () => {
  const result = await generateChatbotReply({
    message: 'Can you help me add an AI chatbot to my website to support customers?'
  });

  assert.equal(result.provider, 'fallback');
  assert.ok(result.reply.includes('AI Business Assistants'));
  assert.equal(result.matchedServices[0]?.slug, 'ai-business-assistants');
});

test('generateChatbotReply captures a lead when the visitor shares contact details', async () => {
  const result = await generateChatbotReply({
    message: 'I want to discuss a custom platform for my company and would like a follow-up call.',
    lead: {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      company: 'Analytical Engines Ltd',
      serviceInterest: 'Custom Software Development',
      requestHumanFollowUp: true
    }
  });

  assert.equal(result.leadCapture.captured, true);
  assert.equal(result.leadCapture.requested, true);
  assert.ok(result.leadCapture.id);
});