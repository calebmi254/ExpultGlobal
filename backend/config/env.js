const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  mongoDatabaseName: process.env.MONGODB_DB_NAME || 'expult_global',
  contactCollectionName: process.env.MONGODB_CONTACT_COLLECTION || 'contact_requests',
  simulationCollectionName: process.env.MONGODB_SIMULATION_COLLECTION || 'automation_test_drive_leads',
  serviceCatalogCollectionName: process.env.MONGODB_SERVICE_COLLECTION || 'services_catalog',
  chatLeadCollectionName: process.env.MONGODB_CHAT_LEAD_COLLECTION || 'chatbot_leads',
  resendApiKey: process.env.RESEND_API_KEY,
  resendFromEmail: process.env.RESEND_FROM_EMAIL || 'Expult Global <onboarding@resend.dev>',
  resendReplyToEmail: process.env.RESEND_REPLY_TO_EMAIL,
  adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL,
  hotLeadNotificationEmail: process.env.HOT_LEAD_NOTIFICATION_EMAIL || 'callebmuthee@gmail.com',
  groqApiKey: process.env.GROQ_API_KEY,
  groqModel: process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
};