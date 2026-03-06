const { escapeHtml } = require('../utils/text');

const renderEmailList = (items) =>
  items.map((item) => `<li style="margin-bottom:8px;">${item}</li>`).join('');

const formatPriorityList = (priorities = [], fallbackPriority = '') => {
  const normalizedPriorities = Array.from(
    new Set(
      (Array.isArray(priorities) ? priorities : [])
        .map((priority) => String(priority || '').trim())
        .filter(Boolean)
    )
  );

  if (!normalizedPriorities.length && fallbackPriority) {
    normalizedPriorities.push(String(fallbackPriority).trim());
  }

  return normalizedPriorities.join(', ');
};

const buildSimulationAdminEmail = (payload) => `
  <div style="font-family:Arial,sans-serif;color:#151110;line-height:1.6;">
    <h2 style="margin-bottom:12px;">New automation test drive lead</h2>
    <ul>
      ${renderEmailList([
        `<strong>Name:</strong> ${escapeHtml(payload.name)}`,
        `<strong>Email:</strong> ${escapeHtml(payload.email)}`,
        `<strong>Business name:</strong> ${escapeHtml(payload.businessName)}`,
        `<strong>Business type:</strong> ${escapeHtml(payload.businessType)}`,
        `<strong>Priorities:</strong> ${escapeHtml(formatPriorityList(payload.priorities, payload.priority))}`,
        `<strong>Lead source:</strong> ${escapeHtml(payload.source)}`,
        `<strong>Submitted:</strong> ${escapeHtml(payload.createdAt)}`
      ])}
    </ul>
    <p><strong>Blueprint outcome</strong></p>
    <p>${escapeHtml(payload.blueprint.outcome)}</p>
  </div>
`;

const buildSimulationCustomerEmail = (payload) => `
  <div style="font-family:Arial,sans-serif;color:#151110;line-height:1.6;">
    <h2 style="margin-bottom:12px;">Your Expult automation blueprint is ready</h2>
    <p>Hi ${escapeHtml(payload.name)},</p>
    <p>Thanks for taking the Expult Automation Test Drive for ${escapeHtml(payload.businessName)}.</p>
    <p><strong>Priorities selected:</strong> ${escapeHtml(formatPriorityList(payload.priorities, payload.priority))}</p>
    <p><strong>Blueprint direction:</strong> ${escapeHtml(payload.blueprint.outcome)}</p>
    <p>${escapeHtml(payload.blueprint.nextAction)}</p>
  </div>
`;

const buildSimulationHotLeadEmail = (payload) => `
  <div style="font-family:Arial,sans-serif;color:#151110;line-height:1.6;">
    <h2 style="margin-bottom:12px;">Hot lead: appointment request triggered</h2>
    <ul>
      ${renderEmailList([
        `<strong>Lead temperature:</strong> Hot lead`,
        `<strong>Name:</strong> ${escapeHtml(payload.name)}`,
        `<strong>Original email:</strong> ${escapeHtml(payload.email)}`,
        `<strong>Re-entered email:</strong> ${escapeHtml(payload.reenteredEmail || 'Same as original email')}`,
        `<strong>Confirmed contact email:</strong> ${escapeHtml(payload.confirmedContactEmail || payload.email)}`,
        `<strong>Business name:</strong> ${escapeHtml(payload.businessName)}`,
        `<strong>Business type:</strong> ${escapeHtml(payload.businessType)}`,
        `<strong>Priorities:</strong> ${escapeHtml(formatPriorityList(payload.priorities, payload.priority))}`,
        `<strong>Appointment requested:</strong> ${escapeHtml(payload.appointmentRequestedAt)}`
      ])}
    </ul>
    <p><strong>Blueprint outcome</strong></p>
    <p>${escapeHtml(payload.blueprint?.outcome || 'Not available')}</p>
  </div>
`;

module.exports = {
  buildSimulationAdminEmail,
  buildSimulationCustomerEmail,
  buildSimulationHotLeadEmail
};