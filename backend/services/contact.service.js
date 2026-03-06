const { contactCollectionName, adminNotificationEmail } = require('../config/env');
const { saveRecord } = require('../config/database');
const { sendEmailIfConfigured } = require('../config/email');
const { escapeHtml } = require('../utils/text');

const contactRequests = [];

const renderEmailList = (items) =>
  items.map((item) => `<li style="margin-bottom:8px;">${item}</li>`).join('');

const buildContactAdminEmail = (payload) => `
  <div style="font-family:Arial,sans-serif;color:#151110;line-height:1.6;">
    <h2 style="margin-bottom:12px;">New Expult Global contact request</h2>
    <ul>
      ${renderEmailList([
        `<strong>Name:</strong> ${escapeHtml(payload.name)}`,
        `<strong>Email:</strong> ${escapeHtml(payload.email)}`,
        `<strong>Company:</strong> ${escapeHtml(payload.company)}`,
        `<strong>Team type:</strong> ${escapeHtml(payload.teamType)}`,
        `<strong>Submitted:</strong> ${escapeHtml(payload.createdAt)}`
      ])}
    </ul>
    <p><strong>Message</strong></p>
    <p>${escapeHtml(payload.message)}</p>
  </div>
`;

const buildContactCustomerEmail = (payload) => `
  <div style="font-family:Arial,sans-serif;color:#151110;line-height:1.6;">
    <h2 style="margin-bottom:12px;">We received your Expult Global inquiry</h2>
    <p>Hi ${escapeHtml(payload.name)},</p>
    <p>Thanks for reaching out to Expult Global. We received your message and will review your request shortly.</p>
    <p><strong>Your focus:</strong> ${escapeHtml(payload.message)}</p>
    <p>We will follow up using the details you submitted for ${escapeHtml(payload.company)}.</p>
  </div>
`;

const createContactRequest = async ({ name, email, company, teamType, message }) => {
  const contactRequest = {
    source: 'website_contact_modal',
    name,
    email,
    company,
    teamType,
    message,
    createdAt: new Date().toISOString()
  };

  const saveResult = await saveRecord(contactCollectionName, contactRequest, contactRequests);

  console.log(`New Expult Global contact request saved to ${saveResult.storage}.`, {
    id: saveResult.id,
    email,
    teamType
  });

  await Promise.allSettled([
    adminNotificationEmail
      ? sendEmailIfConfigured({
          to: adminNotificationEmail,
          subject: `New Expult inquiry from ${name}`,
          html: buildContactAdminEmail(contactRequest),
          replyTo: email
        })
      : Promise.resolve({ skipped: true }),
    sendEmailIfConfigured({
      to: email,
      subject: 'We received your Expult Global request',
      html: buildContactCustomerEmail(contactRequest)
    })
  ]);

  return {
    saveResult,
    contactRequest
  };
};

module.exports = {
  createContactRequest
};