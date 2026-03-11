const express = require("express");
const { getBookings, createBooking } = require("../controllers/bookings");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getBookings);
router.post("/", protect, createBooking);

module.exports = router;
