const express = require("express");
const {
	getFlights,
	searchFlights,
	getFlightById,
	createFlight,
	updateFlight,
	deleteFlight,
} = require("../controllers/flights");

const router = express.Router();

router.get("/", getFlights);
router.get("/search", searchFlights);
router.get("/:id", getFlightById);
router.post("/", createFlight);
router.put("/:id", updateFlight);
router.delete("/:id", deleteFlight);

module.exports = router;
