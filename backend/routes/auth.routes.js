
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { sendOtpEmail } from "../config/mail.js";
import authMiddleware from "../middlewares/auth.middleware.js";


const router = express.Router();

/* ======================
   SEND OTP
====================== */
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.findOneAndUpdate(
      { email },
      {
        otp,
        otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      },
      { upsert: true }
    );

    await sendOtpEmail(email, otp);

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP send failed" });
  }
});

/* ======================
   VERIFY OTP + REGISTER
====================== */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ success: true, message: "Account created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

/* ======================
   LOGIN
====================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
     console.log("LOGIN EMAIL:", email);
    console.log("LOGIN PASSWORD:", password);

    const user = await User.findOne({ email });
    console.log("USER FOUND:", user);
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
     console.log("PASSWORD MATCH:", match);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

/* ======================
   GET LOGGED IN USER
====================== */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});


export default router;











// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";

// const router = express.Router();

// import { transporter } from "../config/mail.js";

// /* ======================
//    SEND OTP (EMAIL)
// ====================== */
// router.post("/send-otp", async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ message: "Email required" });

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     let user = await User.findOne({ email });
//     if (!user) user = await User.create({ email });

//     user.otp = otp;
//     user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
//     await user.save();

//     // 📧 SEND EMAIL
//     const info =await transporter.sendMail({
//       from: `"Wish App 🎉" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Your OTP for Wish App",
//       html: `
//         <h2>Your OTP</h2>
//         <p><b>${otp}</b></p>
//         <p>Valid for 5 minutes</p>
//       `,
//     });
//     console.log("📨 Mail response:", info);
//     res.json({ success: true, message: "OTP sent to email" });
//   } catch (err) {
//     console.error("OTP email error:", err);
//     res.status(500).json({ message: "OTP sending failed" });
//   }
// });



// /* ======================
//    VERIFY OTP + REGISTER
// ====================== */
// router.post("/verify-otp-register", async (req, res) => {
//   try {
//     const { email, otp, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     if (user.otp !== otp || user.otpExpiry < Date.now()) {
//       return res.status(400).json({ message: "Invalid / expired OTP" });
//     }

//     user.password = await bcrypt.hash(password, 10);
//     user.isEmailVerified = true;
//     user.otp = null;
//     user.otpExpiry = null;
//     await user.save();

//     res.json({ success: true, message: "Registered successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Register failed" });
//   }
// });

// /* ======================
//    LOGIN (EMAIL + PASSWORD)
// ====================== */
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user || !user.isEmailVerified)
//       return res.status(400).json({ message: "User not verified" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ message: "Invalid password" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.json({
//       success: true,
//       token,
//       user: { id: user._id, email: user.email },
//     });
//   } catch {
//     res.status(500).json({ message: "Login failed" });
//   }
// });

// export default router;
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";

// const router = express.Router();

// /* ======================
//    REGISTER (DEV MODE – email OTP / mobile skip)
// ====================== */
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body; // mobile skipped for now

//     if (!name || !email || !password)
//       return res.status(400).json({ message: "All fields required" });

//     const exists = await User.findOne({ email });
//     if (exists)
//       return res.status(400).json({ message: "Email already registered" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       otp,              // mock OTP
//       otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
//       isPhoneVerified: true, // mobile skipped, mark verified for now
//     });

//     console.log("📧 DEV OTP (email / console):", otp);

//     res.status(201).json({
//       success: true,
//       message: "Registration successful (DEV MODE). OTP in console",
//       otp, // send OTP in response for testing
//     });
//   } catch (err) {
//     console.error("Register error:", err);
//     res.status(500).json({ message: "Registration failed", error: err.message });
//   }
// });

// /* ======================
//    LOGIN EMAIL + PASSWORD
// ====================== */
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ message: "Invalid password" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.json({ success: true, token, user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Login failed" });
//   }
// });

// export default router;
