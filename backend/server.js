// Sprint 3 Backend Authentication

require("dotenv").config();

const express = require("express");
const db = require("./db");

const app = express();

app.use(express.json());

// Test Express and MySQL connection
app.get("/api/health", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT DATABASE() AS database_name"
        );

        res.json({
            status: "ok",
            application: "SimplyVision",
            database: rows[0].database_name,
            message: "Express and MySQL connected!"
        });

    } catch (error) {
        console.error("Database error:", error.message);

        res.status(503).json({
            status: "error",
            message: "Database connection failed"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `SimplyVision backend running at http://localhost:${PORT}`
    );
});
