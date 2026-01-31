import Wish from "../models/wish.model.js";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";


dayjs.extend(utc);
dayjs.extend(timezone);

/* =========================
   CREATE WISH (Protected)
========================= */
export const createWish = async (req, res) => {
  try {
    const {receiverEmail, time, message, date } = req.body;

    if (!receiverEmail || !time || !message || !date) {
      return res.status(400).json({ success: false,message: "All fields required" });
    }

    const istDateTime = dayjs.tz(
      `${date} ${time}`,
      "YYYY-MM-DD HH:mm",
      "Asia/Kolkata"
    );
    if (!istDateTime.isValid()) {
      return res.status(400).json({
        success: false,
        message: "Invalid date or time format",
      });
    }
     
    
const sendAtUtc = istDateTime.utc().toDate();
    

    const videoUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/videos/${req.file.filename}`
      : "";

    

    const wish = await Wish.create({
      user: req.user.id,
      receiverEmail,
      message,
      videoUrl,
      sendAtUtc:sendAtUtc,
      timezone: "Asia/Kolkata",
      status: "PENDING",
    });

    res.status(201).json({
      success: true,
      message: "Wish created successfully",
      data: wish,
    });
  } catch (error) {
     console.error("Wish create error:", error);
    res.status(500).json({success:false, message: "Server error" });
  }
};

/* =========================
   GET MY WISHES (Protected)
========================= */
export const getMyWishes = async (req, res) => {
  console.log("fechting wishes for user:", res.user_id);
  try {
    const wishes = await Wish.find({ user: req.user.id }).sort({
      sendAtUtc: 1,
    });

    console.log("FOUND WISHES:", wishes.length);
    res.json({ data: wishes, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* =========================
   UPDATE WISH
========================= */
export const updateWish = async (req, res) => {
  try {
    const { id } = req.params;
    const { receiverEmail, time, message, date } = req.body;

    const wish = await Wish.findOne({ _id: id, user: req.user.id });
    if (!wish) {
      return res.status(404).json({ message: "Wish not found" });
    }

    if (receiverEmail) wish.receiverEmail = receiverEmail;
    if (message) wish.message = message;

    if (date && time) {
      const istDateTime = dayjs.tz(
        `${date} ${time}`,
        "YYYY-MM-DD HH:mm",
        "Asia/Kolkata"
      );
      wish.sendAtUtc = istDateTime.utc().toDate();
    }

    if (req.file) {
      wish.videoUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/videos/${req.file.filename}`;
    }

    await wish.save();

    res.json({
      success: true,
      message: "Wish updated",
      data: wish,
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* =========================
   DELETE WISH
========================= */
export const deleteWish = async (req, res) => {
  try {
    const { id } = req.params;

    const wish = await Wish.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!wish) {
      return res.status(404).json({ message: "Wish not found" });
    }

    res.json({
      success: true,
      message: "Wish deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};