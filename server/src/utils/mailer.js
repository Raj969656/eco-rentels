import nodemailer from "nodemailer";

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user:
        process.env.MAIL_USER,

      pass:
        process.env.MAIL_APP_PASSWORD,
    },
  });


export async function sendPasswordResetEmail({
  email,
  name,
  resetUrl,
}) {

  await transporter.sendMail({

    from:
      `"Eco Rentels" <${process.env.MAIL_USER}>`,

    to: email,

    subject:
      "Reset your Eco Rentels password",

    text: `
Hi ${name || "there"},

We received a request to reset your Eco Rentels password.

Reset your password here:

${resetUrl}

This link expires in 15 minutes.

If you did not request this, you can ignore this email.

Eco Rentels
`,

    html: `
<div style="
  max-width:600px;
  margin:40px auto;
  padding:40px;
  font-family:Arial,sans-serif;
  border:1px solid #eee;
  border-radius:16px;
">

  <h1>
    Eco Rentels
  </h1>

  <h2>
    Reset your password
  </h2>

  <p>
    Hi ${name || "there"},
  </p>

  <p>
    We received a request to reset your
    Eco Rentels password.
  </p>

  <p>
    Click the button below to create a
    new password.
  </p>

  <div style="
    margin:30px 0;
  ">

    <a
      href="${resetUrl}"
      style="
        display:inline-block;
        padding:14px 24px;
        background:#c8f31d;
        color:#111;
        text-decoration:none;
        border-radius:8px;
        font-weight:bold;
      "
    >
      Reset Password
    </a>

  </div>

  <p>
    This link expires in
    <strong>15 minutes</strong>.
  </p>

  <p style="color:#777;">
    If you didn't request this password
    reset, you can safely ignore this email.
  </p>

  <p>
    Eco Rentels
  </p>

</div>
`,
  });
}