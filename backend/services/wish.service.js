import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendWishEmail = async (wish) => {
  try {
    await sgMail.send({
      to: wish.receiverEmail,
      from: process.env.EMAIL_FROM,
      subject: "🎂 Happy Birthday!",
      html: `
        <h2>${wish.message}</h2>
        ${
          wish.videoUrl
            ? `<a href="${wish.videoUrl}">Watch Surprise Video 🎥</a>`
            : ""
        }
      `,
    });

    wish.status = "SENT";
    await wish.save();
  } catch (error) {
    wish.status = "FAILED";
    await wish.save();
    console.error("Email failed", error);
  }
};
