import { useEffect, useState } from "react";
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

const formatDate = (dateValue) => {
  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString();
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingBookingId, setCancelingBookingId] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get("/bookings/my");
        setBookings(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        setError(getErrorMessage(fetchError));
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    setError("");
    setCancelingBookingId(bookingId);

    try {
      const { data } = await api.patch(`/bookings/${bookingId}/cancel`);

      setBookings((previousBookings) =>
        previousBookings.map((booking) => {
          if (booking._id !== bookingId) {
            return booking;
          }

          return {
            ...booking,
            ...data,
            status: data?.status || "canceled",
          };
        })
      );
    } catch (cancelError) {
      setError(getErrorMessage(cancelError));
    } finally {
      setCancelingBookingId("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-rose-700">My Bookings</h1>
        <Link
          to="/"
          className="text-rose-500 hover:text-rose-700 text-base font-medium transition-colors"
        >
          Search Flights
        </Link>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && bookings.length === 0 && <p>No bookings yet</p>}

      {!loading && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const flight = booking.flight || {};
            const isConfirmed = booking.status === "confirmed";

            return (
              <div
                key={booking._id}
                className="bg-white rounded-xl border border-rose-100 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
                  Flight {flight.flightNumber || "N/A"}
                </p>
                <p className="text-gray-800 font-semibold text-xl">
                  {flight.from || "N/A"} → {flight.to || "N/A"}
                </p>
                <p className="text-gray-400 text-base mt-1">
                  Date: {flight.date ? formatDate(flight.date) : "N/A"}
                </p>
                <p className="mt-3 text-base">Number of seats: {booking.numberOfSeats}</p>
                <p className="text-rose-500 text-lg font-semibold mt-1">Total price: ${booking.totalPrice}</p>

                <p className="mt-3">
                  Status:{" "}
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      isConfirmed ? "bg-rose-50 text-rose-600" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>

                {isConfirmed && (
                  <button
                    type="button"
                    onClick={() => handleCancel(booking._id)}
                    disabled={cancelingBookingId === booking._id}
                    className="mt-4 text-sm border border-red-200 text-red-400 hover:bg-red-50 rounded-md px-3 py-1 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {cancelingBookingId === booking._id ? "Canceling..." : "Cancel"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookings;
