const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const ADMIN_PASSWORD = "ilhamgalih7802";

// Tes API
app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "API Vercel berjalan."
    });
});

// Menerima lokasi
app.post("/api/location", (req, res) => {
    const {
        latitude,
        longitude,
        timestamp
    } = req.body;

    if (
        typeof latitude !== "number" ||
        typeof longitude !== "number"
    ) {
        return res.status(400).json({
            success: false,
            message: "Latitude dan longitude wajib diisi."
        });
    }

    console.log("Lokasi diterima:", {
        latitude,
        longitude,
        timestamp
    });

    res.json({
        success: true,
        message: "Lokasi berhasil diterima."
    });
});

// API admin sementara
app.get("/api/locations", (req, res) => {
    const password = req.headers["x-admin-password"];

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({
            success: false,
            message: "Akses admin ditolak."
        });
    }

    res.json([]);
});

module.exports = app;