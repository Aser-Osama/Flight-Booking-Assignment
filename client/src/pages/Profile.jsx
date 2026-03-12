import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get("/auth/profile");
        const profileUser = data?.user;

        if (profileUser) {
          setName(profileUser.name ?? "");
          setEmail(profileUser.email ?? "");
          updateUser(profileUser);
        }
      } catch (fetchError) {
        setError(getErrorMessage(fetchError));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [updateUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      name: name.trim(),
      email: email.trim(),
    };

    if (password.trim()) {
      payload.password = password;
    }

    try {
      const { data } = await api.put("/auth/profile", payload);
      const updatedUser = data?.user;

      if (updatedUser) {
        updateUser(updatedUser);
        setName(updatedUser.name ?? "");
        setEmail(updatedUser.email ?? "");
      }

      setPassword("");
      setSuccess("Profile updated successfully");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-gray-700">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-rose-700">My Profile</h1>
        <Link
          to="/"
          className="text-rose-500 hover:text-rose-700 text-base font-medium transition-colors"
        >
          Back to Flights
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6 max-w-2xl">
        {user?.isVerified === false && (
          <p className="text-amber-600 mb-4">Your email is not verified yet.</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="profile-name" className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-colors"
              required
            />
          </div>

          <div>
            <label
              htmlFor="profile-password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              New password (optional)
            </label>
            <input
              id="profile-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg py-2.5 px-5 text-base font-medium transition-colors disabled:bg-rose-300 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {error && <p className="text-red-600 mt-4">{error}</p>}
        {success && <p className="text-green-600 mt-4">{success}</p>}
      </div>
    </div>
  );
};

export default Profile;