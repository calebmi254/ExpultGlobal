const { Resend } = require('resend');

const { resendApiKey, resendFromEmail, resendReplyToEmail } = require('./env');

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const sendEmailIfConfigured = async ({ to, subject, html, replyTo }) => {
  if (!resend || !to) {
    return { skipped: true };
  }

  try {
    await resend.emails.send({
      from: resendFromEmail,
      to,
      replyTo: replyTo || resendReplyToEmail,
      subject,
      html
    });

    return { sent: true };
  } catch (error) {
    console.error(`Resend email failed for ${subject}.`, error);

    return {
      sent: false,
      error: error.message
    };
  }
};

module.exports = {
  sendEmailIfConfigured
};