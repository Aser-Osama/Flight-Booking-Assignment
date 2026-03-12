import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.request) {
    return "Unable to connect to server";
  }

  return "Something went wrong";
};

const formatDateTime = (dateValue) => {
  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleString();
};

const Home = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [bookingFlightId, setBookingFlightId] = useState("");
  const [numberOfSeats, setNumberOfSeats] = useState("1");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  const fetchFlights = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/flights");
      setFlights(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setBookingSuccess("");

    const queryParams = new URLSearchParams();

    if (from.trim()) {
      queryParams.set("from", from.trim());
    }

    if (to.trim()) {
      queryParams.set("to", to.trim());
    }

    if (date) {
      queryParams.set("date", date);
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/flights/search?${queryString}`
      : "/flights/search";

    try {
      const { data } = await api.get(endpoint);
      setFlights(Array.isArray(data) ? data : []);
    } catch (searchError) {
      setError(getErrorMessage(searchError));
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowAllFlights = async () => {
    setBookingSuccess("");
    await fetchFlights();
  };

  const handleBookClick = (flightId) => {
    setBookingFlightId(flightId);
    setNumberOfSeats("1");
    setBookingError("");
    setBookingSuccess("");
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();

    const parsedSeats = Number(numberOfSeats);
    if (!Number.isInteger(parsedSeats) || parsedSeats < 1) {
      setBookingError("Please enter a valid number of seats");
      return;
    }

    setBookingLoading(true);
    setBookingError("");
    setBookingSuccess("");

    try {
      await api.post("/bookings", {
        flightId: bookingFlightId,
        numberOfSeats: parsedSeats,
      });

      setBookingSuccess("Booking successful");
      setBookingFlightId("");
      setNumberOfSeats("1");
      await fetchFlights();
    } catch (submitError) {
      setBookingError(getErrorMessage(submitError));
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-700">
      <h1 className="text-4xl md:text-5xl font-semibold text-rose-700 mb-8">Find Flights</h1>

      <form
        onSubmit={handleSearchSubmit}
        className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6 mb-8 flex flex-col md:flex-row md:items-end gap-5"
      >
        <div className="flex-1">
          <label
            htmlFor="from"
            className="block text-xs uppercase tracking-wide font-medium text-gray-400 mb-2"
          >
            From
          </label>
          <input
            id="from"
            type="text"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-colors"
          />
        </div>

        <div className="flex-1">
          <label
            htmlFor="to"
            className="block text-xs uppercase tracking-wide font-medium text-gray-400 mb-2"
          >
            To
          </label>
          <input
            id="to"
            type="text"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-colors"
          />
        </div>

        <div className="flex-1">
          <label
            htmlFor="date"
            className="block text-xs uppercase tracking-wide font-medium text-gray-400 mb-2"
          >
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-rose-500 hover:bg-rose-600 text-white py-2.5 px-5 text-base font-medium rounded-lg transition-colors disabled:bg-rose-300 disabled:cursor-not-allowed"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleShowAllFlights}
          disabled={loading}
          className="border border-rose-200 text-rose-600 py-2.5 px-5 text-base font-medium rounded-lg hover:bg-rose-50 transition-colors disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed"
        >
          Show All Flights
        </button>
      </form>

      {loading && <p className="text-gray-700 mb-4">Loading...</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {bookingSuccess && (
        <div className="mt-4">
          <p className="text-green-600">{bookingSuccess}</p>
          <Link
            to="/bookings"
            className="text-rose-500 hover:text-rose-700 text-sm font-medium transition-colors"
          >
            View My Bookings
          </Link>
        </div>
      )}
      {bookingError && <p className="text-red-600 mt-4">{bookingError}</p>}

      {!loading && !error && flights.length === 0 && <p className="mt-4">No flights found</p>}

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 mt-6">
        {flights.map((flight) => (
          <div
            key={flight._id}
            className="bg-white rounded-xl border border-rose-100 shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
              Flight {flight.flightNumber}
            </p>
            <p className="text-gray-800 font-semibold text-xl">
              {flight.from} → {flight.to}
            </p>
            <p className="text-gray-400 text-base mt-1">{formatDateTime(flight.date)}</p>
            <p className="mt-2 text-rose-500 text-lg font-semibold">Price: ${flight.price}</p>
            <p
              className={`text-base mt-1 ${
                flight.availableSeats <= 5 ? "text-red-400" : "text-gray-400"
              }`}
            >
              Available seats: {flight.availableSeats}
            </p>

            <button
              type="button"
              onClick={() => handleBookClick(flight._id)}
              disabled={flight.availableSeats === 0 || bookingLoading}
              className={`mt-4 text-base font-medium rounded-lg px-4 py-2 text-white transition-colors ${
                flight.availableSeats === 0 || bookingLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-rose-500 hover:bg-rose-600"
              }`}
            >
              Book
            </button>

            {bookingFlightId === flight._id && (
              <form onSubmit={handleBookingSubmit} className="mt-4 space-y-2">
                <label
                  htmlFor={`seats-${flight._id}`}
                  className="block text-sm font-medium text-gray-600"
                >
                  Number of seats
                </label>
                <input
                  id={`seats-${flight._id}`}
                  type="number"
                  min="1"
                  max={String(flight.availableSeats)}
                  value={numberOfSeats}
                  onChange={(event) => setNumberOfSeats(event.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400"
                  required
                />
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg transition-colors disabled:bg-rose-300 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? "Booking..." : "Confirm Booking"}
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
