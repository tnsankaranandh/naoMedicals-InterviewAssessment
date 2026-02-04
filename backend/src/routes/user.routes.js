const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

/**
 * GET ALL DOCTORS
 */
router.get(
  "/doctors",
  auth,
  role([ROLES.PATIENT]),
  async (req, res) => {
    const doctors = await User.find({ role: ROLES.DOCTOR }).select("-passwordHash");
    res.json(doctors);
  }
);

/**
 * GET ALL PATIENTS
 */
router.get(
  "/patients",
  auth,
  role([ROLES.DOCTOR]),
  async (req, res) => {
    const patients = await User.find({ role: ROLES.PATIENT }).select("-passwordHash");
    res.json(patients);
  }
);

module.exports = router;
