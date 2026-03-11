const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight",
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  numberOfSeats: {
    type: Number,
    default: 1,
  },
  totalPrice: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["confirmed", "canceled"],
    default: "confirmed",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
