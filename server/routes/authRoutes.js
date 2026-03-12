const express = require("express");
const {
	register,
	login,
	verifyEmail,
	getProfile,
	updateProfile,
} = require("../controllers/auth");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verifyEmail);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
