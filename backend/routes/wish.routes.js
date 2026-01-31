import express from "express";
import multer from "multer";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createWish,
  getMyWishes,
  updateWish,
  deleteWish
} from "../controllers/wish.controller.js";

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

/* ================= ROUTES ================= */

// 🔐 Create wish
router.post(
  "/",
  authMiddleware,
  upload.single("video"),
  createWish
);

// 🔐 Get logged-in user's wishes
router.get("/", authMiddleware, getMyWishes);

// ✏️ Update wish
router.put("/:id", authMiddleware, upload.single("video"), updateWish);

// 🗑 Delete wish
router.delete("/:id", authMiddleware, deleteWish);

export default router;
