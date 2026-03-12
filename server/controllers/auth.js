const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendVerificationEmail = require("../utils/sendEmail");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email?.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = String(Math.floor(100000 + Math.random() * 900000));
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
      verificationCodeExpires,
    });

    await user.save();
    await sendVerificationEmail(email, verificationCode);

    return res.status(201).json({
      message: "Registration successful. Check your email for verification code.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.verificationCodeExpires || user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    if (user.verificationCode !== String(code)) {
      return res.status(400).json({ message: "Invalid code" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password -verificationCode -verificationCodeExpires"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (typeof name === "string" && name.trim()) {
      user.name = name.trim();
    }

    if (typeof email === "string" && email.trim()) {
      const normalizedEmail = email.trim().toLowerCase();

      if (normalizedEmail !== user.email) {
        const emailInUse = await User.findOne({ email: normalizedEmail });

        if (emailInUse && String(emailInUse._id) !== String(user._id)) {
          return res.status(400).json({ message: "Email already in use" });
        }

        user.email = normalizedEmail;
      }
    }

    if (typeof password === "string" && password.trim()) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  getProfile,
  updateProfile,
};
