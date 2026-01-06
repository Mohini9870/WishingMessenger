import cron from "node-cron";
import Wish from "../models/wish.model.js";
import transporter from "../utils/mailer.js";
import { sendWishEmail } from "../services/wish.service.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

// Every minute check (for demo) → in production, use 0 0 * * * (midnight)
cron.schedule("* * * * *", async () => {
  console.log("⏰ Cron running...");
try{
  const nowUtc = new Date();
 // Find unsent wishes scheduled for past or current UTC time
    const wishes = await Wish.find({
      status: { $ne: "SENT" },
      sendAtUtc: { $lte: nowUtc },
    });

     for (const wish of wishes) {
      await sendWishEmail(wish);
      console.log("Wish sent:", wish.receiverEmail);
    }
  } catch (err) {
    console.error("Cron error:", err);
  }
  // const wishes = await Wish.find({
  //   sendAtUtc: { $lte: nowUtc },
  //   status: "PENDING"
  // });

  // for (const wish of wishes) {
  //   try {
  //     await transporter.sendMail({
  //       from: `"Birthday Bot 🎂" <${process.env.EMAIL_USER}>`,
  //       to: wish.receiverEmail,
  //       subject: "🎉 Happy Birthday!",
  //       html: `<h2>${wish.message}</h2>`
  //     });

  //     wish.status = "SENT";
  //     await wish.save();

  //     console.log("✅ Email sent:", wish.receiverEmail);
  //   } catch (err) {
  //     wish.status = "FAILED";
  //     await wish.save();
  //     console.error("❌ Mail failed:", err.message);
  //   }
  // }
});
