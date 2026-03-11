const protect = (req, res, next) => {
  return res.status(501).json({ message: "JWT middleware not implemented yet." });
};

module.exports = protect;
