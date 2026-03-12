import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateEmail = location.state?.email || "";

  const [email, setEmail] = useState(stateEmail);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/verify", {
        email: email.trim(),
        code,
      });

      navigate("/login", {
        state: { message: "Email verified! You can now log in." },
      });
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-10 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-rose-700 mb-1">Verify Email</h1>
        <p className="text-gray-400 text-base mb-6">Confirm your account</p>

        <p className="text-sm text-gray-400 mb-4">Code expires in 10 minutes.</p>
        {stateEmail ? (
          <p className="text-sm text-gray-400 mb-4">Verifying: {email}</p>
        ) : (
          <div className="mb-4">
            <label
              htmlFor="verify-email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email
            </label>
            <input
              id="verify-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-colors"
              required
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-600 mb-1">
              6-digit verification code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-lg py-2.5 text-base font-medium transition-colors disabled:bg-rose-300 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Verify"}
          </button>
        </form>

        {loading && <p className="text-center text-gray-600 mt-3">Loading...</p>}
        {error && <p className="text-center text-red-600 mt-3">{error}</p>}

        <p className="text-center text-sm text-gray-600 mt-4">
          <Link to="/login" className="text-rose-500 hover:text-rose-700 text-sm transition-colors">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Verify;
