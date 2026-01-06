import express from "express";
import User from "../models/user.model.js";
import { generateOTP } from "../utils/otp.js";

const router = express.Router();

/* SEND OTP */
router.post("/send", async (req, res) => {
  const { phone } = req.body;
  const otp = generateOTP();

  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  await User.findOneAndUpdate(
    { phone },
    { otp, otpExpiry: expiry },
    { upsert: true }
  );

  console.log("OTP (dev only):", otp); // 🔴 SMS later

  res.json({ success: true });
});

/* VERIFY OTP */
router.post("/verify", async (req, res) => {
  const { phone, otp } = req.body;

  const user = await User.findOne({ phone });
  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.otp !== otp || user.otpExpiry < new Date())
    return res.status(400).json({ message: "Invalid OTP" });

  user.isPhoneVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ success: true });
});

export default router;
