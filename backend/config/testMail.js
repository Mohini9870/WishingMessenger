import { transporter } from "./mail.js";

await transporter.sendMail({
  from: `"Test" <${process.env.EMAIL_USER}>`,
  to: "mohinikori37@gmail.com",
  subject: "Test Email",
  text: "If you see this, email works",
});

console.log("Mail sent");
process.exit();
