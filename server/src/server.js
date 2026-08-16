import "dotenv/config";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import rideRoutes from "./routes/ride.routes.js";
import pricingRoutes from "./routes/pricing.routes.js";


const app = express();


/* =====================================================
   CORS
===================================================== */

const allowedOrigin =
  process.env.CLIENT_URL ||
  "http://localhost:5173";


app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,

    methods: [
      "GET",
      "HEAD",
      "PUT",
      "PATCH",
      "POST",
      "DELETE",
      "OPTIONS"
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);


/* =====================================================
   BODY PARSER
===================================================== */

app.use(
  express.json()
);


/* =====================================================
   REQUEST LOGGER
   Temporary but useful for debugging
===================================================== */

app.use(
  (req, res, next) => {

    console.log(
      `${new Date().toISOString()} ${req.method} ${req.originalUrl}`
    );

    next();
  }
);


/* =====================================================
   HEALTH CHECK
===================================================== */

app.get(
  "/api/health",
  (req, res) => {

    res.json({
      ok: true,
      service: "Eco Rentels API"
    });

  }
);


/* =====================================================
   ROUTES
===================================================== */

app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/vehicles",
  vehicleRoutes
);


app.use(
  "/api/rides",
  rideRoutes
);


app.use(
  "/api/pricing",
  pricingRoutes
);


/* =====================================================
   404 HANDLER
===================================================== */

app.use(
  (req, res) => {

    res.status(404).json({
      message: `Route not found: ${req.method} ${req.originalUrl}`
    });

  }
);


/* =====================================================
   GLOBAL ERROR HANDLER
===================================================== */

app.use(
  (err, req, res, next) => {

    console.error(
      "SERVER ERROR:",
      err
    );

    res.status(
      err.status || 500
    ).json({
      message:
        err.message ||
        "Server error"
    });

  }
);


/* =====================================================
   SERVER START
===================================================== */

const PORT =
  Number(process.env.PORT) ||
  5000;


async function startServer() {

  try {

    if (!process.env.MONGO_URI) {

      throw new Error(
        "MONGO_URI is missing from server/.env"
      );

    }


    if (!process.env.JWT_SECRET) {

      throw new Error(
        "JWT_SECRET is missing from server/.env"
      );

    }


    console.log(
      "Connecting to MongoDB..."
    );


    await mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 10000
      }
    );


    console.log(
      "MongoDB connected"
    );


    app.listen(
      PORT,
      () => {

        console.log(
          `API running on http://localhost:${PORT}`
        );

      }
    );

  } catch (error) {

    console.error(
      "SERVER STARTUP FAILED:"
    );

    console.error(
      error.message
    );

    process.exit(1);

  }
}


startServer();