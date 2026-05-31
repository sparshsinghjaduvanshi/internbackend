import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendInvoiceEmail = async ({
    email,
    name,
    plan,
    amount,
  }) => {

    const mailOptions = {

      from: process.env.EMAIL_USER,

      to: email,

      subject:
        "YourTube Plan Upgrade Invoice",

      html: `
        <h2>Hello ${name}</h2>

        <p>
          Your plan upgrade was successful.
        </p>

        <h3>Invoice Details</h3>

        <ul>
          <li><strong>Plan:</strong> ${plan}</li>
          <li><strong>Amount:</strong> ₹${amount}</li>
          <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
        </ul>

        <p>
          Thank you for using YourTube.
        </p>
      `,
    };

    await transporter.sendMail(mailOptions);
  };