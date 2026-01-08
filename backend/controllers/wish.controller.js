import Wish from "../models/wish.model.js";

/* =========================
   CREATE WISH (Protected)
========================= */
export const createWish = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newWish = await Wish.create({
      title,
      message,
      user: req.user.id, // 🔐 logged-in user
    });

    res.status(201).json({
      message: "Wish created successfully",
      data: newWish,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET MY WISHES (Protected)
========================= */
export const getMyWishes = async (req, res) => {
  try {
    const wishes = await Wish.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({ data: wishes });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
