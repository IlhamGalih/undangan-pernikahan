const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

// Koneksi Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Tes API
app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "API Vercel berjalan."
    });
});

// Menerima dan menyimpan lokasi
app.post("/api/location", async (req, res) => {
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

    const { data, error } = await supabase
        .from("locations")
        .insert([
            {
                latitude: latitude,
                longitude: longitude,
                timestamp: timestamp || new Date().toISOString(),
                received_at: new Date().toISOString()
            }
        ])
        .select();

    if (error) {
    console.error("Supabase error:", error);

    return res.status(500).json({
        success: false,
        message: "Gagal menyimpan lokasi.",
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
    });
}
    console.log("Lokasi tersimpan:", data);

    res.json({
        success: true,
        message: "Lokasi berhasil disimpan."
    });
});

// API admin
app.get("/api/locations", async (req, res) => {
    const password = req.headers["x-admin-password"];

    if (password !== "ilhamgalih7802") {
        return res.status(401).json({
            success: false,
            message: "Akses admin ditolak."
        });
    }

    const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error("Supabase error:", error);

        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data lokasi."
        });
    }

    res.json(data);
});

module.exports = app;