const getFlights = (req, res) => {
  res.status(501).json({ message: "Get flights endpoint not implemented yet." });
};

const getFlightById = (req, res) => {
  res.status(501).json({ message: "Get flight by ID endpoint not implemented yet." });
};

const createFlight = (req, res) => {
  res.status(501).json({ message: "Create flight endpoint not implemented yet." });
};

module.exports = {
  getFlights,
  getFlightById,
  createFlight,
};
