const { adminNotificationEmail, chatLeadCollectionName, groqApiKey, groqModel } = require('../config/env');
const { saveRecord } = require('../config/database');
const { sendEmailIfConfigured } = require('../config/email');
const { escapeHtml, normalizeText } = require('../utils/text');
const { buildServicesKnowledgeSummary, findMatchingServices, getServiceCatalog } = require('./service-catalog.service');

const chatbotLeads = [];

const normalizeConversation = (conversation = []) =>
  (Array.isArray(conversation) ? conversation : [])
    .map((entry) => ({
      role: entry?.role === 'assistant' ? 'assistant' : 'user',
      content: normalizeText(entry?.content)
    }))
    .filter((entry) => entry.content)
    .slice(-8);

const normalizeLeadPayload = (lead = {}) => ({
  name: normalizeText(lead.name),
  email: normalizeText(lead.email),
  company: normalizeText(lead.company),
  phone: normalizeText(lead.phone),
  serviceInterest: normalizeText(lead.serviceInterest),
  projectSummary: normalizeText(lead.projectSummary),
  preferredContactMethod: normalizeText(lead.preferredContactMethod),
  requestHumanFollowUp: Boolean(lead.requestHumanFollowUp)
});

const extractJsonObject = (value) => {
  const content = normalizeText(value);
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  return content.slice(start, end + 1);
};

const buildLeadAdminEmail = (lead) => `
  <div style="font-family:Arial,sans-serif;color:#151110;line-height:1.6;">
    <h2 style="margin-bottom:12px;">New Expult Global chatbot lead</h2>
    <p>The website chatbot captured a new lead.</p>
    <ul>
      <li><strong>Name:</strong> ${escapeHtml(lead.name || 'Not provided')}</li>
      <li><strong>Email:</strong> ${escapeHtml(lead.email || 'Not provided')}</li>
      <li><strong>Company:</strong> ${escapeHtml(lead.company || 'Not provided')}</li>
      <li><strong>Service interest:</strong> ${escapeHtml(lead.serviceInterest || 'Not specified')}</li>
      <li><strong>Preferred contact:</strong> ${escapeHtml(lead.preferredContactMethod || 'Not specified')}</li>
      <li><strong>Requested follow-up:</strong> ${lead.requestHumanFollowUp ? 'Yes' : 'No'}</li>
      <li><strong>Created:</strong> ${escapeHtml(lead.createdAt)}</li>
    </ul>
    <p><strong>Latest message</strong></p>
    <p>${escapeHtml(lead.message)}</p>
    <p><strong>Matched services</strong></p>
    <p>${escapeHtml((lead.matchedServices || []).join(', ') || 'None')}</p>
  </div>
`;

const buildLeadCustomerEmail = (lead) => `
  <div style="font-family:Arial,sans-serif;color:#151110;line-height:1.6;">
    <h2 style="margin-bottom:12px;">We received your Expult Global chat request</h2>
    <p>Hi ${escapeHtml(lead.name || 'there')},</p>
    <p>Thanks for chatting with Expult Global. We captured your request and a team member can follow up using the details you shared.</p>
    <p><strong>Service interest:</strong> ${escapeHtml(lead.serviceInterest || 'General inquiry')}</p>
    <p><strong>Your request:</strong> ${escapeHtml(lead.message)}</p>
  </div>
`;

const leadIntentPhrases = ['price', 'quote', 'book', 'demo', 'consult', 'contact', 'talk', 'call', 'help', 'interested', 'need'];

const inferLeadNeed = (message, matchedServices, lead) => {
  const normalizedMessage = normalizeText(message).toLowerCase();

  return (
    lead.requestHumanFollowUp ||
    Boolean(lead.email && lead.name) ||
    (matchedServices.length > 0 && leadIntentPhrases.some((phrase) => normalizedMessage.includes(phrase)))
  );
};

