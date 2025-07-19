const express = require("express");
const router = express.Router();
const upload = require("../config/resumeStorage");

const {
  submitApplication,
} = require("../controllers/jobApplicationController");

router.post("/submit-job", upload.single("resume"), submitApplication);

module.exports = router;
