import { Router } from "express";

import Ride from "../models/Ride.js";
import Vehicle from "../models/Vehicle.js";

import { protect } from "../middleware/auth.js";

const router = Router();


// =====================================================
// START RIDE
// =====================================================

router.post(
  "/start",
  protect,
  async (req, res, next) => {

    try {

      const {
        vehicleId
      } = req.body;


      if (!vehicleId) {

        return res.status(400).json({
          message:
            "Vehicle ID is required."
        });

      }


      // -----------------------------------------------
      // Find vehicle
      // -----------------------------------------------

      const vehicle =
        await Vehicle.findById(
          vehicleId
        );


      if (!vehicle) {

        return res.status(404).json({
          message:
            "Vehicle not found."
        });

      }


      // -----------------------------------------------
      // Check existing active ride
      // -----------------------------------------------

      const existingRide =
        await Ride.findOne({

          user: req.user._id,

          status: {
            $in: [
              "reserved",
              "active"
            ]
          }

        });


      if (existingRide) {

        return res.status(409).json({
          message:
            "You already have an active ride."
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

        vehicle.status =
          "available";

        vehicle.reservedBy =
          null;

        vehicle.reservedAt =
          null;

        vehicle.reservationExpiresAt =
          null;

        await vehicle.save();

      }


      // -----------------------------------------------
      // Check availability
      // -----------------------------------------------

      const isAvailable =
        vehicle.status ===
        "available";


      // -----------------------------------------------
      // Check user's reservation
      // -----------------------------------------------

      const isUserReservation =
        vehicle.status === "reserved" &&
        vehicle.reservedBy &&
        String(
          vehicle.reservedBy
        ) === String(
          req.user._id
        ) &&
        vehicle.reservationExpiresAt &&
        vehicle.reservationExpiresAt >
          new Date();


      if (
        !isAvailable &&
        !isUserReservation
      ) {

        return res.status(409).json({
          message:
            "This vehicle is not available for you."
        });

      }


      // -----------------------------------------------
      // Change vehicle status
      // -----------------------------------------------

      vehicle.status =
        "in_use";

      vehicle.reservedBy =
        null;

      vehicle.reservedAt =
        null;

      vehicle.reservationExpiresAt =
        null;


      await vehicle.save();


      // -----------------------------------------------
      // Create ride
      // -----------------------------------------------

      const ride =
        await Ride.create({

          user:
            req.user._id,

          vehicle:
            vehicle._id,

          status:
            "active",

          startedAt:
            new Date(),

          unlockFee:
            vehicle.unlockFee,

          perMinute:
            vehicle.perMinute

        });


      await ride.populate(
        "vehicle"
      );


      res.status(201).json({
        message:
          "Ride started successfully.",

        ride
      });

    } catch (error) {

      next(error);

    }

  }
);


// =====================================================
// END RIDE
// =====================================================

router.post(
  "/:id/end",
  protect,
  async (req, res, next) => {

    try {

      const ride =
        await Ride.findOne({

          _id: req.params.id,

          user:
            req.user._id,

          status:
            "active"

        }).populate("vehicle");


      if (!ride) {

        return res.status(404).json({
          message:
            "Active ride not found."
        });

      }


      // -----------------------------------------------
      // Calculate duration
      // -----------------------------------------------

      const endedAt =
        new Date();


      const elapsed =
        Math.max(
          1,
          Math.ceil(
            (
              endedAt -
              ride.startedAt
            ) / 60000
          )
        );


      // -----------------------------------------------
      // Calculate fare
      // -----------------------------------------------

      const total =
        Number(
          (
            ride.unlockFee +
            elapsed *
              ride.perMinute
          ).toFixed(2)
        );


      // -----------------------------------------------
      // Update ride
      // -----------------------------------------------

      ride.endedAt =
        endedAt;

      ride.durationMinutes =
        elapsed;

      ride.total =
        total;

      ride.status =
        "completed";


      await ride.save();


      // -----------------------------------------------
      // Release vehicle
      // -----------------------------------------------

      const vehicle =
        await Vehicle.findById(
          ride.vehicle._id
        );


      if (vehicle) {

        vehicle.status =
          "available";

        vehicle.reservedBy =
          null;

        vehicle.reservedAt =
          null;

        vehicle.reservationExpiresAt =
          null;

        await vehicle.save();

      }


      res.json({

        message:
          "Ride completed successfully.",

        ride

      });

    } catch (error) {

      next(error);

    }

  }
);


// =====================================================
// MY RIDES
// =====================================================

router.get(
  "/my",
  protect,
  async (req, res, next) => {

    try {

      const rides =
        await Ride.find({

          user:
            req.user._id

        })
        .populate("vehicle")
        .sort({
          createdAt: -1
        });


      res.json({
        rides
      });

    } catch (error) {

      next(error);

    }

  }
);


// =====================================================
// CURRENT ACTIVE RIDE
// =====================================================

router.get(
  "/active",
  protect,
  async (req, res, next) => {

    try {

      const ride =
        await Ride.findOne({

          user:
            req.user._id,

          status:
            "active"

        })
        .populate("vehicle");


      res.json({
        ride: ride || null
      });

    } catch (error) {

      next(error);

    }

  }
);


export default router;