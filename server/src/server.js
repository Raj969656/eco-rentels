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
   CONFIGURATION
===================================================== */

const PORT =
  Number(process.env.PORT) || 5000;

const CLIENT_URL =
  process.env.CLIENT_URL ||
  "http://localhost:5173";


/* =====================================================
   CORS
===================================================== */

const allowedOrigins = CLIENT_URL
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);


app.use(
  cors({
    origin: (origin, callback) => {

      /*
       * Allow requests without an Origin header.
       *
       * This is useful for:
       * - curl
       * - Postman
       * - server-to-server requests
       */

      if (!origin) {
        return callback(null, true);
      }


      /*
       * Allow configured frontend origins.
       */

      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }


      console.warn(
        "CORS blocked origin:",
        origin
      );


      return callback(
        new Error(
          `CORS blocked origin: ${origin}`
        )
      );
    },

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
  express.json({
    limit: "1mb"
  })
);


/* =====================================================
   REQUEST LOGGER
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

    res.status(200).json({
      ok: true,
      service: "Eco Rentels API",
      environment:
        process.env.NODE_ENV ||
        "development",
      timestamp:
        new Date().toISOString()
    });

  }
);


/* =====================================================
   AUTH ROUTES
===================================================== */

app.use(
  "/api/auth",
  authRoutes
);


/* =====================================================
   VEHICLE ROUTES
===================================================== */

app.use(
  "/api/vehicles",
  vehicleRoutes
);


/* =====================================================
   RIDE ROUTES
===================================================== */

app.use(
  "/api/rides",
  rideRoutes
);


/* =====================================================
   PRICING ROUTES
===================================================== */

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
      message:
        `Route not found: ${req.method} ${req.originalUrl}`
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


    /*
     * Handle CORS errors
     */

    if (
      err.message &&
      err.message.startsWith(
        "CORS blocked origin:"
      )
    ) {

      return res.status(403).json({
        message:
          "CORS policy blocked this request."
      });

    }


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
   DATABASE + SERVER START
===================================================== */

async function startServer() {

  try {

    /*
     * Check required environment variables
     */

    if (!process.env.MONGO_URI) {

      throw new Error(
        "MONGO_URI is missing from environment variables."
      );

    }


    if (!process.env.JWT_SECRET) {

      throw new Error(
        "JWT_SECRET is missing from environment variables."
      );

    }


    console.log(
      "----------------------------------------"
    );

    console.log(
      "Eco Rentels API starting..."
    );

    console.log(
      `Environment: ${
        process.env.NODE_ENV ||
        "development"
      }`
    );

    console.log(
      `Port: ${PORT}`
    );

    console.log(
      `Client URL: ${CLIENT_URL}`
    );

    console.log(
      "Connecting to MongoDB..."
    );


    /*
     * MongoDB connection
     */

    await mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 10000
      }
    );


    console.log(
      "MongoDB connected successfully"
    );


    /*
     * Start Express
     *
     * 0.0.0.0 is important for Render.
     */

    app.listen(
      PORT,
      "0.0.0.0",
      () => {

        console.log(
          "----------------------------------------"
        );

        console.log(
          `Eco Rentels API running on port ${PORT}`
        );

        console.log(
          `Health check: /api/health`
        );

        console.log(
          "----------------------------------------"
        );

      }
    );

  } catch (error) {

    console.error(
      "----------------------------------------"
    );

    console.error(
      "SERVER STARTUP FAILED"
    );

    console.error(
      error.message
    );

    console.error(
      "----------------------------------------"
    );


    /*
     * Close MongoDB connection
     * if it was partially opened.
     */

    try {

      await mongoose.connection.close();

    } catch {
      // Ignore close errors
    }


    process.exit(1);

  }

}


/* =====================================================
   START APPLICATION
===================================================== */

startServer();