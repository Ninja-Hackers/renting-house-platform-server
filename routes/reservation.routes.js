const router = require("express").Router();
const mongoose = require("mongoose");

const House = require("../models/House.model");
const Reservation = require("../models/Reservation.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const attachCurrentUser = require("../middleware/attachCurrentUser");

// POST /api/reservations  -  Creates a new reservation

router.post(
  "/reservations",
  isAuthenticated,
  attachCurrentUser,
  (req, res, next) => {
    const { checkIn, checkOut, numberOfGuests, houseId } = req.body;

    const newReservation = {
      checkIn,
      checkOut,
      numberOfGuests,
      userId: req.currentUser._id,
      house: houseId,
    };

    if (!checkIn) {
      return res.status(400).json({ message: "Please provide Check-in date" });
    } else if (!checkOut) {
      return res.status(400).json({ message: "Please provide Check-out date" });
    } else if (!numberOfGuests) {
      return res
        .status(400)
        .json({ message: "Please provide number of guests" });
    }

    Reservation.create(newReservation)
      .then((newReservation) => {
        return House.findByIdAndUpdate(houseId, {
          $push: { reservations: newReservation._id },
        });
      })
      .then((response) => res.json(response))
      .catch((err) => {
        console.log("error creating a new reservation...", err);
        res.status(500).json({
          message: "error creating a new reservation",
          error: err,
        });
      });
  }
);

// GET /api/reservations  -  Get list of reservations
router.get(
  "/reservations",
  isAuthenticated,
  attachCurrentUser,
  (req, res, next) => {
    Reservation.find({ userId: req.currentUser._id })
      .populate("house")
      .then((allReservations) => {
        if (allReservations.length === 0) {
          res.status(200).json({ message: "There are no Reservations" });
        } else {
          res.json(allReservations);
        }
      })
      .catch((err) => {
        console.log("error getting list of reservations...", err);
        res.status(500).json({
          message: "error getting list of reservations",
          error: err,
        });
      });
  }
);

module.exports = router;
