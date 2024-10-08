const db = require("../config/db");

// Add School
const addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, parseFloat(latitude), parseFloat(longitude)]
    );
    res.status(201).json({
      message: "School added successfully",
      schoolId: result.insertId,
    });
  } catch (err) {
    console.error("Error adding school:", err);
    res.status(500).json({ error: "Failed to add school" });
  }
};

// List Schools
const listSchools = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (latitude === undefined || longitude === undefined) {
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
          parseFloat(latitude),
          parseFloat(longitude),
          school.latitude,
          school.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);
  } catch (err) {
    console.error("Error fetching schools:", err);
    res.status(500).json({ error: "Failed to fetch schools" });
  }
};

// Calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

module.exports = { addSchool, listSchools };
