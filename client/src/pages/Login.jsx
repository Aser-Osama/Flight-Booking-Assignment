import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";

const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.request) {
    return "Unable to connect to server";
  }

  return "Something went wrong";
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const successMessage = location.state?.message || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      login(data.token, data.user);
      navigate("/");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-10 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-rose-700 mb-1">Login</h1>
        <p className="text-gray-400 text-base mb-6">Welcome back</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-colors"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-lg py-2.5 text-base font-medium transition-colors disabled:bg-rose-300 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {loading && <p className="text-center text-gray-600 mt-3">Loading...</p>}
        {successMessage && <p className="text-center text-green-600 mt-3">{successMessage}</p>}
        {error && <p className="text-center text-red-600 mt-3">{error}</p>}

        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-rose-500 hover:text-rose-700 text-sm transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
