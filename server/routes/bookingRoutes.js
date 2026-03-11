const express = require("express");
const { createBooking, getMyBookings, cancelBooking } = require("../controllers/bookings");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createBooking);
router.get("/my", getMyBookings);
router.patch("/:id/cancel", cancelBooking);

module.exports = router;
