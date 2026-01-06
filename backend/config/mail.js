import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOtpEmail = async (to, otp) => {
  await sgMail.send({
    to,
    from: process.env.EMAIL_FROM,
    subject: "Your OTP Code",
    html: `
      <h2>Your OTP</h2>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes</p>
    `,
  });

  console.log("✅ OTP email sent");
};