const buildFallbackAnswer = ({ message, matchedServices, services }) => {
  const normalizedMessage = normalizeText(message).toLowerCase();

  if (matchedServices.length) {
    const primaryService = matchedServices[0];
    const supportingServices = matchedServices.slice(1).map((service) => service.name);
    const relatedLine = supportingServices.length
      ? ` Related Expult services that could also support this are ${supportingServices.join(', ')}.`
      : '';
    const pricingLine = normalizedMessage.includes('price') || normalizedMessage.includes('cost')
      ? ' Pricing depends on the scope, workflow complexity, and integrations needed, so the right next step is a scoped conversation.'
      : '';

    return {
      answer: `${primaryService.name} is the closest approved Expult service for that. ${primaryService.summary}${relatedLine}${pricingLine} ${primaryService.recommendedNextStep} If you want, I can also collect your name, email, and company so our team can follow up with the right next step.`,
      matchedServiceSlugs: matchedServices.map((service) => service.slug),
      needsLeadCapture: inferLeadNeed(message, matchedServices, { requestHumanFollowUp: false, email: '', name: '' }),
      leadCaptureReason: matchedServices.length
        ? 'The user appears to be discussing a real service need that could be handed to the team.'
        : '',
      followUpQuestion: 'Would you like to share your name, email, company, and the service you want help with?'
    };
  }

  const serviceNames = services.slice(0, 6).map((service) => service.name).join(', ');

  return {
    answer: `I want to keep this accurate, so I will stay within Expult Global's approved offerings. Right now Expult Global offers ${serviceNames}. If you tell me what you want to achieve, I can point you to the closest matching service and help capture your details for follow-up.`,
    matchedServiceSlugs: [],
    needsLeadCapture: false,
    leadCaptureReason: '',
    followUpQuestion: 'What would you like help with: automation, AI assistants, websites, data systems, or custom software?'
  };
};

