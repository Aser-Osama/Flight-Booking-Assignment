const Flight = require("../models/Flight");

const getFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    return res.status(200).json(flights);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const searchFlights = async (req, res) => {
  try {
    const { from, to, date } = req.query;
    const filter = {};

    if (from) {
      filter.from = { $regex: from, $options: "i" };
    }

    if (to) {
      filter.to = { $regex: to, $options: "i" };
    }

    if (date) {
      const parsedDate = new Date(date);

      if (!Number.isNaN(parsedDate.getTime())) {
        const startOfDay = new Date(
          Date.UTC(
            parsedDate.getUTCFullYear(),
            parsedDate.getUTCMonth(),
            parsedDate.getUTCDate()
          )
        );
        const startOfNextDay = new Date(startOfDay);
        startOfNextDay.setUTCDate(startOfNextDay.getUTCDate() + 1);

        filter.date = {
          $gte: startOfDay,
          $lt: startOfNextDay,
        };
      }
    }

    const flights = await Flight.find(filter);
    return res.status(200).json(flights);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    return res.status(200).json(flight);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Flight not found" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

const createFlight = async (req, res) => {
  try {
    const { flightNumber, from, to, date, totalSeats, availableSeats, price } = req.body;

    if (
      flightNumber === undefined ||
      from === undefined ||
      to === undefined ||
      date === undefined ||
      totalSeats === undefined ||
      availableSeats === undefined ||
      price === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const flight = await Flight.create({
      flightNumber,
      from,
      to,
      date,
      totalSeats,
      availableSeats,
      price,
    });

    return res.status(201).json(flight);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    return res.status(200).json(flight);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Flight not found" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    return res.status(200).json({ message: "Flight deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Flight not found" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getFlights,
  searchFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight,
};
