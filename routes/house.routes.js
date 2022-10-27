const router = require("express").Router();
const mongoose = require("mongoose");

const House = require("../models/House.model");
const Reservation = require("../models/Reservation.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// POST /api/houses  -  Creates a new house
router.post("/houses",isAuthenticated, (req, res, next) => {
  const { title, description, cost, location } = req.body;

  const newHouse = {
    title,
    description,
    cost,
    location,
    reservations: [],
  };

  if (!title) {
    return res
       .status(400)
       .json({ message: "Please provide the title" });
  }

  House.create(newHouse)
    .then((response) => res.json(response))
    .catch((err) => {
      console.log("error creating a new house...", err);
      res.status(500).json({
        message: "error creating a new house",
        error: err,
      });
    });
});

// GET /api/houses  -  Get list of houses
router.get("/houses", (req, res, next) => {
  House.find()
    .populate("reservations")
    .then((allHouses) => res.json(allHouses))
    .catch((err) => {
      console.log("error getting list of houses...", err);
      res.status(500).json({
        message: "error getting list of houses",
        error: err,
      });
    });
});

//  GET /api/houses/:houseId -  Retrieves a specific house by id
router.get("/houses/:houseId", (req, res, next) => {
  const { houseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(houseId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  House.findById(houseId)
    .populate("reservations")
    .then((house) => res.status(200).json(house))
    .catch((err) => {
      console.log("error getting a house details...", err);
      res.status(500).json({
        message: "error getting a house details",
        error: err,
      });
    });
});

// PUT  /api/houses/:houseId  -  Updates a specific house by id
router.put("/houses/:houseId", isAuthenticated, (req, res, next) => {
  const { houseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(houseId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  House.findByIdAndUpdate(houseId, req.body, { new: true })
    .then((updatedHouse) => {
      console.log(updatedHouse);
      res.json(updatedHouse);
    })
    .catch((err) => {
      console.log("error updating a house...", err);
      res.status(500).json({
        message: "error updating a house",
        error: err,
      });
    });
});

// DELETE  /api/houses/:houseId  -  Deletes a specific house by id
router.delete("/houses/:houseId",isAuthenticated, (req, res, next) => {
  const { houseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(houseId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  House.findByIdAndRemove(houseId)
    .then(() =>
      res.json({ message: `House with ${houseId} is removed successfully.` })
    )
    .catch((err) => {
      console.log("error deleting a house...", err);
      res.status(500).json({
        message: "error deleting a house",
        error: err,
      });
    });
});

module.exports = router;