const requestGroqChatbotReply = async ({ message, conversation, lead, services, matchedServices }) => {
  const fallback = buildFallbackAnswer({ message, matchedServices, services });

  if (!groqApiKey) {
    return {
      ...fallback,
      provider: 'fallback',
      model: 'static-chatbot'
    };
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: groqModel,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              "You are Expult Global's website contact assistant. Only answer using the approved service catalog and company context provided in the user payload. Do not invent services, case studies, pricing, delivery timelines, technical stack commitments, locations, guarantees, or capabilities that are not explicitly provided. If the user asks for something outside the approved catalog, say you do not want to misstate Expult's offering and redirect them toward the closest approved service or a custom consultation. Keep answers practical, concise, and client-facing. Your job is also to support lead capture when the visitor shows buying intent. Return only valid JSON with keys: answer, matchedServiceSlugs, needsLeadCapture, leadCaptureReason, followUpQuestion.",
          },
          ...conversation,
          {
            role: 'user',
            content: JSON.stringify({
              company: 'Expult Global',
              approvedServices: buildServicesKnowledgeSummary(services),
              matchedServices: matchedServices.map((service) => service.slug),
              visitorMessage: message,
              leadContext: lead,
              instructions: [
                'Stay grounded only in the approved catalog.',
                'Do not hallucinate services or details.',
                'If pricing is asked, explain that pricing depends on scope and recommend a follow-up conversation.',
                'Encourage lead capture when the visitor appears interested in implementation, pricing, a consultation, or human follow-up.',
                'If the visitor shares details, keep the tone respectful and action-oriented.'
              ]
            })
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Groq chatbot request failed with status ${response.status}.`);
    }

    const completion = await response.json();
    const content = completion?.choices?.[0]?.message?.content;
    const jsonPayload = extractJsonObject(content);

    if (!jsonPayload) {
      throw new Error('Groq chatbot response did not contain valid JSON.');
    }

    const candidate = JSON.parse(jsonPayload);

    return {
      answer: normalizeText(candidate.answer) || fallback.answer,
      matchedServiceSlugs: Array.isArray(candidate.matchedServiceSlugs)
        ? candidate.matchedServiceSlugs.filter((slug) => services.some((service) => service.slug === slug))
        : fallback.matchedServiceSlugs,
      needsLeadCapture: Boolean(candidate.needsLeadCapture),
      leadCaptureReason: normalizeText(candidate.leadCaptureReason) || fallback.leadCaptureReason,
      followUpQuestion: normalizeText(candidate.followUpQuestion) || fallback.followUpQuestion,
      provider: 'groq',
      model: groqModel
    };
  } catch (error) {
    console.error('Groq chatbot generation failed. Falling back to static response.', error);
    return {
      ...fallback,
      provider: 'fallback',
      model: 'static-chatbot'
    };
  }
};

const saveChatLead = async ({ lead, message, matchedServices }) => {
  const createdAt = new Date().toISOString();
  const chatLead = {
    source: 'website_chatbot',
    name: lead.name,
    email: lead.email,
    company: lead.company,
    phone: lead.phone,
    serviceInterest: lead.serviceInterest || matchedServices[0]?.name || '',
    projectSummary: lead.projectSummary,
    preferredContactMethod: lead.preferredContactMethod,
    requestHumanFollowUp: lead.requestHumanFollowUp,
    message,
    matchedServices: matchedServices.map((service) => service.name),
    createdAt
  };

  const saveResult = await saveRecord(chatLeadCollectionName, chatLead, chatbotLeads);

  console.log(`Expult chatbot lead saved to ${saveResult.storage}.`, {
    id: saveResult.id,
    email: chatLead.email,
    serviceInterest: chatLead.serviceInterest
  });

  await Promise.allSettled([
    adminNotificationEmail
      ? sendEmailIfConfigured({
          to: adminNotificationEmail,
          subject: `New chatbot lead from ${chatLead.name || 'website visitor'}`,
          html: buildLeadAdminEmail(chatLead),
          replyTo: chatLead.email
        })
      : Promise.resolve({ skipped: true }),
    chatLead.email
      ? sendEmailIfConfigured({
          to: chatLead.email,
          subject: 'We received your Expult Global chat request',
          html: buildLeadCustomerEmail(chatLead)
        })
      : Promise.resolve({ skipped: true })
  ]);

  return {
    id: saveResult.id,
    storage: saveResult.storage,
    lead: chatLead
  };
};

const generateChatbotReply = async ({ message, conversation = [], lead = {} }) => {
  const services = await getServiceCatalog();
  const normalizedConversation = normalizeConversation(conversation);
  const normalizedLead = normalizeLeadPayload(lead);
  const matchedServices = findMatchingServices(message, services);
  const aiReply = await requestGroqChatbotReply({
    message,
    conversation: normalizedConversation,
    lead: normalizedLead,
    services,
    matchedServices
  });
  const shouldCaptureLead = inferLeadNeed(message, matchedServices, normalizedLead) || aiReply.needsLeadCapture;
  const hasLeadDetails = Boolean(normalizedLead.name && normalizedLead.email);
  let leadCapture = {
    requested: shouldCaptureLead,
    captured: false,
    missingFields: shouldCaptureLead && !hasLeadDetails ? ['name', 'email'] : []
  };

  if (shouldCaptureLead && hasLeadDetails) {
    const savedLead = await saveChatLead({
      lead: normalizedLead,
      message,
      matchedServices
    });

    leadCapture = {
      requested: true,
      captured: true,
      missingFields: [],
      id: savedLead.id,
      storage: savedLead.storage
    };
  }

  return {
    reply: aiReply.answer,
    matchedServices: matchedServices.map((service) => ({
      slug: service.slug,
      name: service.name,
      category: service.category
    })),
    followUpQuestion: aiReply.followUpQuestion,
    leadCapture,
    provider: aiReply.provider,
    model: aiReply.model
  };
};

const __resetChatbotStateForTests = () => {
  chatbotLeads.length = 0;
};

module.exports = {
  generateChatbotReply,
  normalizeLeadPayload,
  __resetChatbotStateForTests
};