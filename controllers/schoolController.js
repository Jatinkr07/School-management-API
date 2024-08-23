const db = require("../config/db");

// Add School Controller
const addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, latitude, longitude]
    );
    res
      .status(201)
      .json({
        message: "School added successfully",
        schoolId: result.insertId,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add school" });
  }
};

// List Schools Controller
const listSchools = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "User latitude and longitude are required" });
  }

  try {
    const [schools] = await db.query("SELECT * FROM schools");
    const sortedSchools = schools
      .map((school) => ({
        ...school,
        distance: calculateDistance(
          latitude,
          longitude,
          school.latitude,
          school.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch schools" });
  }
};

// Calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

module.exports = { addSchool, listSchools };
