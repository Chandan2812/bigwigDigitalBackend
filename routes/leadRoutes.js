const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  getAllLeads,
  getLeadsLast10Days,
} = require("../controllers/leadController");

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.get("/all", getAllLeads);
router.get("/last10days", getLeadsLast10Days);

module.exports = router;
