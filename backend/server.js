const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

const locationFile = path.join(
    __dirname,
    "locations.json"
);

const ADMIN_PASSWORD = "ilhamgalih7802";

function checkAdminPassword(req, res, next) {
    const password = req.headers["x-admin-password"];

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({
            success: false,
            message: "Akses admin ditolak."
        });
    }

    next();
}

if (!fs.existsSync(locationFile)) {
    fs.writeFileSync(
        locationFile,
        "[]"
    );
}

app.post(
    "/api/location",
    (req, res) => {

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
                message:
                    "Latitude dan longitude wajib diisi."
            });

        }

        const locationData = {

            latitude: latitude,

            longitude: longitude,

            timestamp:
                timestamp ||
                new Date().toISOString(),

            receivedAt:
                new Date().toISOString()

        };

        let locations = [];

        try {

            const fileContent =
                fs.readFileSync(
                    locationFile,
                    "utf8"
                );

            locations =
                JSON.parse(
                    fileContent
                );

        } catch (error) {

            locations = [];

        }

        locations.push(
            locationData
        );

        fs.writeFileSync(

            locationFile,

            JSON.stringify(
                locations,
                null,
                2
            )

        );

        console.log(
            "Lokasi diterima:",
            locationData
        );

        res.json({

            success: true,

            message:
                "Lokasi berhasil diterima."

        });

    }
);

app.get(
    "/",
    (req, res) => {
        res.sendFile(
            path.join(
                __dirname,
                "index.html"
            )
        );
    }
);

app.get(
    "/admin.html",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "admin.html"
            )
        );

    }
);

/*
 * =========================================
 * API UNTUK HALAMAN ADMIN
 * =========================================
 */

app.get(
    "/api/locations",
    checkAdminPassword,
    (req, res) => {

        try {

            const fileContent =
                fs.readFileSync(
                    locationFile,
                    "utf8"
                );

            const locations =
                JSON.parse(fileContent);

            res.json(locations);

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message:
                    "Gagal membaca data lokasi."

            });

        }

    }
);

app.listen(
    PORT,
    () => {

        console.log(
            "================================="
        );

        console.log(
            "Backend berjalan."
        );

        console.log(
            "http://localhost:" + PORT
        );

        console.log(
            "================================="
        );

    }
);