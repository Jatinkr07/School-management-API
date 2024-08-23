const express = require("express");
const app = express();
const schoolRoutes = require("./routes/school");

// Middleware to parse JSON bodies
app.use(express.json());

// Use the school routes
app.use("/api", schoolRoutes);

// Define the server port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
