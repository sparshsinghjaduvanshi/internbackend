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

transporter.verify(
  function(error, success) {

    if (error) {
      console.log(error);
    } else {
      console.log(
        "SMTP Ready"
      );
    }
  }
);
export const sendOtpEmail =
    async (
        email,
        otp
    ) => {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,

            to: email,

            subject:
                "YourTube OTP Verification",

            html: `
        <h2>
          OTP Verification
        </h2>

        <p>
          Your OTP is:
        </p>

        <h1>${otp}</h1>

        <p>
          Valid for 5 minutes.
        </p>
      `,
        });
    };