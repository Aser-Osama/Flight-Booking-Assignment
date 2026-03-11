const Booking = require("../models/Booking");
const Flight = require("../models/Flight");

const createBooking = async (req, res) => {
  try {
    const { flightId, numberOfSeats = 1 } = req.body;

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    if (flight.availableSeats < numberOfSeats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    flight.availableSeats -= numberOfSeats;
    await flight.save();

    const booking = await Booking.create({
      user: req.userId,
      flight: flightId,
      numberOfSeats,
      totalPrice: flight.price * numberOfSeats,
    });

    const populatedBooking = await Booking.findById(booking._id).populate("flight");

    return res.status(201).json(populatedBooking);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Flight not found" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId }).populate("flight");
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.userId });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const flight = await Flight.findById(booking.flight);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    if (booking.status !== "canceled") {
      booking.status = "canceled";
      flight.availableSeats += booking.numberOfSeats;
      await flight.save();
      await booking.save();
    }

    const updatedBooking = await Booking.findById(booking._id).populate("flight");

    return res.status(200).json(updatedBooking);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
};
