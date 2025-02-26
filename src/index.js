const express = require("express");
const journalRoutes = require("./routes/journalRoutes");

const app = express();
app.use(express.json());
app.use("/api", journalRoutes);

//hello world endpoint
app.get("/api/hello", (req, res) => {
  res.status(200).json({
    message: "Hello world!",
    timestamp: new Date().toISOString(),
    info: "This endpoint was added via CI/CD pipeline",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
