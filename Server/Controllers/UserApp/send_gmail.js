const nodemailer = require("nodemailer");
const sendGmail = async (gmailId, otp, validityDuration, newUser) => {
  const mailSettings = {
    service: "gmail",
    auth: {
      user: process.env.Gmail,
      pass: process.env.GmailPassword,
    },
  };
  const otpTemplate = `<!DOCTYPE html>
<html>
<head>
    <style>
    body {
      font-family: Arial, sans-serif;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: rgba(164, 190, 123, 1);
    }

    .header {
      background-color: rgba(40, 84, 48, 1);
      color: #fff;
      padding: 15px;
    }

    .logo {
      font-size: 24px;
      font-weight: bold;
    }

    .otp {
      font-size: 36px;
      font-weight: bold;
      margin-top: 20px;
      margin-bottom: 20px;
      color: rgba(40, 84, 48, 1);
    }

    .info {
      font-size: 16px;
      margin-top: 20px;
    }

    .expire {
      color: #ff0000;
      font-weight: bold;
    }

    .footer {
      margin-top: 20px;
      font-size: 14px;
      color: #555;
    }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Chirrp Club</div>
        </div>
        <div class="content">
            <p>Hello there,</p>
            <p>${
              newUser
                ? `Please use the following OTP for email verification`
                : `Your One-Time Password (OTP) for Chirrp Club is:`
            }</p>
            <div class="otp">${otp}</div>
            <p class="info">Please use this OTP within the next <span class="expire">${validityDuration} minutes</span> to complete your ${
    newUser ? `email verification` : `authentication`
  } process.</p>
            <p class="info">Chirrp Club is the perfect place for bird enthusiasts to connect, share, and explore the world of birds.</p>
            <p class="info">Happy birdwatching!</p>
        </div>
        <div class="footer">
            <p>If you did not request this OTP or need assistance, please contact our support team at support@chirrpclub.com.</p>
            <p>&copy; 2023 Chirrp Club</p>
        </div>
    </div>
</body>
</html>
`;
  const transporter = nodemailer.createTransport(mailSettings);
  try {
    const gmailResult = await transporter.sendMail({
      from: mailSettings.auth.user,
      to: gmailId,
      subject: `Chirrp Club App OTP: ${
        newUser
          ? `Verify your email by using this OTP`
          : `Your One-Time Password  Is Here`
      }`,
      html: otpTemplate,
    });
    if (!gmailResult.rejected.length) {
      return `otp sent to ${gmailId}`;
    }
  } catch (error) {
    throw new Error("failed to send otp");
  }
};

module.exports = sendGmail;
