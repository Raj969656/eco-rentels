import { Router } from "express";

import Vehicle from "../models/Vehicle.js";

import { protect } from "../middleware/auth.js";

const router = Router();


// =====================================================
// HELPER
// Release expired reservations
// =====================================================

async function releaseExpiredReservations() {
  await Vehicle.updateMany(
    {
      status: "reserved",
      reservationExpiresAt: {
        $lte: new Date()
      }
    },
    {
      $set: {
        status: "available",
        reservedBy: null,
        reservedAt: null,
        reservationExpiresAt: null
      }
    }
  );
}


// =====================================================
// GET ALL VEHICLES
// =====================================================

router.get("/", async (req, res, next) => {
  try {

    await releaseExpiredReservations();

    const filter = {};

    if (
      req.query.type &&
      req.query.type !== "all"
    ) {
      filter.type = req.query.type;
    }

    const vehicles = await Vehicle
      .find(filter)
      .sort({ createdAt: -1 });

    res.json({
      vehicles
    });

  } catch (error) {
    next(error);
  }
});


// =====================================================
// GET SINGLE VEHICLE
// =====================================================

router.get("/:id", async (req, res, next) => {
  try {

    const vehicle =
      await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    // Check expired reservation
    if (
      vehicle.status === "reserved" &&
      vehicle.reservationExpiresAt &&
      vehicle.reservationExpiresAt <= new Date()
    ) {

      vehicle.status = "available";
      vehicle.reservedBy = null;
      vehicle.reservedAt = null;
      vehicle.reservationExpiresAt = null;

      await vehicle.save();
    }

    res.json({
      vehicle
    });

  } catch (error) {
    next(error);
  }
});


// =====================================================
// RESERVE VEHICLE
// =====================================================

router.post(
  "/:id/reserve",
  protect,
  async (req, res, next) => {

    try {

      const vehicle =
        await Vehicle.findById(req.params.id);

      if (!vehicle) {
        return res.status(404).json({
          message: "Vehicle not found"
        });
      }


      // -----------------------------------------------
      // Release expired reservation
      // -----------------------------------------------

      if (
        vehicle.status === "reserved" &&
        vehicle.reservationExpiresAt &&
        vehicle.reservationExpiresAt <= new Date()
      ) {

        vehicle.status = "available";
        vehicle.reservedBy = null;
        vehicle.reservedAt = null;
        vehicle.reservationExpiresAt = null;

        await vehicle.save();
      }


      // -----------------------------------------------
      // Vehicle unavailable
      // -----------------------------------------------

      if (vehicle.status !== "available") {

        return res.status(409).json({
          message:
            "This vehicle is no longer available."
        });
      }


      // -----------------------------------------------
      // User already has reservation
      // -----------------------------------------------

      const existingReservation =
        await Vehicle.findOne({
          reservedBy: req.user._id,

          status: "reserved",

          reservationExpiresAt: {
            $gt: new Date()
          }
        });

      if (existingReservation) {

        return res.status(409).json({
          message:
            "You already have a reserved vehicle."
        });
      }


      // -----------------------------------------------
      // Create 10 minute reservation
      // -----------------------------------------------

      const now = new Date();

      const expiresAt =
        new Date(
          now.getTime() +
          10 * 60 * 1000
        );


      vehicle.status = "reserved";

      vehicle.reservedBy =
        req.user._id;

      vehicle.reservedAt =
        now;

      vehicle.reservationExpiresAt =
        expiresAt;


      await vehicle.save();


      res.json({

        message:
          "Vehicle reserved for 10 minutes.",

        vehicle

      });

    } catch (error) {

      next(error);

    }

  }
);


// =====================================================
// CANCEL RESERVATION
// =====================================================

router.post(
  "/:id/cancel-reservation",
  protect,
  async (req, res, next) => {

    try {

      const vehicle =
        await Vehicle.findOne({
          _id: req.params.id,

          reservedBy:
            req.user._id,

          status: "reserved"
        });

      if (!vehicle) {

        return res.status(404).json({
          message:
            "Reservation not found."
        });

      }


      vehicle.status =
        "available";

      vehicle.reservedBy =
        null;

      vehicle.reservedAt =
        null;

      vehicle.reservationExpiresAt =
        null;


      await vehicle.save();


      res.json({

        message:
          "Reservation cancelled.",

        vehicle

      });

    } catch (error) {

      next(error);

    }

  }
);


export default router;