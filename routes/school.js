const express = require("express");
const router = express.Router();
const { addSchool, listSchools } = require("../controllers/schoolController");

// Route for adding a school
router.post("/addSchool", addSchool);

// Route for listing schools sorted by proximity
router.get("/listSchools", listSchools);

module.exports = router;
