const register = (req, res) => {
  res.status(501).json({ message: "Register endpoint not implemented yet." });
};

const login = (req, res) => {
  res.status(501).json({ message: "Login endpoint not implemented yet." });
};

const verifyEmail = (req, res) => {
  res.status(501).json({ message: "Email verification endpoint not implemented yet." });
};

module.exports = {
  register,
  login,
  verifyEmail,
};
