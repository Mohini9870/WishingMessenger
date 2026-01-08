import express from "express";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import Wish from "../models/wish.model.js";
import authMiddleware from "../middlewares/auth.middleware.js"
import {
  createWish,
  getMyWishes,
} from "../controllers/wish.controller.js";
import multer from "multer";


dayjs.extend(utc);
dayjs.extend(timezone);

const router = express.Router();

/* ================= MULTER CONFIG ================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/videos");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, ""));
  },
});

const upload = multer({ storage });

/* ================= POST : CREATE WISH ================= */

router.post("/", upload.single("video"), async (req, res) => {
  try {
    const { receiverEmail, message, date, time } = req.body;

    const videoUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/videos/${req.file.filename}`
      : "";

    const istDateTime = dayjs.tz(`${date} ${time}`, "Asia/Kolkata");
    const sendAtUtc = istDateTime.utc().toDate();

    const wish = await Wish.create({
      receiverEmail,
      message,
      videoUrl,
      sendAtUtc,
      timezone: "Asia/Kolkata",
      status: "PENDING",
    });

    res.status(201).json({
      success: true,
      data: wish,
    });
  } catch (error) {
    console.error("Wish create error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

/* ================= GET : ALL WISHES ================= */

router.get("/", async (req, res) => {
  try {
    const wishes = await Wish.find().sort({ sendAtUtc: 1 });

    res.json({
      success: true,
      data: wishes,
    });
  } catch (error) {
    console.error("Fetch wishes error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.post("/", authMiddleware, createWish);   // 🔐
router.get("/", authMiddleware, getMyWishes);

export default router;
