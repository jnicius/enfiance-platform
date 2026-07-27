const { Resend } = require('resend');

const resend = new Resend(
  process.env.RESEND_API_KEY
);

async function sendEmail(
  to,
  subject,
  html
) {
  try {

    const result =
      await resend.emails.send({

        from:
          'Enfiance <support@enfiance.com>',

        to,

        subject,

        html,
      });

    console.log(
      'EMAIL SENT:',
      result
    );

    return result;

  } catch (error) {

    console.error(
      'EMAIL ERROR:',
      error
    );

    throw error;
  }
}

module.exports = {
  sendEmail,
};
