const { Resend } = require('resend');

const resend = new Resend(
  process.env.RESEND_API_KEY
);

// -------------------------
// SEND RESET EMAIL
// -------------------------

const sendResetEmail = async (
  email,
  token
) => {

  try {

    const resetLink =

      `https://app.enfiance.com/reset-password/${token}`;

    await resend.emails.send({

      from:
        'Enfiance <support@enfiance.com>',

      to: email,

      subject:
        'Reset your Enfiance password',

      html: `

        <div style="
          font-family: Arial;
          padding: 20px;
          background: #050816;
          color: white;
        ">

          <h1 style="
            color: #D4AF37;
          ">
            ENFIANCE
          </h1>

          <p>
            We received a request to reset your password.
          </p>

          <p>
            Click the button below to continue.
          </p>

          <a
            href="${resetLink}"

            style="
              display: inline-block;
              background: #D4AF37;
              color: black;
              padding: 14px 24px;
              text-decoration: none;
              border-radius: 10px;
              font-weight: bold;
              margin-top: 20px;
            "
          >
            Reset Password
          </a>

          <p style="
            margin-top: 30px;
            color: #aaa;
            font-size: 14px;
          ">
            If you did not request this,
            you can ignore this email.
          </p>

        </div>

      `,
    });

    console.log(
      '✅ Reset email sent'
    );

  } catch (error) {

    console.error(
      '❌ Email error:',
      error
    );
  }
};

// -------------------------
// SEND TRANSFER EMAIL
// -------------------------

const sendTransferEmail = async (

  email,

  type,

  amount,

  otherUser

) => {

  try {

    const isReceive =
      type === 'receive';

    await resend.emails.send({

      from:
        'Enfiance <support@enfiance.com>',

      to: email,

      subject:

        isReceive

          ? `You received $${amount} USDC`

          : `You sent $${amount} USDC`,

      html: `

        <div style="
          font-family: Arial;
          padding: 20px;
          background: #050816;
          color: white;
        ">

          <h1 style="
            color: #D4AF37;
          ">
            ENFIANCE
          </h1>

          <h2>

            ${
              isReceive

                ? 'Transfer Received'

                : 'Transfer Sent'
            }

          </h2>

          <p>

            ${
              isReceive

                ? `${otherUser} sent you`

                : `You sent ${otherUser}`
            }

            <strong>
              $${amount} USDC
            </strong>

          </p>

          <p style="
            margin-top: 30px;
            color: #aaa;
            font-size: 14px;
          ">
            Thank you for using Enfiance.
          </p>

        </div>

      `,
    });

    console.log(
      '✅ Transfer email sent'
    );

  } catch (error) {

    console.error(
      '❌ Transfer email error:',
      error
    );
  }
};

module.exports = {
  sendResetEmail,
  sendTransferEmail,
};
