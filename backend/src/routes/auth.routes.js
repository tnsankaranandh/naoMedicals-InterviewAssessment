const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/password");
const { ROLES } = require("../utils/constants");

const router = express.Router();

/**
 * REGISTER
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, specialization } = req.body;

    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      specialization: role === ROLES.DOCTOR ? specialization : null
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  console.log(1);
  try {
    console.log(2);
    const { email, password } = req.body;
    console.log('email: ', email);
    console.log(3);
    console.log({ email })
    const user = await User.findOne({ email });
    console.log(4);
    console.log(user);
    if (!user) {
      console.log(5);
      return res.status(401).json({ message: "Invalid credentials" });
      console.log(6);
    }

    console.log(password, ' ==== ', user.passwordHash);
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.log('error while executing user mongodb query');
    console.error(err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});


// module.exports = {
//   login,
// };

module.exports = router;
