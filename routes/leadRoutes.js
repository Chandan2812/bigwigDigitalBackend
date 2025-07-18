const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  getAllLeads,
} = require("../controllers/leadController");

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.get("/all", getAllLeads);

module.exports = router;
